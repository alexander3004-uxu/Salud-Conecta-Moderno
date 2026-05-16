import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { TriageRecord, OperationType, FirestoreErrorInfo } from '../types';
import { getCurrentLocation, getNearestFacility, getEmergencyFacilities, estimateTravelTime, calculateDistance } from '../lib/geolocationService';
import { NICARAGUA_HOSPITALS } from '../data/nicaraguaHospitals';
import { PUBLIC_HEALTH_NETWORK } from '../data/nicaraguaPublicHealthNetwork';

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
  severity: 'low' | 'medium' | 'high' | 'critical';
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
  };
  error?: boolean;
}

export async function getEnhancedTriageWithLocation(symptoms: string, membership: 'free' | 'premium' = 'free'): Promise<TriageWithLocationResult> {
  try {
    // Coordenadas por defecto (Managua Centro) alineadas con el mapa
    let userLat = 12.1328;
    let userLng = -86.2504;
    
    // Combinamos ambas redes para tener cobertura total, especialmente la pública detallada
    const fullNetwork = [...NICARAGUA_HOSPITALS, ...PUBLIC_HEALTH_NETWORK];

    const userLocation = await getCurrentLocation();
    if (userLocation) {
      userLat = userLocation.latitude;
      userLng = userLocation.longitude;
    }

    let nearestFacility = null;
    let distanceKm = 0;

    if (userLat !== 12.1328) {
      const result = getNearestFacility(fullNetwork, userLat, userLng, membership === 'free');
      nearestFacility = result.facility;
      distanceKm = result.distanceKm;
    }

    let isEmergency = false;
    let nearestEmergency = null;

    if (userLat !== 12.1328) {
      const emergencyHospitals = getEmergencyFacilities(fullNetwork);
      if (emergencyHospitals?.length > 0) {
        for (const hospital of emergencyHospitals) {
          if (hospital.location) {
            const dist = calculateDistance(userLat, userLng, hospital.location.lat, hospital.location.lng);
            if (dist < 15 && dist < distanceKm) {
              distanceKm = dist;
              nearestEmergency = hospital;
              isEmergency = true;
            }
          }
        }
      }
    }

    if (isEmergency && nearestEmergency) {
      return {
        severity: 'critical',
        recommendation: `Llame al 911 inmediatamente o acuda a ${nearestEmergency.name} por emergencia (${nearestEmergency.address}).`,
        reasoning: `Caso de emergencia crítica detectado basado en los síntomas: ${symptoms}. Hospital más cercano: ${nearestEmergency.name} a ${distanceKm}km.`,
        locationInfo: {
          nearestFacility: nearestEmergency.name,
          distanceKm: distanceKm,
          travelTime: estimateTravelTime(distanceKm),
          isEmergency: true
        },
        error: false
      };
    }

    if (userLat !== 12.1328) {
      return {
        severity: 'high',
        recommendation: membership === 'free'
          ? `Acuda a ${nearestFacility?.name || 'el centro de salud más cercano'}. Si no hay servicios públicos disponibles, llame a emergencias.`
          : `Acuda a la institución disponible más cercana.`,
        reasoning: membership === 'free' ? 'Caso de urgencia detectado. Priorizando red pública.' : 'Caso de alta prioridad.',
        locationInfo: {
          nearestFacility: nearestFacility?.name || 'Centro de salud desconocido',
          distanceKm: distanceKm,
          travelTime: estimateTravelTime(distanceKm),
          isEmergency: false
        },
        error: false
      };
    }

    return {
      severity: 'high',
      recommendation: membership === 'free'
        ? 'Acuda al centro de salud público más cercano. Los servicios de salud pública están disponibles sin costo.'
        : 'Acuda a una institución de salud disponible.',
      reasoning: 'Caso de alta prioridad detectado.',
      error: false
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