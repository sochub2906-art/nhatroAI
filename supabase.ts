/**
 * ═══════════════════════════════════════════════════
 * Supabase Configuration
 * ═══════════════════════════════════════════════════
 * Project: brmhrzyiaknppzqbwwpv
 * Replaces Firestore for: Users, Admin Settings, Pricing Tiers
 * Google Sheets integration is KEPT for business data.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://brmhrzyiaknppzqbwwpv.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_ANON_KEY) {
    console.warn('⚠️ VITE_SUPABASE_ANON_KEY is not set. Supabase will not work.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
