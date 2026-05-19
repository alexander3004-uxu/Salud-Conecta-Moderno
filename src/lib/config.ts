/// <reference types="vite/client" />
/**
 * CENTRALIZED CONFIGURATION FOR API KEYS
 * 
 * IMPORTANT: In Vite, environment variables must be prefixed with VITE_ to be available in the client code.
 * This config reads from import.meta.env which is automatically populated by Vite.
 */

const getApiKey = (envVars: string | string[], fallback: string, name: string): string => {
  // @ts-ignore - import.meta.env is automatically available in Vite
  const env = import.meta.env;
  
  const vars = Array.isArray(envVars) ? envVars : [envVars];
  let val: string | undefined;

  for (const key of vars) {
    if (env[key]) {
      val = env[key] as string;
      break;
    }
  }
  
  if (!val) {
    return fallback;
  }
  
  const trimmed = val.trim();
  const isInvalid = !trimmed || trimmed === "undefined" || trimmed === "null";
  const isPlaceholder = 
    trimmed === "MISSING" || 
    trimmed === "YOUR_API_KEY" ||
    trimmed === "MY_GEMINI_API_KEY" || 
    trimmed === "MY_MAPS_API_KEY" ||
    trimmed === "API_KEY_HERE" ||
    (trimmed.length < 10);

  if (isInvalid || isPlaceholder) {
    console.warn(`[Config] ${name} key is invalid or placeholder, using fallback`);
    return fallback;
  }
  
  console.log(`[Config] ${name} loaded successfully`);
  return trimmed; //
};

export const GOOGLE_MAPS_KEY = getApiKey(['VITE_GOOGLE_MAPS_API_KEY', 'VITE_GOOGLE_MAPS_PLATFORM_KEY'], '', 'Google Maps');
export const GEMINI_API_KEY = getApiKey('VITE_GEMINI_API_KEY', '', 'Gemini');

export const APP_CONFIG = {
  isDevelopment: import.meta.env.DEV,
  apiUrl: typeof window !== "undefined" ? window.location.origin : "",
};
