import type {
    AdminSettings,
    AppUser,
    CrmNote,
    HostPayment,
    HostProposal,
    PricingTier,
    RegistrationLead,
} from '../types';
import { fetchAllHostData, type HostSheetData } from './googleSheetService';
import { loadHostDataFromCache } from './localCacheService';

type HostStorageMode = 'google_sheet' | 'local_only' | 'not_configured';
type BackupSource = 'google_sheet' | 'local_cache' | 'empty';
type BackupStatus = 'ok' | 'warning' | 'error';

export interface HostBackupEntry {
    hostId: string;
    hostName: string;
    hostEmail: string;
    googleSheetId?: string;
    googleSheetUrl?: string;
    storageMode: HostStorageMode;
    backupSource: BackupSource;
    status: BackupStatus;
    message: string;
    data: HostSheetData;
}

export interface SystemBackupFile {
    meta: {
        exportedAt: string;
        exportedBy: 'admin';
        schemaVersion: '2026-03-29';
    };
    adminSettings: AdminSettings;
    users: AppUser[];
    pricingTiers: PricingTier[];
    leads: RegistrationLead[];
    proposals: HostProposal[];
    hostPayments: HostPayment[];
    crmNotes: CrmNote[];
    summary: {
        totalHosts: number;
        googleSheetHosts: number;
        localOnlyHosts: number;
        missingStorageHosts: number;
    };
    hosts: HostBackupEntry[];
}

interface BuildSystemBackupOptions {
    adminSettings: AdminSettings;
    users: AppUser[];
    pricingTiers: PricingTier[];
    leads?: RegistrationLead[];
    proposals?: HostProposal[];
    hostPayments?: HostPayment[];
    crmNotes?: CrmNote[];
}

const createEmptyHostData = (): HostSheetData => ({
    buildings: [],
    rooms: [],
    customers: [],
    contracts: [],
    payments: [],
    equipment: [],
    serviceRecords: [],
});

const isRemoteSheetId = (sheetId?: string | null): sheetId is string => Boolean(sheetId && !sheetId.startsWith('local_'));

const getHostStorageMode = (host: AppUser, hasCache: boolean, webhookUrl: string): HostStorageMode => {
    if (webhookUrl && isRemoteSheetId(host.googleSheetId)) return 'google_sheet';
    if ((host.googleSheetId || '').startsWith('local_') || hasCache) return 'local_only';
    return 'not_configured';
};

export async function buildSystemBackup(options: BuildSystemBackupOptions): Promise<SystemBackupFile> {
    const webhookUrl = options.adminSettings.googleSheetWebhookUrl?.trim() || '';
    const hosts = options.users.filter(user => user.role === 'HOST');

    const hostBackups = await Promise.all(hosts.map(async (host): Promise<HostBackupEntry> => {
        const localCache = loadHostDataFromCache(host.id);
        const emptyData = createEmptyHostData();
        const storageMode = getHostStorageMode(host, Boolean(localCache), webhookUrl);

        if (webhookUrl && isRemoteSheetId(host.googleSheetId)) {
            const remoteResult = await fetchAllHostData(webhookUrl, host.googleSheetId);
            if (remoteResult.success && remoteResult.data) {
                return {
                    hostId: host.id,
                    hostName: host.name,
                    hostEmail: host.email,
                    googleSheetId: host.googleSheetId,
                    googleSheetUrl: host.googleSheetUrl,
                    storageMode,
                    backupSource: 'google_sheet',
                    status: 'ok',
                    message: 'Backup đọc trực tiếp từ Google Sheet.',
                    data: remoteResult.data,
                };
            }

            if (localCache) {
                return {
                    hostId: host.id,
                    hostName: host.name,
                    hostEmail: host.email,
                    googleSheetId: host.googleSheetId,
                    googleSheetUrl: host.googleSheetUrl,
                    storageMode,
                    backupSource: 'local_cache',
                    status: 'warning',
                    message: `Google Sheet không đọc được, dùng local cache thay thế. ${remoteResult.error || ''}`.trim(),
                    data: localCache,
                };
            }

            return {
                hostId: host.id,
                hostName: host.name,
                hostEmail: host.email,
                googleSheetId: host.googleSheetId,
                googleSheetUrl: host.googleSheetUrl,
                storageMode,
                backupSource: 'empty',
                status: 'error',
                message: `Host có cấu hình Google Sheet nhưng đọc dữ liệu thất bại. ${remoteResult.error || ''}`.trim(),
                data: emptyData,
            };
        }

        if (localCache) {
            return {
                hostId: host.id,
                hostName: host.name,
                hostEmail: host.email,
                googleSheetId: host.googleSheetId,
                googleSheetUrl: host.googleSheetUrl,
                storageMode,
                backupSource: 'local_cache',
                status: 'warning',
                message: webhookUrl
                    ? 'Host chưa có Google Sheet thật, backup lấy từ local cache trên trình duyệt này.'
                    : 'Admin chưa cấu hình webhook Google Sheet, backup lấy từ local cache trên trình duyệt này.',
                data: localCache,
            };
        }

        return {
            hostId: host.id,
            hostName: host.name,
            hostEmail: host.email,
            googleSheetId: host.googleSheetId,
            googleSheetUrl: host.googleSheetUrl,
            storageMode,
            backupSource: 'empty',
            status: 'error',
            message: webhookUrl
                ? 'Không có Google Sheet thật và cũng không có local cache để backup.'
                : 'Chưa có webhook Google Sheet và không có local cache để backup.',
            data: emptyData,
        };
    }));

    return {
        meta: {
            exportedAt: new Date().toISOString(),
            exportedBy: 'admin',
            schemaVersion: '2026-03-29',
        },
        adminSettings: options.adminSettings,
        users: options.users,
        pricingTiers: options.pricingTiers,
        leads: options.leads || [],
        proposals: options.proposals || [],
        hostPayments: options.hostPayments || [],
        crmNotes: options.crmNotes || [],
        summary: {
            totalHosts: hosts.length,
            googleSheetHosts: hostBackups.filter(item => item.storageMode === 'google_sheet').length,
            localOnlyHosts: hostBackups.filter(item => item.storageMode === 'local_only').length,
            missingStorageHosts: hostBackups.filter(item => item.storageMode === 'not_configured').length,
        },
        hosts: hostBackups,
    };
}
