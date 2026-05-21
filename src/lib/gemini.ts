import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "./config";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const isInvalidKey = !GEMINI_API_KEY || ["undefined", "MISSING", ""].includes(GEMINI_API_KEY.trim());
    if (isInvalidKey) {
      console.warn("[AI Configuration] GEMINI_API_KEY is missing or invalid. Restart the dev server.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return aiInstance;
};

export const MODEL = "gemini-2.0-flash";

// Función para obtener consejo diario de salud
export const getDailyHealthTip = async (language: string = 'es', membership: 'free' | 'premium' = 'free') => {
  try {
    const ai = getAI();
    if (!ai) return "Consulta regular a tu centro de salud local.";

    const context = membership === 'free'
      ? 'Recuerda que la Red Pública (MINSA) en Nicaragua ofrece servicios de salud gratuitos.'
      : 'Como usuario Premium tienes acceso prioritario a centros de salud. ¿Recordas revisar tus citas pendientes?';

    const result = await ai.models.generateContent({
      model: MODEL,
      config: { systemInstruction: "Respuestas breves de máximo 30 caracteres, inicia con 💡 " },
      contents: [{ role: 'user', parts: [{ text: `Consejo de salud breve. ${context}` }] }],
    });

    return (result.text ?? "").substring(0, 30);
  } catch (error: any) {
    if (error?.status === 429 || String(error).includes('429')) {
      console.warn("Gemini Quota Exceeded (Daily Tip) - Usando fallback.");
    } else {
      console.error("Daily health tip error:", error);
    }
    return "¡Bebe agua y mantente activo! 💪";
  }
};

// Función de asistente general de salud
export const getHealthAssistant = async (message: string, membership: 'free' | 'premium' = 'free', history: Array<{role: 'model' | 'user'; parts: Array<{text: string}>}>): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) return "El asistente de IA no está configurado (Falta GEMINI_API_KEY). Por favor, contacte a soporte.";

    const membershipContext = membership === 'free'
      ? 'Eres un asistente de salud para usuarios de la Red Pública de Nicaragua (MINSA). Sé empático y enfócate en consejos preventivos y remisión a servicios gratuitos.'
      : 'Eres un asistente salud premium. Proporciona información detallada sobre servicios y prevención. NO ofrecemos preguntas de emergencia.';

    const prompt = `Respóndeme sobre salud y consejos preventivos (${membership === 'free' ? '50' : '100'} caracteres). Sé profesional. ${membership === 'free' ? 'SI EMERGENCIA, DI: Acude a urgencias ahora.' : 'Usa citas preventivas únicamente.'}; ${message}`;

    const result = await ai.models.generateContent({ model: MODEL, contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    return (result.text ?? "").substring(0, 200);
  } catch (error: any) {
    if (error?.status === 429 || String(error).includes('429')) {
      console.warn("Gemini Quota Exceeded (Assistant) - Usando fallback.");
    } else {
      console.error("Health assistant error:", error);
    }
    return membership === 'free' ? 'Acude a tu centro de salud local MINSA para atención inmediata.' : 'Escríbelo en el chat de citas para cuadrar tu próxima visita.';
  }
};

// Sistema de triaje
export const getSmartTriage = async (symptoms: string, membership: 'free' | 'premium' = 'free') => {
  try {
    const ai = getAI();
    if (!ai) {
      return { urgency: 'medium', recommendation: 'Busque atención médica profesional.', reasoning: 'Configuración pendiente.', error: true };
    }

    const membershipContext = membership === 'free'
      ? 'CONTEXTO SOCIAL: Prioriza siempre la Red Pública (MINSA).'
      : 'CONTEXTO PREMIUM: Acceso a servicios privados y públicos.';

    const systemInstruction = `Motor de triaje médico para Nicaragua. Respóndeme ÚNICAMENTE JSON:
{
  "urgency": "low" | "medium" | "high" | "emergency",
  "recommendation": "Acción a tomar",
  "reasoning": "Justificación breve"
}
${membershipContext}`;

    const result = await ai.models.generateContent({
      model: MODEL,
      config: { systemInstruction, responseMimeType: "application/json" },
      contents: [{ role: 'user', parts: [{ text: symptoms }] }],
    });

    const text = result.text ?? "";
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing Gemini JSON response:", parseError, "Raw:", text);
      return { urgency: 'medium', recommendation: 'Error al procesar. Busque atención médica.', reasoning: 'JSON inválido.', error: true };
    }

    const requiredFields = ['urgency', 'recommendation', 'reasoning'];
    if (!requiredFields.every(field => field in parsed)) {
      throw new Error('Invalid schema');
    }

    return parsed;
  } catch (error: any) {
    if (error?.status === 429 || String(error).includes('429')) {
      console.warn("Gemini Quota Exceeded (Triage) - Usando fallback local offline.");
    } else {
      console.error("Gemini Triage Error:", error);
    }
    const msg = typeof error === 'string' ? error : (error?.message || 'Error');
    return {
      urgency: 'medium',
      recommendation: msg.toLowerCase().includes('credits') ? 'Verifique créditos en ai.studio.' : 'Busque atención médica profesional.',
      reasoning: 'Error al procesar la consulta.',
      error: true
    };
  }
};