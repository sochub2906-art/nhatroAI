/**
 * ═══════════════════════════════════════════════════
 * Supabase Service Layer
 * ═══════════════════════════════════════════════════
 * Replaces firestoreService.ts for: Users, Admin Settings, Pricing Tiers
 * Google Sheets integration is KEPT separately.
 */

import { supabase } from '../supabase';
import type {
    PricingTier, AdminSettings, AppUser, FeatureFlags,
    Building, Room, Customer, Contract, Payment, Equipment, ServiceRecord, HostSubscriptionSnapshot
} from '../types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ═══════════════════════════════════════
// TYPE MAPPERS: camelCase ↔ snake_case
// ═══════════════════════════════════════

function userToRow(user: AppUser): Record<string, any> {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        avatar: user.avatar || null,
        status: user.status || 'active',
        subscription_plan_id: user.subscriptionPlanId || null,
        subscription_start_date: user.subscriptionStartDate || null,
        subscription_end_date: user.subscriptionEndDate || null,
        active_addons: user.activeAddons || [],
        managed_building_ids: user.managedBuildingIds || [],
        google_sheet_id: user.googleSheetId || null,
        google_sheet_url: user.googleSheetUrl || null,
        linked_room_id: user.linkedRoomId || null,
        linked_contract_id: user.linkedContractId || null,
        assigned_host_ids: user.assignedHostIds || [],
        created_at: user.createdAt || new Date().toISOString(),
    };
}

function rowToUser(row: any): AppUser {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone || '',
        role: row.role,
        avatar: row.avatar,
        status: row.status || 'active',
        subscriptionPlanId: row.subscription_plan_id,
        subscriptionStartDate: row.subscription_start_date,
        subscriptionEndDate: row.subscription_end_date,
        activeAddons: row.active_addons || [],
        managedBuildingIds: row.managed_building_ids || [],
        googleSheetId: row.google_sheet_id,
        googleSheetUrl: row.google_sheet_url,
        linkedRoomId: row.linked_room_id,
        linkedContractId: row.linked_contract_id,
        assignedHostIds: row.assigned_host_ids || [],
        createdAt: row.created_at,
    };
}

function tierToRow(tier: PricingTier): Record<string, any> {
    return {
        id: tier.id,
        name: tier.name,
        price: tier.price,
        max_buildings: tier.maxBuildings,
        max_rooms: tier.maxRooms,
        features: tier.features || [],
        feature_flags: tier.featureFlags || {},
    };
}

function rowToTier(row: any): PricingTier {
    return {
        id: row.id,
        name: row.name,
        price: Number(row.price),
        maxBuildings: row.max_buildings,
        maxRooms: row.max_rooms,
        features: row.features || [],
        featureFlags: row.feature_flags as FeatureFlags | undefined,
    };
}

function settingsToRow(s: AdminSettings): Record<string, any> {
    return {
        id: 'admin',
        admin_email: s.adminEmail || '',
        sales_email: s.salesEmail || '',
        google_sheet_webhook_url: s.googleSheetWebhookUrl || null,
        landing_background_url: s.landingBackgroundUrl || null,
        email_templates: s.emailTemplates || {},
        sales_team_emails: s.salesTeamEmails || [],
        payment_config: s.paymentConfig || {},
        addons: s.addons || [],
        subscription_requests: s.subscriptionRequests || [],
        updated_at: new Date().toISOString(),
    };
}

function rowToSettings(row: any): AdminSettings {
    return {
        adminEmail: row.admin_email || '',
        salesEmail: row.sales_email || '',
        googleSheetWebhookUrl: row.google_sheet_webhook_url,
        landingBackgroundUrl: row.landing_background_url,
        emailTemplates: row.email_templates,
        salesTeamEmails: row.sales_team_emails || [],
        paymentConfig: row.payment_config,
        addons: row.addons || [],
        subscriptionRequests: row.subscription_requests || [],
    };
}

export interface HostBusinessSnapshot {
    buildings: Building[];
    rooms: Room[];
    customers: Customer[];
    contracts: Contract[];
    payments: Payment[];
    equipment: Equipment[];
    serviceRecords: ServiceRecord[];
    subscriptionSnapshot?: HostSubscriptionSnapshot | null;
}

function emptyHostBusinessSnapshot(): HostBusinessSnapshot {
    return {
        buildings: [],
        rooms: [],
        customers: [],
        contracts: [],
        payments: [],
        equipment: [],
        serviceRecords: [],
        subscriptionSnapshot: null,
    };
}

function hostSnapshotToRow(hostId: string, data: HostBusinessSnapshot): Record<string, any> {
    return {
        host_id: hostId,
        data,
        updated_at: new Date().toISOString(),
        source: 'app',
    };
}

function rowToHostSnapshot(row: any): HostBusinessSnapshot {
    return {
        ...emptyHostBusinessSnapshot(),
        ...(row?.data || {}),
    };
}

// ═══════════════════════════════════════
// USERS CRUD
// ═══════════════════════════════════════

export async function sbSetUser(user: AppUser): Promise<void> {
    const { error } = await supabase
        .from('users')
        .upsert(userToRow(user), { onConflict: 'id' });
    if (error) {
        console.error('sbSetUser failed:', error);
        throw error;
    }
}

export async function sbDeleteUser(id: string): Promise<void> {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('sbDeleteUser failed:', error);
        throw error;
    }
}

export async function sbGetUserByEmail(email: string): Promise<AppUser | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
    if (error) {
        console.error('sbGetUserByEmail failed:', error);
        return null;
    }
    return data ? rowToUser(data) : null;
}

/**
 * Realtime subscription for users table.
 * Returns an unsubscribe function (matches Firestore pattern).
 */
export function listenUsers(callback: (users: AppUser[]) => void): () => void {
    // Initial fetch
    supabase.from('users').select('*').order('created_at').then(({ data, error }) => {
        if (!error && data) {
            callback(data.map(rowToUser));
        }
    });

    // Realtime subscription
    const channel: RealtimeChannel = supabase
        .channel('users-changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'users',
        }, () => {
            // Re-fetch all users on any change (simple & reliable)
            supabase.from('users').select('*').order('created_at').then(({ data, error }) => {
                if (!error && data) {
                    callback(data.map(rowToUser));
                }
            });
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

// ═══════════════════════════════════════
// ADMIN SETTINGS
// ═══════════════════════════════════════

export async function saveAdminSettings(settings: AdminSettings): Promise<void> {
    const { error } = await supabase
        .from('admin_settings')
        .upsert(settingsToRow(settings), { onConflict: 'id' });
    if (error) {
        console.error('saveAdminSettings failed:', error);
        throw error;
    }
}

export function listenAdminSettings(callback: (settings: AdminSettings | null) => void): () => void {
    // Initial fetch
    supabase.from('admin_settings').select('*').eq('id', 'admin').maybeSingle().then(({ data, error }) => {
        if (!error && data) {
            callback(rowToSettings(data));
        } else {
            callback(null);
        }
    });

    // Realtime
    const channel: RealtimeChannel = supabase
        .channel('admin-settings-changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'admin_settings',
            filter: 'id=eq.admin',
        }, (payload) => {
            if (payload.new && Object.keys(payload.new).length > 0) {
                callback(rowToSettings(payload.new));
            }
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

// ═══════════════════════════════════════
// PRICING TIERS
// ═══════════════════════════════════════

export async function savePricingTiers(tiers: PricingTier[]): Promise<void> {
    // Delete all existing tiers and re-insert
    const { error: delError } = await supabase.from('pricing_tiers').delete().neq('id', '');
    if (delError) console.error('Delete tiers failed:', delError);

    if (tiers.length > 0) {
        const { error } = await supabase
            .from('pricing_tiers')
            .upsert(tiers.map(tierToRow), { onConflict: 'id' });
        if (error) {
            console.error('savePricingTiers failed:', error);
            throw error;
        }
    }
}

export function listenPricingTiers(callback: (tiers: PricingTier[]) => void): () => void {
    // Initial fetch
    supabase.from('pricing_tiers').select('*').order('price').then(({ data, error }) => {
        if (!error && data) {
            callback(data.map(rowToTier));
        }
    });

    // Realtime
    const channel: RealtimeChannel = supabase
        .channel('pricing-tiers-changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'pricing_tiers',
        }, () => {
            supabase.from('pricing_tiers').select('*').order('price').then(({ data, error }) => {
                if (!error && data) {
                    callback(data.map(rowToTier));
                }
            });
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

// ═══════════════════════════════════════
// INIT: Seed defaults if empty
// ═══════════════════════════════════════

export async function initDefaultsIfNeeded(
    defaultUser: AppUser,
    defaultTiers: PricingTier[],
    defaultSettings?: AdminSettings
): Promise<void> {
    // Check if default admin user exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', defaultUser.id)
        .maybeSingle();

    if (!existingUser) {
        await sbSetUser(defaultUser);
    }

    // Check if pricing tiers exist
    const { data: existingTiers } = await supabase
        .from('pricing_tiers')
        .select('id')
        .limit(1);

    if (!existingTiers || existingTiers.length === 0) {
        await savePricingTiers(defaultTiers);
    }

    // Check if admin_settings exists (singleton row with id='admin')
    if (defaultSettings) {
        const { data: existingSettings } = await supabase
            .from('admin_settings')
            .select('id')
            .eq('id', 'admin')
            .maybeSingle();

        if (!existingSettings) {
            await saveAdminSettings(defaultSettings);
        }
    }
}

let _snapshotFetchFailCount = 0;
let _snapshotFetchDisabled = false;
const MAX_SNAPSHOT_FETCH_FAILURES = 3;

export async function fetchHostBusinessSnapshot(hostId: string): Promise<{ success: boolean; data?: HostBusinessSnapshot; error?: string }> {
    // Circuit breaker: stop hammering Supabase after repeated failures
    if (_snapshotFetchDisabled || _snapshotFetchFailCount >= MAX_SNAPSHOT_FETCH_FAILURES) {
        return { success: false, error: 'Circuit breaker active' };
    }

    try {
        const { data, error } = await supabase
            .from('host_data_snapshots')
            .select('*')
            .eq('host_id', hostId)
            .maybeSingle();

        if (error) {
            _snapshotFetchFailCount++;
            // Table doesn't exist or permission denied — return empty gracefully
            if (error.code === 'PGRST205' || error.code === '42P01') {
                _snapshotFetchDisabled = true;
                console.warn('host_data_snapshots table not found, returning empty snapshot.');
                return { success: true, data: emptyHostBusinessSnapshot() };
            }
            _snapshotFetchDisabled = true;
            console.warn('fetchHostBusinessSnapshot unavailable, falling back to cache/Google Sheet.');
            return { success: false, error: error.message };
        }

        _snapshotFetchFailCount = 0; // Reset on success
        _snapshotFetchDisabled = false;
        if (!data) {
            return { success: true, data: emptyHostBusinessSnapshot() };
        }
        return { success: true, data: rowToHostSnapshot(data) };
    } catch (err: any) {
        _snapshotFetchFailCount++;
        _snapshotFetchDisabled = true;
        console.warn('fetchHostBusinessSnapshot network error, falling back to cache/Google Sheet.');
        return { success: false, error: err?.message || 'Network error' };
    }
}

let _snapshotSaveFailCount = 0;
let _snapshotSaveDisabled = false;
const MAX_SNAPSHOT_SAVE_FAILURES = 5;

export async function saveHostBusinessSnapshot(hostId: string, snapshot: HostBusinessSnapshot): Promise<{ success: boolean; error?: string }> {
    // Circuit breaker
    if (_snapshotSaveDisabled || _snapshotSaveFailCount >= MAX_SNAPSHOT_SAVE_FAILURES) {
        return { success: false, error: 'Too many save failures, pausing sync.' };
    }

    try {
        const { error } = await supabase
            .from('host_data_snapshots')
            .upsert(hostSnapshotToRow(hostId, snapshot), { onConflict: 'host_id' });

        if (error) {
            _snapshotSaveFailCount++;
            if (error.code === 'PGRST205' || error.code === '42P01') {
                _snapshotSaveDisabled = true;
                console.warn('host_data_snapshots table not found, skipping save.');
                return { success: false, error: 'Table not found' };
            }
            _snapshotSaveDisabled = true;
            console.warn('saveHostBusinessSnapshot unavailable, skipping Supabase snapshot save.');
            return { success: false, error: error.message };
        }

        _snapshotSaveFailCount = 0;
        _snapshotSaveDisabled = false;
        return { success: true };
    } catch (err: any) {
        _snapshotSaveFailCount++;
        _snapshotSaveDisabled = true;
        console.warn('saveHostBusinessSnapshot network error, skipping Supabase snapshot save.');
        return { success: false, error: err?.message || 'Network error' };
    }
}

/** Reset circuit breakers (call on fresh login) */
export function resetSnapshotCircuitBreakers(): void {
    _snapshotFetchFailCount = 0;
    _snapshotSaveFailCount = 0;
    _snapshotFetchDisabled = false;
    _snapshotSaveDisabled = false;
}
