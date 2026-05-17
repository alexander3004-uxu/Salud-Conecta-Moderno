import {
  collection, addDoc, query, where, getDocs,
  serverTimestamp, Timestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

// ── Types ──────────────────────────────────────────────────────────────────

export type ReportType =
  | 'confirm_correct'   // ✅ El sitio está correcto
  | 'wrong_location'    // 📍 Ubicación incorrecta
  | 'does_not_exist'    // ❌ Sitio no existe
  | 'wrong_type'        // 🏷️ Tipo mal clasificado
  | 'missing_facility'; // ➕ Falta un sitio aquí

export interface FacilityReport {
  id?: string;
  facilityId: string;           // ID Google Places (google-ChIJ...) o 'new'
  facilityName: string;
  reportType: ReportType;
  description?: string;         // comentario libre opcional
  suggestedType?: string;       // para 'wrong_type'
  suggestedLocation?: { lat: number; lng: number }; // para 'wrong_location'
  userId: string;               // uid Firebase o 'anonymous'
  createdAt?: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
  confidenceImpact: number;     // -0.3 a +0.2
}

export interface ReportSummary {
  facilityId: string;
  positiveCount: number;        // confirm_correct
  negativeCount: number;        // wrong_location + does_not_exist + wrong_type
  pendingCount: number;         // total reportes sin revisar
  lastReportAt?: Date;
}

// ── Constants ──────────────────────────────────────────────────────────────

const CONFIDENCE_IMPACT: Record<ReportType, number> = {
  confirm_correct:   +0.20,
  wrong_location:    -0.25,
  does_not_exist:    -0.30,
  wrong_type:        -0.15,
  missing_facility:  +0.00,  // no afecta al sitio existente
};

const COLLECTION = 'facility_reports';

// ── Service Functions ──────────────────────────────────────────────────────

/**
 * Envía un nuevo reporte a Firestore.
 */
export const submitReport = async (
  report: Omit<FacilityReport, 'id' | 'userId' | 'status' | 'confidenceImpact' | 'createdAt'>
): Promise<{ success: boolean; reportId?: string; error?: string }> => {
  try {
    const userId = auth.currentUser?.uid ?? 'anonymous';

    const doc = await addDoc(collection(db, COLLECTION), {
      ...report,
      userId,
      status: 'pending',
      confidenceImpact: CONFIDENCE_IMPACT[report.reportType],
      createdAt: serverTimestamp(),
    });

    return { success: true, reportId: doc.id };
  } catch (error) {
    console.error('[ReportService] Error submitting report:', error);
    return { success: false, error: 'No se pudo enviar el reporte. Intenta de nuevo.' };
  }
};

/**
 * Obtiene un resumen de reportes para una lista de facilityIds.
 * Usado para mostrar badges de confianza en el mapa.
 */
export const getReportSummaries = async (
  facilityIds: string[]
): Promise<Map<string, ReportSummary>> => {
  const summaryMap = new Map<string, ReportSummary>();

  if (facilityIds.length === 0) return summaryMap;

  try {
    // Firestore 'in' soporta máx 30 elementos por query
    const chunks: string[][] = [];
    for (let i = 0; i < facilityIds.length; i += 30) {
      chunks.push(facilityIds.slice(i, i + 30));
    }

    for (const chunk of chunks) {
      const q = query(
        collection(db, COLLECTION),
        where('facilityId', 'in', chunk),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);

      snapshot.docs.forEach(doc => {
        const data = doc.data() as FacilityReport;
        const existing = summaryMap.get(data.facilityId) ?? {
          facilityId: data.facilityId,
          positiveCount: 0,
          negativeCount: 0,
          pendingCount: 0,
        };

        existing.pendingCount++;
        if (data.reportType === 'confirm_correct') {
          existing.positiveCount++;
        } else if (data.reportType !== 'missing_facility') {
          existing.negativeCount++;
        }

        if (data.createdAt) {
          const reportDate = data.createdAt.toDate();
          if (!existing.lastReportAt || reportDate > existing.lastReportAt) {
            existing.lastReportAt = reportDate;
          }
        }

        summaryMap.set(data.facilityId, existing);
      });
    }
  } catch (error) {
    console.error('[ReportService] Error fetching report summaries:', error);
  }

  return summaryMap;
};

/**
 * Calcula el badge de confianza visual a partir de un ReportSummary.
 */
export const getConfidenceBadge = (
  summary?: ReportSummary
): 'verified' | 'unconfirmed' | 'warned' | 'flagged' => {
  if (!summary) return 'unconfirmed';
  if (summary.negativeCount >= 3) return 'flagged';
  if (summary.negativeCount >= 1) return 'warned';
  if (summary.positiveCount >= 1) return 'verified';
  return 'unconfirmed';
};
