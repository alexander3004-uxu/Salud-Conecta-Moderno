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
  // Check if it's literally the string "undefined", "null", or empty/placeholder
  const isInvalid = 
    envVal === undefined || 
    envVal === null || 
    envVal === "" || 
    envVal === "undefined" || 
    envVal === "null" || 
    envVal === "MISSING" || 
    envVal === "YOUR_API_KEY";

  if (isInvalid) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Config] Using fallback for ${name}`);
    }
    return fallback;
  }
  
  return String(envVal);
};

export const GOOGLE_MAPS_KEY = getApiKey(process.env.GOOGLE_MAPS_PLATFORM_KEY, FALLBACK_MAPS_KEY, "Google Maps");
export const GEMINI_API_KEY = getApiKey(process.env.GEMINI_API_KEY, FALLBACK_GEMINI_KEY, "Gemini");

export const APP_CONFIG = {
  isDevelopment: process.env.NODE_ENV !== "production",
  apiUrl: typeof window !== "undefined" ? window.location.origin : "",
};
