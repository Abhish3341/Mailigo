/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_GOOGLE_CLIENT_ID: string
    // Add other env variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  
  // Ensure Vite includes this file in the TypeScript compilation
  export {}