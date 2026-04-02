/**
 * ═══════════════════════════════════════════════════
 * Firebase Configuration
 * ═══════════════════════════════════════════════════
 * Shared Firebase project: nhatroai
 * Two hosting sites use different appId/measurementId
 * but share the same Firestore + Auth
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCkJSeFyvQf2q1PwXSxY0livfT8of6T2rA",
    authDomain: "nhatroai.firebaseapp.com",
    projectId: "nhatroai",
    storageBucket: "nhatroai.firebasestorage.app",
    messagingSenderId: "381982586693",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:381982586693:web:f3d9af6b9d2a38b9c5b02c",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-N40TQVFJ7J"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;
export const db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
}, 'nhatroai');

// Secondary app for creating users without affecting current admin auth session
const secondaryApp = initializeApp(firebaseConfig, 'secondary');
export const secondaryAuth = getAuth(secondaryApp);

// Analytics (only in browser, not SSR)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then(yes => {
    if (yes) analytics = getAnalytics(app);
});

// App mode
export const APP_MODE = import.meta.env.VITE_APP_MODE as 'host' | 'admin' | undefined;
export const isHostMode = APP_MODE === 'host';
export const isAdminMode = APP_MODE === 'admin';
export const isDevMode = !APP_MODE; // local dev = show everything
export const TENANT_LOGIN_ENABLED = false;
