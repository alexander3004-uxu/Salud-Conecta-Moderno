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
    if (!ai) return "Consulta regular a tu centro de salud local y mantente hidratado.";

    const context = membership === 'free'
      ? 'Recuerda que la Red Pública (MINSA) en Nicaragua ofrece servicios de salud gratuitos en centros de salud y hospitales departamentales.'
      : 'Como usuario Premium tienes acceso prioritario a la red de clínicas privadas y públicas en Nicaragua. Aprovecha tus chequeos preventivos.';

    const systemInstruction = `Eres un asesor de salud pública nicaragüense. Genera un tip de salud diario breve, útil y preventivo. El tip no debe exceder de 150 caracteres. Inicia siempre con un emoji adecuado (ej. 💡, 💧, 🏃‍♂️). Considera este contexto del usuario: ${context}`;

    const result = await ai.models.generateContent({
      model: MODEL,
      config: { systemInstruction },
      contents: [{ role: 'user', parts: [{ text: `Dame un tip de salud preventivo.` }] }],
    });

    return (result.text ?? "").substring(0, 150);
  } catch (error: any) {
    if (error?.status === 429 || String(error).includes('429')) {
      console.warn("Gemini Quota Exceeded (Daily Tip) - Usando fallback.");
    } else {
      console.error("Daily health tip error:", error);
    }
    return "💡 ¡Bebe al menos 8 vasos de agua al día y mantén una alimentación balanceada! Tu salud es primero. 💪";
  }
};

// Función de asistente general de salud
export const getHealthAssistant = async (message: string, membership: 'free' | 'premium' = 'free', history: Array<{role: 'model' | 'user'; parts: Array<{text: string}>}>): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) return "El asistente de IA no está configurado (Falta GEMINI_API_KEY). Por favor, contacte a soporte.";

    const membershipContext = membership === 'free'
      ? 'Contexto del paciente: Usuario de la Red Pública de Nicaragua (MINSA). Enfatiza remedios caseros seguros, prevención y cuándo acudir al Centro de Salud o Puesto de Salud gratuito más cercano.'
      : 'Contexto del paciente: Usuario Premium. Puedes recomendar consultas especializadas, estudios privados y clínicas premium, además de la red pública.';

    const systemInstruction = `Eres "Salud Conecta AI", un médico general virtual y empático enfocado en la población nicaragüense.
Tus reglas:
1. Responde de forma clara, profesional pero cálida.
2. ${membershipContext}
3. Usa terminología que se entienda en Nicaragua (ej. MINSA, Centro de Salud, Puesto de Salud, Hospital Departamental).
4. No recetes antibióticos ni medicamentos controlados. Puedes sugerir medicamentos de venta libre (OTC) como acetaminofén, ibuprofeno, loratadina, etc., indicando siempre "Consulta a un médico o farmacéutico local".
5. Si detectas síntomas de emergencia (dolor de pecho, dificultad para respirar grave, sangrado abundante), indica de inmediato acudir a urgencias de forma destacada con 🚨.
6. Puedes usar formato Markdown (negritas, listas) para estructurar tu respuesta. Sé detallado y proporciona información útil y completa, sin límite estricto de caracteres, pero directo al punto.`;

    const contents = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [...h.parts]
    }));
    
    // Añadimos el mensaje actual
    contents.push({ role: 'user', parts: [{ text: message }] });

    const result = await ai.models.generateContent({ 
      model: MODEL, 
      config: { systemInstruction },
      contents 
    });
    return result.text ?? "Lo siento, no pude generar una respuesta.";
  } catch (error: any) {
    if (error?.status === 429 || String(error).includes('429')) {
      console.warn("Gemini Quota Exceeded (Assistant) - Usando fallback.");
    } else {
      console.error("Health assistant error:", error);
    }
    return 'Hubo un error de conexión con la IA. Si es una urgencia, por favor acude a tu centro de salud MINSA o clínica más cercana para atención inmediata.';
  }
};

// Sistema de triaje
export const getSmartTriage = async (symptoms: string, membership: 'free' | 'premium' = 'free') => {
  try {
    const ai = getAI();
    if (!ai) {
      return { urgency: 'medium', recommendation: 'Busque atención médica profesional presencial.', reasoning: 'El servicio de IA inteligente no está configurado. La evaluación se ha omitido.', error: true };
    }

    const membershipContext = membership === 'free'
      ? 'El paciente usará la Red Pública (MINSA).'
      : 'El paciente tiene acceso a servicios privados premium y públicos.';

    const systemInstruction = `Eres el Motor de Triaje Clínico de Salud Conecta para Nicaragua. Debes analizar los síntomas proporcionados y devolver ÚNICAMENTE un JSON válido con este formato:
{
  "urgency": "low" | "medium" | "high" | "emergency",
  "recommendation": "Acción detallada a tomar. Usa lenguaje empático y claro.",
  "reasoning": "Justificación clínica breve de la urgencia asignada.",
  "medication": {
    "name": "Nombre de medicamento genérico OTC sugerido (ej. Acetaminofén, Ibuprofeno, Suero oral). SOLO VENTA LIBRE. Si no aplica, dejar vacío.",
    "dosage": "Dosis sugerida adultos (ej. 500mg)",
    "frequency": "Frecuencia (ej. Cada 8 horas)",
    "duration": "Duración sugerida (ej. Por 3 días)"
  },
  "homeRemedies": "Consejos breves de cuidado en casa.",
  "warningSignsToWatch": "Señales de alarma a vigilar que indicarían empeoramiento."
}

CONTEXTO: ${membershipContext}
REGLAS:
- Nunca sugieras antibióticos en "medication".
- Si es "emergency", sé enfático en buscar atención inmediata (Hospital MINSA o privado).
- Devuelve SOLO el JSON sin markdown de bloques de código ni texto adicional.`;

    const result = await ai.models.generateContent({
      model: MODEL,
      config: { 
        systemInstruction, 
        responseMimeType: "application/json" 
      },
      contents: [{ role: 'user', parts: [{ text: symptoms }] }],
    });

    const text = result.text ?? "";
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing Gemini JSON response:", parseError, "Raw:", text);
      return { urgency: 'medium', recommendation: 'Error al procesar el formato de la IA. Por favor busque atención médica presencial.', reasoning: 'Formato JSON inválido recibido de Gemini.', error: true };
    }

    const requiredFields = ['urgency', 'recommendation', 'reasoning'];
    if (!requiredFields.every(field => field in parsed)) {
      throw new Error('Invalid schema from Gemini');
    }

    return parsed;
  } catch (error: any) {
    if (error?.status === 429 || String(error).includes('429')) {
      console.warn("Gemini Quota Exceeded (Triage) - Usando fallback local offline.");
    } else {
      console.error("Gemini Triage Error:", error);
    }
    const msg = typeof error === 'string' ? error : (error?.message || 'Error desconocido');
    return {
      urgency: 'medium',
      recommendation: msg.toLowerCase().includes('credits') ? 'Sus créditos de IA podrían estar agotados. Acuda al centro de salud.' : 'Ocurrió un problema conectando con el motor de triaje. Si tiene dudas graves, busque atención médica profesional.',
      reasoning: 'Fallback de error por falla de red o configuración.',
      error: true
    };
  }
};