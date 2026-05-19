import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { TriageRecord, OperationType, FirestoreErrorInfo, Clinic } from '../types';
import { getClinics } from './clinicService'; // Importar getClinics para obtener los centros verificados
import { getCurrentLocation, getNearestFacility, getEmergencyFacilities, estimateTravelTime, calculateDistance } from '../lib/geolocationService';
import { NICARAGUA_HOSPITALS } from '../data/nicaraguaHospitals';
import { PUBLIC_HEALTH_NETWORK } from '../data/nicaraguaPublicHealthNetwork';
import { getSmartTriage } from '../lib/gemini';

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
    // Coordenadas por defecto (Managua Centro) alineadas con el mapa
    let userLat = 12.1328;
    let userLng = -86.2504;

    const userLocation = await getCurrentLocation();
    if (userLocation) {
      userLat = userLocation.latitude;
      userLng = userLocation.longitude;
    }

    // 1. Obtener la red completa combinada (Firestore dinámicas + Red pública y de hospitales estáticos de Nicaragua)
    const dbClinics = await getClinics();
    const staticClinics: Clinic[] = [
      ...NICARAGUA_HOSPITALS.map((h, i) => ({ id: `static-h-${i}`, ...h } as Clinic)),
      ...PUBLIC_HEALTH_NETWORK.map((h, i) => ({ id: `static-p-${i}`, ...h } as Clinic))
    ];
    const fullNetwork = [...dbClinics, ...staticClinics];

    // 2. Filtrar la red de clínicas de acuerdo a la membresía del usuario
    // Free: Solo red pública (MINSA)
    // Premium: Red pública + clínicas privadas premium registradas
    const allowedFacilities = membership === 'free'
      ? fullNetwork.filter(c => c.sector === 'public')
      : fullNetwork;

    // 3. Evaluar los síntomas y determinar la urgencia con la IA (Gemini)
    const aiTriage = await getSmartTriage(symptoms, membership);

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

    // 5. Mapear niveles de urgencia dinámicos de la IA (unificado: emergency en lugar de critical)
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
      recommendation = `Estás experimentando un síntoma de urgencia, debes acudir a un hospital de inmediato. De acuerdo a tu ubicación GPS, el hospital más cercano es: "${primaryFacility.name}" (${sectorTag}).`;
    } else if (primaryFacility) {
      const sectorTag = primaryFacility.sector === 'private' ? 'Centro Privado Premium' : 'Red Pública (MINSA)';
      recommendation = `${recommendation} De acuerdo a tu ubicación, el centro de salud más cercano es: "${primaryFacility.name}" (${sectorTag}).`;
    }

    const finalDistance = minDistance === Infinity ? 0 : minDistance;

    return {
      severity,
      recommendation,
      reasoning: aiTriage.reasoning || `Triaje analizado para suscripción ${membership.toUpperCase()}. Distancia al centro más cercano: ${finalDistance.toFixed(1)} km.`,
      medication: aiTriage.medication ? {
        name: aiTriage.medication,
        dosage: aiTriage.dosage || '',
        frequency: aiTriage.frequency || '',
        duration: aiTriage.duration || ''
      } : undefined,
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
      reasoning: 'Error al ejecutar el triaje.',
      error: true
    };
  }
}