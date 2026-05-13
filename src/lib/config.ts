/**
 * CENTRALIZED CONFIGURATION FOR API KEYS
 * 
 * IMPORTANT: In a production environment, these should be managed via environment variables.
 * For this development instance, we use values provided by the user to ensure immediate functionality.
 */

export const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || "AIzaSyCFpqnhjJpiniUqyVoKCTL39nPaPJmHTRg";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyD3K6Ari5CXtxOPecZZhp7sKyzlwagdxc4";

export const APP_CONFIG = {
  isDevelopment: process.env.NODE_ENV !== "production",
  apiUrl: process.env.APP_URL || (typeof window !== "undefined" ? window.location.origin : ""),
};
