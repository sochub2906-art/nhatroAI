/**
 * ═══════════════════════════════════════════════════
 * Local Cache Service (Device Storage)
 * ═══════════════════════════════════════════════════
 * Stores Host data in localStorage/IndexedDB so the app
 * can load instantly without waiting for Google Sheets.
 *
 * Strategy:
 *   Login → Try local cache first (instant) → Show UI
 *         → Fetch from Sheet in background → Merge & update
 *   CRUD  → Update state + local cache + push to Sheet
 *   Logout → Keep cache for next login
 */

import type { HostSheetData } from './googleSheetService';

const CACHE_PREFIX = 'sr_cache_';
const CACHE_TIMESTAMP_KEY = 'sr_cache_ts_';
const CACHE_VERSION = 'v2';

type ArrayCollectionKey = {
    [K in keyof HostSheetData]: HostSheetData[K] extends any[] ? K : never;
}[keyof HostSheetData];

function createEmptyHostData(): HostSheetData {
    return {
        buildings: [],
        rooms: [],
        customers: [],
        contracts: [],
        payments: [],
        equipment: [],
        serviceRecords: [],
    };
}

function ensureHostCacheData(hostId: string): HostSheetData {
    return loadHostDataFromCache(hostId) || createEmptyHostData();
}

// ═══════════════════════════════════════
// SAVE to local storage
// ═══════════════════════════════════════
export function saveHostDataToCache(hostId: string, data: HostSheetData): void {
    try {
        const key = CACHE_PREFIX + hostId;
        const payload = {
            version: CACHE_VERSION,
            data,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(payload));
        localStorage.setItem(CACHE_TIMESTAMP_KEY + hostId, new Date().toISOString());
    } catch (err) {
        console.warn('Failed to save to local cache (storage full?):', err);
        // If localStorage is full, try to clear old caches
        clearOldCaches(hostId);
    }
}

// ═══════════════════════════════════════
// LOAD from local storage
// ═══════════════════════════════════════
export function loadHostDataFromCache(hostId: string): HostSheetData | null {
    try {
        const key = CACHE_PREFIX + hostId;
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (parsed.version !== CACHE_VERSION) {
            // Version mismatch, discard
            localStorage.removeItem(key);
            return null;
        }

        return parsed.data as HostSheetData;
    } catch (err) {
        console.warn('Failed to load from local cache:', err);
        return null;
    }
}

// ═══════════════════════════════════════
// GET cache timestamp
// ═══════════════════════════════════════
export function getCacheTimestamp(hostId: string): string | null {
    return localStorage.getItem(CACHE_TIMESTAMP_KEY + hostId);
}

// ═══════════════════════════════════════
// CHECK if cache is stale (older than maxAgeMinutes)
// ═══════════════════════════════════════
export function isCacheStale(hostId: string, maxAgeMinutes: number = 60): boolean {
    const ts = getCacheTimestamp(hostId);
    if (!ts) return true;
    const age = Date.now() - new Date(ts).getTime();
    return age > maxAgeMinutes * 60 * 1000;
}

// ═══════════════════════════════════════
// CLEAR cache for a host
// ═══════════════════════════════════════
export function clearHostCache(hostId: string): void {
    localStorage.removeItem(CACHE_PREFIX + hostId);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY + hostId);
}

// ═══════════════════════════════════════
// CLEAR old caches (keep only current host)
// ═══════════════════════════════════════
function clearOldCaches(keepHostId: string): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX) && !key.includes(keepHostId)) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
}

// ═══════════════════════════════════════
// UPDATE a single collection in the cache
// ═══════════════════════════════════════
export function updateCacheCollection<K extends ArrayCollectionKey>(
    hostId: string,
    collection: K,
    items: HostSheetData[K]
): void {
    const data = ensureHostCacheData(hostId);
    data[collection] = items;
    saveHostDataToCache(hostId, data);
}

// ═══════════════════════════════════════
// UPSERT a single item in a cached collection
// ═══════════════════════════════════════
export function upsertCacheItem<K extends ArrayCollectionKey>(
    hostId: string,
    collection: K,
    item: HostSheetData[K][number]
): void {
    const data = ensureHostCacheData(hostId);

    const arr = data[collection] as any[];
    const idx = arr.findIndex((i: any) => i.id === (item as any).id);
    if (idx >= 0) {
        arr[idx] = item;
    } else {
        arr.push(item);
    }
    data[collection] = arr as any;
    saveHostDataToCache(hostId, data);
}

// ═══════════════════════════════════════
// DELETE a single item from a cached collection
// ═══════════════════════════════════════
export function deleteCacheItem<K extends ArrayCollectionKey>(
    hostId: string,
    collection: K,
    itemId: string
): void {
    const data = ensureHostCacheData(hostId);

    const arr = data[collection] as any[];
    data[collection] = arr.filter((i: any) => i.id !== itemId) as any;
    saveHostDataToCache(hostId, data);
}
