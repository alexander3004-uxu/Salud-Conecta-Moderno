import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getHealthAssistant = async (prompt: string, membership: 'free' | 'premium' = 'free', history: { role: string, parts: { text: string }[] }[] = []) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, tuve un problema al procesar tu solicitud. Por favor, intenta de nuevo más tarde.";
  }
};

export const getSmartTriage = async (symptoms: string, membership: 'free' | 'premium' = 'free') => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
  } catch (error) {
    console.error("Gemini Triage Error:", error);
    return {
      urgency: 'medium',
      recommendation: 'No pudimos procesar tu evaluación de triaje automáticamente. Por favor, intenta describir tus síntomas con más detalle o consulta directamente con un profesional de la salud.',
      reasoning: 'Lo sentimos, tuvimos un problema al analizar tus síntomas. Te recomendamos intentar de nuevo o acudir a tu centro médico más cercano para una evaluación profesional.',
      error: true
    };
  }
};

export const getDailyHealthTip = async (language: string = 'es', membership: 'free' | 'premium' = 'free') => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
  } catch (error) {
    console.error("Gemini Health Tip Error:", error);
    return language === 'es' 
      ? (membership === 'free' ? "Recuerda: Tu Centro de Salud local ofrece vacunación gratuita. ¡Protege a tu familia!" : "¡Hidrátate hoy! Beber suficiente agua es la clave para mantener tu energía.") 
      : "Stay hydrated! Drinking enough water is key to maintaining your energy and focus.";
  }
};
