import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { TriageRecord, OperationType, FirestoreErrorInfo, Clinic } from '../types';
import { getClinics } from './clinicService'; // Importar getClinics para obtener los centros verificados
import { getCurrentLocation, getNearestFacility, getEmergencyFacilities, estimateTravelTime, calculateDistance } from '../lib/geolocationService';
import centrosSaludData from '../data/centros_salud.json';
import { getSmartTriage } from '../lib/gemini';
import { buscarSintoma, buscarMultiplesMedicamentos } from '../data/granadaDatabase';

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

export const saveTriageRecord = async (record: Omit<TriageRecord, 'id' | 'createdAt'>) => {
  const path = 'triages';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...record,
      createdAt: new Date().toISOString(),
      serverTimestamp,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const syncClinicToFirestore = async (clinic: Clinic) => {
  const path = 'verified_clinics';
  try {
    // Usamos el ID (google-xxx) como ID del documento para evitar duplicados y actuar como caché
    const docRef = doc(db, path, clinic.id);
    await setDoc(docRef, {
      ...clinic,
      updatedAt: new Date().toISOString(),
      serverTimestamp,
    }, { merge: true });
  } catch (error) {
    console.error('Error syncing clinic to cache:', error);
  }
};

export const getUserTriages = async (userId: string): Promise<TriageRecord[]> => {
  const path = 'triages';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TriageRecord));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
};

export interface TriageWithLocationResult {
  severity: 'low' | 'medium' | 'high' | 'emergency';
  recommendation: string;
  reasoning: string;
  medication?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  };
  homeRemedies?: string;
  warningSignsToWatch?: string;
  locationInfo?: {
    nearestFacility: string;
    distanceKm: number;
    travelTime: string;
    isEmergency: boolean;
    clinic?: Clinic; // Triage result carries the full clinic object for routing
    userLat?: number;
    userLng?: number;
    closestHospital?: Clinic;
    closestHospitalDistanceKm?: number;
    closestHospitalTravelTime?: string;
    closestCenter?: Clinic;
    closestCenterDistanceKm?: number;
    closestCenterTravelTime?: string;
  };
  error?: boolean;
}
 
export async function getEnhancedTriageWithLocation(symptoms: string, membership: 'free' | 'premium' = 'free'): Promise<TriageWithLocationResult> {
  try {
    // Coordenadas por defecto (Granada Centro) alineadas con la base de datos local
    let userLat = 11.93749;
    let userLng = -85.968;

    const userLocation = await getCurrentLocation();
    if (userLocation) {
      userLat = userLocation.latitude;
      userLng = userLocation.longitude;
    }

    // 1. Obtener la red completa combinada (Firestore dinámicas + Red pública y centros de Granada + otros hospitales de Nicaragua)
    const dbClinics = await getClinics();
    
    const staticClinics: Clinic[] = centrosSaludData.map((c: any, i: number) => {
        let mappedType = 'clinic';
        const rawType = (c.type || '').toLowerCase();
        if (rawType.includes('hospital')) mappedType = 'hospital';
        else if (rawType.includes('farmacia')) mappedType = 'pharmacy';
        else if (rawType.includes('laboratorio')) mappedType = 'laboratory';

        return {
          id: `nat-${i}`,
          name: c.name,
          type: mappedType as 'hospital' | 'clinic' | 'pharmacy' | 'laboratory',
          sector: 'public',
          location: { lat: c.location.lat, lng: c.location.lng },
          address: c.address,
          phone: c.phone || '',
          open24h: rawType.includes('hospital'),
          isOpen: true,
          rating: 4.5,
          reviews: 0,
          description: c.sector || '',
          services: c.services || [],
        } as Clinic;
    });
    const fullNetwork = [...dbClinics, ...staticClinics];

    // 2. Filtrar la red de clínicas de acuerdo a la membresía del usuario
    // Free: Solo red pública (MINSA) o farmacias locales
    // Premium: Red pública + clínicas privadas premium registradas
    const allowedFacilities = membership === 'free'
      ? fullNetwork.filter(c => c.sector === 'public' || c.type === 'pharmacy')
      : fullNetwork;

    // 3. Evaluar los síntomas y determinar la urgencia
    let aiTriage: any;
    let localFallbackUsed = false;

    try {
      aiTriage = await getSmartTriage(symptoms, membership);
      if (aiTriage.error) {
        throw new Error("Gemini returned error state or is not configured.");
      }
    } catch (e) {
      console.warn("AI Triage failed, falling back to local database:", e);
      localFallbackUsed = true;

      // Usar búsqueda de síntoma local
      const matchingSymptom = buscarSintoma(symptoms);
      
      if (matchingSymptom) {
        // Encontrar medicamentos locales sugeridos para este síntoma
        const matchingMeds = buscarMultiplesMedicamentos(matchingSymptom.nombre);
        const med = matchingMeds.length > 0 ? matchingMeds[0] : null;

        let localRecommendation = matchingSymptom.descripcion;
        
        let homeRemediesText = matchingSymptom.cuidados_casa ? matchingSymptom.cuidados_casa.join('\n- ') : '';

        aiTriage = {
          urgency: matchingSymptom.urgencia_default === 'ALTA' ? 'high' : matchingSymptom.requiere_atencion ? 'emergency' : 'medium',
          recommendation: localRecommendation,
          reasoning: `Heurística de consulta local activa (Coincidencia: ${matchingSymptom.nombre}).`,
          medication: med ? {
            name: `${med.nombre_es} (${med.nombres_comerciales.join(', ')})`,
            dosage: med.dosis_adulto || '',
            frequency: 'Según indicación',
            duration: '3-5 días'
          } : undefined,
          homeRemedies: homeRemediesText ? `- ${homeRemediesText}` : 'Mantente hidratado y descansa.',
          warningSignsToWatch: matchingSymptom.urgencia_default === 'ALTA' ? 'Fiebre persistente, dolor incontrolable, dificultad respiratoria severa.' : 'Si los síntomas no mejoran en 48h.',
          error: false
        };
      } else {
        // Fallback genérico si no hay coincidencia exacta de síntoma en Granada pero hay conectividad fallida
        aiTriage = {
          urgency: 'medium',
          recommendation: 'No pudimos conectar con el motor de IA inteligente, pero le sugerimos mantenerse hidratado, tomar su temperatura y, si sus síntomas empeoran, acudir al centro de salud MINSA o farmacia más cercana para evaluación presencial.',
          reasoning: 'Evaluación local genérica (Falla de conexión a IA, y síntoma no encontrado en la base de datos desconectada).',
          homeRemedies: '- Descansar\n- Tomar abundantes líquidos\n- Controlar la temperatura',
          warningSignsToWatch: 'Fiebre muy alta, dificultad para respirar, dolor persistente en el pecho, sangrado o pérdida de conciencia.',
          error: false
        };
      }
    }

    // 4. Calcular el centro de salud y el hospital más cercano matemáticamente usando la fórmula Haversine basada en el GPS real del usuario
    let closestClinic = null;
    let minDistance = Infinity;

    let closestHospital = null;
    let minHospitalDistance = Infinity;

    let closestCenter = null;
    let minCenterDistance = Infinity;

    for (const clinic of allowedFacilities) {
      if (clinic.location) {
        const dist = calculateDistance(userLat, userLng, clinic.location.lat, clinic.location.lng);
        
        // Overall closest clinic
        if (dist < minDistance) {
          minDistance = dist;
          closestClinic = clinic;
        }

        // Closest Hospital vs Closest Health Center
        const isHospital = clinic.type.startsWith('hospital') || clinic.type === 'hospital';
        if (isHospital) {
          if (dist < minHospitalDistance) {
            minHospitalDistance = dist;
            closestHospital = clinic;
          }
        } else {
          if (dist < minCenterDistance) {
            minCenterDistance = dist;
            closestCenter = clinic;
          }
        }
      }
    }

    // 5. Mapear niveles de urgencia dinámicos (unificado: emergency en lugar de critical)
    let severity: 'low' | 'medium' | 'high' | 'emergency' = 'medium';
    if (aiTriage.urgency === 'emergency') {
      severity = 'emergency';
    } else if (aiTriage.urgency === 'high') {
      severity = 'high';
    } else if (aiTriage.urgency === 'low') {
      severity = 'low';
    }

    const isUrgent = severity === 'emergency' || severity === 'high';
    let recommendation = aiTriage.recommendation || '';

    // 6. Seleccionar el centro principal según la gravedad:
    //    - emergency/high → priorizar hospital (tiene urgencias 24h)
    //    - medium/low → priorizar centro de salud (consulta general)
    const primaryFacility = isUrgent
      ? (closestHospital || closestCenter || closestClinic)
      : (closestCenter || closestHospital || closestClinic);

    if (isUrgent && primaryFacility) {
      const sectorTag = primaryFacility.sector === 'private' ? 'Centro Privado Premium' : 'Red Pública (MINSA)';
      recommendation = `🚨 **ATENCIÓN URGENTE**: Estás experimentando síntomas de alerta. Acuda a emergencias de inmediato.\n\nPor tu ubicación GPS actual, el hospital más cercano es: **"${primaryFacility.name}"** (${sectorTag}).\n\n${recommendation}`;
    } else if (primaryFacility) {
      const sectorTag = primaryFacility.sector === 'private' ? 'Centro Privado Premium' : 'Red Pública (MINSA)';
      recommendation = `${recommendation}\n\n📍 **Centro de salud más cercano**: "${primaryFacility.name}" (${sectorTag}).`;
    }

    const finalDistance = minDistance === Infinity ? 0 : minDistance;

    return {
      severity,
      recommendation,
      reasoning: aiTriage.reasoning || `Consulta analizada localmente. Distancia al centro más cercano: ${finalDistance.toFixed(1)} km.`,
      medication: typeof aiTriage.medication === 'object' ? aiTriage.medication : aiTriage.medication ? {
        name: aiTriage.medication,
        dosage: aiTriage.dosage || '',
        frequency: aiTriage.frequency || '',
        duration: aiTriage.duration || ''
      } : undefined,
      homeRemedies: aiTriage.homeRemedies,
      warningSignsToWatch: aiTriage.warningSignsToWatch,
      locationInfo: closestClinic ? {
        nearestFacility: closestClinic.name,
        distanceKm: finalDistance,
        travelTime: estimateTravelTime(finalDistance),
        isEmergency: isUrgent,
        clinic: closestClinic,
        userLat,
        userLng,
        closestHospital: closestHospital || undefined,
        closestHospitalDistanceKm: minHospitalDistance === Infinity ? undefined : minHospitalDistance,
        closestHospitalTravelTime: minHospitalDistance === Infinity ? undefined : estimateTravelTime(minHospitalDistance),
        closestCenter: closestCenter || undefined,
        closestCenterDistanceKm: minCenterDistance === Infinity ? undefined : minCenterDistance,
        closestCenterTravelTime: minCenterDistance === Infinity ? undefined : estimateTravelTime(minCenterDistance),
      } : undefined,
      error: !!aiTriage.error
    };
  } catch (error) {
    console.error('Error en triaje:', error);
    return {
      severity: 'medium',
      recommendation: 'Consulte con un médico profesional si sus síntomas persisten.',
      reasoning: 'Error al ejecutar la consulta.',
      error: true
    };
  }
}