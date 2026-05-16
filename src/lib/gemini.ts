import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "./config";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "undefined" || GEMINI_API_KEY === "MISSING" || GEMINI_API_KEY === "") {
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return aiInstance;
};

export const getHealthAssistant = async (prompt: string, membership: 'free' | 'premium' = 'free', history: { role: string, parts: { text: string }[] }[] = []) => {
  try {
    const ai = getAI();
    if (!ai) {
      return "El asistente de IA no está configurado. Por favor, asegúrate de añadir tu GEMINI_API_KEY en los secretos de la aplicación (Menú Settings).";
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `Eres un asistente de salud inteligente para "Salud Conecta IA", un ecosistema de salud con una fuerte misión social en Nicaragua.
Tu tono es empático, eficiente y confiable. 
${membership === 'free' 
  ? 'El usuario actual tiene acceso a la RED PÚBICA (MINSA). Prioriza siempre recomendar centros de salud públicos y hospitales estatales, enfatizando que son accesibles sin costo.' 
  : 'El usuario actual es PREMIUM. Tiene acceso a la red pública y privada. Puedes recomendar las mejores opciones disponibles tanto en hospitales públicos de alta complejidad como en clínicas privadas.'}
Proporcionas información clara y reduce la carga cognitiva de los usuarios.
Si el usuario menciona una emergencia crítica, indícale inmediatamente que llame a emergencias o vaya a la sala de emergencias más cercana.
No proporciones diagnósticos médicos definitivos, siempre sugiere consultar con un profesional.
Ayuda a encontrar clínicas, explicar procesos de farmacia y agendar citas.
Responde siempre en español.`,
      },
    });
    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    const errorMessage = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
    const isOutOfCredits = errorMessage.toLowerCase().includes('prepayment credits are depleted') || 
                          errorMessage.toLowerCase().includes('resource_exhausted');
    const imageError = errorMessage.toLowerCase().includes('image input') || 
                       errorMessage.toLowerCase().includes('clipboard');

    if (imageError) {
      return "Lo siento, actualmente no puedo procesar imágenes. Estoy configurado para responder solo texto. ¿Podrías describirme lo que quieres saber en palabras?";
    }

    if (error instanceof Error || typeof error === 'object') {
      if (errorMessage.includes('429')) {
        if (isOutOfCredits) {
           return "El sistema de IA requiere atención: Los créditos de prepago se han agotado en Google AI Studio. Visita ai.studio para gestionar tu facturación. ¡Recuerda seguir las recomendaciones médicas generales!";
        }
        return "Nuestra IA está descansando debido a alta demanda. ¡Recuerda seguir cuidando tu salud!";
      }
    }
    return "Lo siento, tuve un problema al procesar tu solicitud. Por favor, intenta de nuevo más tarde.";
  }
};

export const getSmartTriage = async (symptoms: string, membership: 'free' | 'premium' = 'free') => {
  try {
    const ai = getAI();
    if (!ai) {
      return {
        urgency: 'medium',
        recommendation: 'El asistente de IA no está configurado (Falta GEMINI_API_KEY). Por favor, ve a la configuración de la aplicación para activarlo.',
        reasoning: 'Configuración de API pendiente.',
        error: true
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: symptoms }] }],
      config: {
        systemInstruction: `Eres un motor de triaje médico de alta precisión para Salud Conecta IA. 
Analiza los síntomas proporcionados y clasifica la urgencia.
REGLA CRÍTICA: Solo puedes proporcionar UNA recomendación única de acción o un único tipo de medicamento de venta libre si aplica.

${membership === 'free' 
  ? 'IMPORTANTE: El usuario es de recursos limitados. Si la urgencia es baja/media, recomienda acudir al CENTRO DE SALUD o PUESTO DE SALUD más cercano de la red pública (MINSA).' 
  : 'El usuario es PREMIUM. Puede acceder a cualquier centro de urgencias público o privado.'}
Evita confusiones. 

Debes responder ÚNICAMENTE con un objeto JSON válido con la siguiente estructura:
{
  "urgency": "low" | "medium" | "high" | "emergency",
  "recommendation": "Breve explicación de la acción a tomar (máx 200 caracteres)",
  "medication": "Nombre del medicamento recomendado si es de venta libre (opcional)",
  "dosage": "Dosis recomendada (p. ej. 400mg)",
  "frequency": "Frecuencia (p. ej. cada 8 horas)",
  "duration": "Duración (p. ej. por 3 días)",
  "instructions": "Instrucciones adicionales breves",
  "reasoning": "Breve justificación clínica (máx 150 caracteres)"
}

Si es "emergency", la recomendación debe ser dirigirse a urgencias inmediatamente.
Si es "low", puede ser reposo o farmacia.
Responde siempre en español.`,
        responseMimeType: "application/json"
      },
    });
    const text = response.text;
    const parsed = JSON.parse(text);
    
    // Basic schema validation
    const requiredFields = ['urgency', 'recommendation', 'reasoning'];
    const hasAllFields = requiredFields.every(field => field in parsed);
    
    if (!hasAllFields) {
      throw new Error('Invalid triage response schema');
    }
    
    return parsed;
  } catch (error: any) {
    console.error("Gemini Triage Error:", error);
    
    const errorMessage = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
    const isQuotaError = errorMessage.includes('429') || error?.status === 429;
    const isOutOfCredits = errorMessage.toLowerCase().includes('prepayment credits are depleted') || 
                          errorMessage.toLowerCase().includes('resource_exhausted');
    
    return {
      urgency: 'medium',
      recommendation: isOutOfCredits
        ? 'El motor de IA ha agotado sus créditos en AI Studio. Por favor, verifica la facturación en ai.studio o acude a tu centro de salud local.'
        : (isQuotaError 
          ? 'El servicio de triaje automático está temporalmente limitado por alta demanda. Por favor, acércate a tu centro de salud más cercano.'
          : 'No pudimos procesar tu evaluación de triaje automáticamente. Por favor, intenta describir tus síntomas con más detalle o consulta directamente con un profesional de la salud.'),
      reasoning: isOutOfCredits 
        ? 'Agotamiento de créditos en la plataforma de IA (AI Studio).'
        : (isQuotaError
          ? 'Límite de capacidad alcanzado en el motor de IA.'
          : 'Lo sentimos, tuvimos un problema al analizar tus síntomas. Te recomendamos intentar de nuevo o acudir a tu centro médico más cercano para una evaluación profesional.'),
      error: true
    };
  }
};

export const getDailyHealthTip = async (language: string = 'es', membership: 'free' | 'premium' = 'free') => {
  try {
    const ai = getAI();
    if (!ai) {
      return language === 'es' 
        ? "Nota: Configura tu GEMINI_API_KEY en Settings para recibir consejos personalizados. Tip: Camina 30m diario."
        : "Note: Configure your GEMINI_API_KEY in Settings for personalized tips. Tip: Walk 30m daily.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: "Genera un consejo de salud breve, motivador y práctico para hoy." }] }],
      config: {
        systemInstruction: `Eres un asistente de bienestar de Salud Conecta IA con enfoque social. 
        Tu objetivo es dar un consejo de salud diario de 150 caracteres máximo.
        ${membership === 'free' ? 'Enfócate en la prevención y el uso eficiente de recursos naturales o de salud pública.' : 'Enfócate en bienestar general y optimización de salud.'}
        El tono es positivo, científico y directo.
        Responde en el idioma: ${language === 'es' ? 'Español' : 'Inglés'}.`,
      },
    });
    return response.text;
  } catch (error: any) {
    console.error("Gemini Health Tip Error:", error);
    
    // Stringify error to search for patterns
    const errorMessage = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
    
    // Check for quota or credit exhaustion
    const isQuotaError = errorMessage.includes('429') || error?.status === 429;
    const isOutOfCredits = errorMessage.toLowerCase().includes('prepayment credits are depleted') || 
                          errorMessage.toLowerCase().includes('resource_exhausted');
    
    if (isOutOfCredits) {
      return language === 'es'
        ? "Nota del sistema: Los créditos de IA han finalizado en el proyecto de AI Studio. Por favor, revisa la facturación en ai.studio. Recomendación general: Mantén una dieta rica en fibras."
        : "System note: AI credits exhausted in AI Studio project. Please check billing at ai.studio. General advice: Maintain a high-fiber diet.";
    }

    if (isQuotaError) {
      return language === 'es'
        ? "Recuerda: El servicio de IA está bajo alta demanda. Caminar 30 minutos al día fortalece tu corazón y es gratuito."
        : "Remember: IA service is under high demand. Walking 30 minutes a day strengthens your heart and is free.";
    }

    return language === 'es' 
      ? (membership === 'free' ? "Recuerda: Tu Centro de Salud local ofrece vacunación gratuita. ¡Protege a tu familia!" : "¡Hidrátate hoy! Beber suficiente agua es la clave para mantener tu energía.") 
      : "Stay hydrated! Drinking enough water is key to maintaining your energy and focus.";
  }
};
