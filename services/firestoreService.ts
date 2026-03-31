/**
 * ═══════════════════════════════════════
 * Firestore Service Layer (Slim — v2)
 * ═══════════════════════════════════════
 * Only handles: Users, Admin Settings, Pricing Tiers
 * All business data (buildings, rooms, customers, etc.)
 * is now managed via Google Sheets.
 */

import {
    collection, doc, setDoc, deleteDoc,
    onSnapshot, getDoc,
    type Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase';
import type {
    PricingTier, AdminSettings, AppUser
} from '../types';

// ═══════════════════════════════════════
// COLLECTION NAMES
// ═══════════════════════════════════════
const COLLECTIONS = {
    users: 'users',
} as const;

const SETTINGS_DOC = 'settings';

// ═══════════════════════════════════════
// GENERIC HELPERS
// ═══════════════════════════════════════
async function fsSet<T extends { id: string }>(collectionName: string, item: T): Promise<void> {
    await setDoc(doc(db, collectionName, item.id), item as any);
}

async function fsDelete(collectionName: string, id: string): Promise<void> {
    await deleteDoc(doc(db, collectionName, id));
}

function listenCollection<T>(
    collectionName: string,
    callback: (items: T[]) => void
): Unsubscribe {
    return onSnapshot(collection(db, collectionName), (snapshot) => {
        const items: T[] = [];
        snapshot.forEach(doc => items.push({ ...doc.data(), id: doc.id } as T));
        callback(items);
    }, (error) => {
        console.error(`Firestore listener error [${collectionName}]:`, error);
    });
}

// ═══════════════════════════════════════
// USERS (still in Firestore — lightweight)
// ═══════════════════════════════════════
export const fsSetUser = (user: AppUser) => fsSet(COLLECTIONS.users, user);
export const fsDeleteUser = (id: string) => fsDelete(COLLECTIONS.users, id);
export const listenUsers = (cb: (users: AppUser[]) => void) => listenCollection<AppUser>(COLLECTIONS.users, cb);

// ═══════════════════════════════════════
// SETTINGS (single documents)
// ═══════════════════════════════════════
export async function saveAdminSettings(settings: AdminSettings): Promise<void> {
    await setDoc(doc(db, SETTINGS_DOC, 'admin'), settings as any);
}

export async function savePricingTiers(tiers: PricingTier[]): Promise<void> {
    await setDoc(doc(db, SETTINGS_DOC, 'pricingTiers'), { tiers });
}

export function listenAdminSettings(callback: (settings: AdminSettings | null) => void): Unsubscribe {
    return onSnapshot(doc(db, SETTINGS_DOC, 'admin'), (snap) => {
        callback(snap.exists() ? snap.data() as AdminSettings : null);
    });
}

export function listenPricingTiers(callback: (tiers: PricingTier[]) => void): Unsubscribe {
    return onSnapshot(doc(db, SETTINGS_DOC, 'pricingTiers'), (snap) => {
        if (snap.exists()) {
            callback(snap.data().tiers as PricingTier[]);
        }
    });
}

// ═══════════════════════════════════════
// INIT: Seed defaults if empty
// ═══════════════════════════════════════
export async function initDefaultsIfNeeded(defaultUser: AppUser, defaultTiers: PricingTier[]): Promise<void> {
    const userSnap = await getDoc(doc(db, COLLECTIONS.users, defaultUser.id));
    if (!userSnap.exists()) {
        await fsSetUser(defaultUser);
    }

    const tiersSnap = await getDoc(doc(db, SETTINGS_DOC, 'pricingTiers'));
    if (!tiersSnap.exists()) {
        await savePricingTiers(defaultTiers);
    }
}
