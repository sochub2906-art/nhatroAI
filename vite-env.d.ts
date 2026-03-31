/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_MODE: 'host' | 'admin' | undefined;
    readonly VITE_FIREBASE_APP_ID: string;
    readonly VITE_FIREBASE_MEASUREMENT_ID: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly GEMINI_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
