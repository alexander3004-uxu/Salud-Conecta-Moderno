import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getHealthAssistant = async (prompt: string, history: { role: string, parts: { text: string }[] }[] = []) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `Eres un asistente de salud inteligente para "Salud Conecta IA", un ecosistema de salud pública. 
Tu tono es empático, eficiente y confiable. 
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

export const getSmartTriage = async (symptoms: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: symptoms }] }],
      config: {
        systemInstruction: `Eres un motor de triaje médico de alta precisión para Salud Conecta IA. 
Analiza los síntomas proporcionados y clasifica la urgencia.
REGLA CRÍTICA: Solo puedes proporcionar UNA recomendación única de acción o un único tipo de medicamento de venta libre si aplica.
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
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Triage Error:", error);
    return {
      urgency: 'medium',
      recommendation: 'Ante la duda, te recomendamos consultar con un profesional de la salud en el centro más cercano.',
      reasoning: 'Error en el procesamiento del triaje automatizado.'
    };
  }
};
