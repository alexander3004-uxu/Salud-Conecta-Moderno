/**
 * CENTRALIZED CONFIGURATION FOR API KEYS
 * 
 * IMPORTANT: In a production environment, these should be managed via environment variables.
 */

// Fallback Keys provided by the user for the development instance
const FALLBACK_GEMINI_KEY = "AIzaSyD3K6Ari5CXtxOPecZZhp7sKyzlwagdxc4";
const FALLBACK_MAPS_KEY = "AIzaSyCFpqnhjJpiniUqyVoKCTL39nPaPJmHTRg";

/**
 * Robust API key retriever that handles various build-time injection styles
 */
const getApiKey = (envVal: any, fallback: string, name: string) => {
  // Trim and check for common placeholder or invalid values
  const val = typeof envVal === 'string' ? envVal.trim() : envVal;
  
  const isInvalid = 
    val === undefined || 
    val === null || 
    val === "" || 
    val === "undefined" || 
    val === "null" || 
    val === "MISSING" || 
    val === "YOUR_API_KEY" ||
    (typeof val === 'string' && val.length < 10); // Standard keys are much longer

  if (isInvalid) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Config] Using fallback for ${name} due to invalid value: "${val}"`);
    }
    return fallback;
  }
  
  return String(val);
};

export const GOOGLE_MAPS_KEY = getApiKey(process.env.GOOGLE_MAPS_PLATFORM_KEY, FALLBACK_MAPS_KEY, "Google Maps");
export const GEMINI_API_KEY = getApiKey(process.env.GEMINI_API_KEY, FALLBACK_GEMINI_KEY, "Gemini");

export const APP_CONFIG = {
  isDevelopment: process.env.NODE_ENV !== "production",
  apiUrl: typeof window !== "undefined" ? window.location.origin : "",
};
