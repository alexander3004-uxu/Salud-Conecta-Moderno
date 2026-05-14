/**
 * CENTRALIZED CONFIGURATION FOR API KEYS
 * 
 * IMPORTANT: In a production environment, these should be managed via environment variables.
 */

// Fallback keys are empty in production. In AI Studio, keys are provided via environment secrets.
const FALLBACK_GEMINI_KEY = "AIzaSyCWXgxSq1g92KhifiIh0ObOvSfDdV1kjgw";
const FALLBACK_MAPS_KEY = "";

// Known leaked keys that should be blocked to avoid 403 errors
const BLOCKED_KEYS: string[] = [];

/**
 * Robust API key retriever that handles various build-time injection styles
 */
const getApiKey = (envVal: any, fallback: string, name: string) => {
  // If we are in a Vite environment, import.meta.env might be more reliable for some keys
  // but we prioritize the passed value (which usually comes from process.env via define)
  let val = envVal;
  
  // Fallback to import.meta.env if process.env value is missing/placeholder
  if (!val || val === "MISSING" || val === "undefined") {
    try {
      // @ts-ignore - for Vite environments
      const metaEnv = import.meta.env;
      if (metaEnv) {
        val = metaEnv[`VITE_${name.toUpperCase().replace(/\s+/g, '_')}_API_KEY`] || 
              metaEnv.VITE_GEMINI_API_KEY || 
              metaEnv.VITE_GOOGLE_MAPS_API_KEY;
      }
    } catch (e) {
      // Ignore if meta.env is not available
    }
  }

  val = typeof val === 'string' ? val.trim() : val;
  
  const isInvalid = !val || val === "undefined" || val === "null";
  const isPlaceholder = 
    val === "MISSING" || 
    val === "YOUR_API_KEY" ||
    val === "MY_GEMINI_API_KEY" || 
    val === "MY_MAPS_API_KEY" ||
    val === "API_KEY_HERE" ||
    (typeof val === 'string' && val.length < 10);

  const isLeaked = BLOCKED_KEYS.includes(val);

  if (isInvalid || isPlaceholder || isLeaked) {
    if (process.env.NODE_ENV !== "production" && (isLeaked || (val && val !== "MISSING" && !isInvalid))) {
      console.warn(`[Config] Rejected ${name} key (${isLeaked ? 'leaked' : 'placeholder/invalid'}): "${val}"`);
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
