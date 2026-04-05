import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
    Building, Room, Customer, Contract, Payment,
    ServiceRecord, Equipment, BankInfo, PricingTier,
    UserProfile, AdminSettings, RegistrationLead,
    AppUser, UserRole, HostProposal, ContractService, HostPayment, CrmNote,
    FeatureFlags, DEFAULT_FEATURE_FLAGS, AppNotification, HostPaymentGatewayConfig,
    AddOnFeature, HostSubscriptionSnapshot
} from './types';
import {
    fetchAllHostData, upsertSheetRow, deleteSheetRow, batchSyncToSheet,
    uploadImageToDrive, createHostGoogleSheet, fetchCustomerImages,
    registerHostPaymentGateway, fetchHostPaymentNotifications,
    type HostSheetData, type CustomerImagesResponse, type SheetTabName
} from './services/googleSheetService';
import {
    saveHostDataToCache, loadHostDataFromCache,
    upsertCacheItem, deleteCacheItem
} from './services/localCacheService';
import {
    loadHostNotifications, markAllHostNotificationsRead, markHostNotificationRead,
    removeHostNotification, saveHostNotifications, upsertHostNotifications
} from './services/notificationStoreService';
import { exportHostDataToExcel } from './services/excelExport';
import { auth, secondaryAuth, TENANT_LOGIN_ENABLED, messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { buildRoomBills } from './utils/paymentBills';
import { compareBillingPeriods, getNextBillingPeriod, parseBillingPeriod } from './utils/billingPeriods';
import { getContractExpiryState, getCurrentBillingPeriod } from './utils/contractStatus';
import { applyPaymentCollection, getPaymentRemainingAmount, paymentStatusToBillStatus, STATUS_OVERDUE, STATUS_PAID, STATUS_PENDING } from './utils/paymentState';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
    sbSetUser, sbDeleteUser, sbGetUserByEmail, listenUsers,
    saveAdminSettings, listenAdminSettings,
    savePricingTiers, listenPricingTiers,
    initDefaultsIfNeeded, fetchHostBusinessSnapshot, saveHostBusinessSnapshot,
    resetSnapshotCircuitBreakers, sbSaveUserPushToken, sbDeleteUserPushToken
} from './services/supabaseService';
import { buildHostPaymentWebhookUrl, normalizeHostPaymentGatewayConfig } from './utils/paymentGateway';
import { DEFAULT_SUBSCRIPTION_CHANNELS, buildPlanFeatureList, normalizeSubscriptionChannels } from './utils/subscriptionPayments';

type PendingSheetOperation = {
    type: 'upsert' | 'delete';
    tab: SheetTabName;
    record?: { id: string; [key: string]: any };
    recordId?: string;
    attempts: number;
};

const SESSION_ROLE_STORAGE_KEY = 'currentRole';
const SESSION_USER_ID_STORAGE_KEY = 'currentUserId';

const isRemoteSheetId = (sheetId?: string | null) => Boolean(sheetId && !sheetId.startsWith('local_'));

const createEmptyHostSnapshot = (): HostSheetData => ({
    buildings: [],
    rooms: [],
    customers: [],
    contracts: [],
    payments: [],
    equipment: [],
    serviceRecords: [],
});

const hasHostSnapshotData = (snapshot?: HostSheetData | null) => Boolean(
    snapshot
    && (
        snapshot.buildings.length
        || snapshot.rooms.length
        || snapshot.customers.length
        || snapshot.contracts.length
        || snapshot.payments.length
        || snapshot.equipment.length
        || snapshot.serviceRecords.length
    ),
);

const reconcileRoomsWithContracts = (rooms: Room[], contracts: Contract[]): Room[] => {
    const occupiedRoomIds = new Set(
        contracts
            .filter(contract => contract.isActive)
            .map(contract => contract.roomId),
    );

    return rooms.map(room => {
        if (room.status === '\u0110ang s\u1eeda') return room;
        const nextStatus: Room['status'] = occupiedRoomIds.has(room.id) ? '\u0110ang \u1edf' : 'Tr\u1ed1ng';
        return room.status === nextStatus ? room : { ...room, status: nextStatus };
    });
};

// CONTEXT TYPE
interface AppContextType {
    currentUser: AppUser | null;
    hostFeatureFlags: FeatureFlags;
    allUsers: AppUser[];
    login: (email: string, password: string) => Promise<AppUser | null>;
    logout: () => void;
    switchRole: (role: UserRole) => void;
    addUser: (user: Omit<AppUser, 'id' | 'createdAt'>) => Promise<AppUser | null>;
    updateUser: (user: AppUser) => void;
    deleteUser: (id: string) => boolean;
    buildings: Building[];
    rooms: Room[];
    customers: Customer[];
    contracts: Contract[];
    payments: Payment[];
    serviceRecords: ServiceRecord[];
    equipment: Equipment[];
    bankInfo: BankInfo;
    pricingTiers: PricingTier[];
    leads: RegistrationLead[];
    proposals: HostProposal[];
    hostPayments: HostPayment[];
    crmNotes: CrmNote[];
    notifications: AppNotification[];
    unreadNotificationCount: number;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    userProfile: UserProfile;
    adminSettings: AdminSettings;
    updateUserProfile: (profile: UserProfile) => void;
    updateAdminSettings: (settings: AdminSettings) => void;
    getCurrentHostPaymentGatewayConfig: () => HostPaymentGatewayConfig;
    updateCurrentHostPaymentGatewayConfig: (config: HostPaymentGatewayConfig) => Promise<{ success: boolean; webhookUrl?: string; error?: string }>;
    markNotificationRead: (id: string) => void;
    markAllNotificationsRead: () => void;
    dismissNotification: (id: string) => void;
    addBuilding: (building: Building, initialEquipment?: Partial<Equipment>[]) => void;
    deleteBuilding: (id: string) => boolean;
    addRoom: (room: Room, initialEquipment?: Partial<Equipment>[]) => void;
    addRoomsBulk: (rooms: Room[], equipment: Equipment[]) => void;
    addCustomersBulk: (customers: Customer[]) => void;
    addEquipmentBulk: (equipment: Equipment[]) => void;
    deleteRoom: (id: string) => void;
    updateRoom: (room: Room) => void;
    updateRoomPosition: (id: string, floor: number, x: number, y: number) => void;
    addCustomer: (customer: Customer) => void;
    updateCustomer: (customer: Customer) => void;
    deleteCustomer: (id: string) => void;
    createContract: (contract: Contract) => void;
    updateContract: (contract: Contract) => void;
    terminateContract: (id: string) => void;
    addServiceRecord: (record: ServiceRecord) => void;
    markPaymentPaid: (id: string, amount?: number) => void;
    sendReminder: (id: string) => void;
    generateMonthlyPayments: (periodOverride?: string) => void;
    generateRoomBill: (roomId: string, periodOverride?: string) => { length: number; period?: string } | void;
    sendBulkBills: (period: string) => void;
    updateBankInfo: (info: BankInfo) => void;
    addEquipment: (item: Equipment) => void;
    updateEquipment: (item: Equipment) => void;
    deleteEquipment: (id: string) => void;
    addLead: (lead: Omit<RegistrationLead, 'id' | 'createdAt' | 'status'>) => void;
    updateLeadStatus: (id: string, status: RegistrationLead['status']) => void;
    addProposal: (proposal: Omit<HostProposal, 'id' | 'createdAt' | 'status'>) => void;
    updateProposalStatus: (id: string, status: HostProposal['status']) => void;
    updateHostPaymentStatus: (id: string, status: HostPayment['status']) => void;
    addPricingTier: (tier: Omit<PricingTier, 'id'>) => void;
    updatePricingTier: (tier: PricingTier) => void;
    deletePricingTier: (id: string) => void;
    addCrmNote: (note: Omit<CrmNote, 'id' | 'createdAt'>) => void;
    sendHostPaymentReminder: (hostId: string, amount: number) => void;
    createGoogleSheetForHost: (hostId: string) => Promise<{ success: boolean; url?: string; error?: string }>;
    getCustomerImagesFromSheet: (hostId: string, customerId: string) => Promise<CustomerImagesResponse>;
    syncNow: () => Promise<void>;
    isSyncing: boolean;
    lastSyncTime: string | null;
    exportData: () => string;
    importData: (jsonData: string) => boolean;
    requestNotificationPermission: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const SERVICE_PRESETS: ContractService[] = [
    { id: 'svc_parking', name: 'Gửi xe máy', unitPrice: 100000, unit: 'tháng', enabled: false },
    { id: 'svc_car', name: 'Gửi ô tô', unitPrice: 500000, unit: 'tháng', enabled: false },
    { id: 'svc_cable', name: 'Truyền hình cáp', unitPrice: 80000, unit: 'tháng', enabled: false },
    { id: 'svc_laundry', name: 'Giặt ủi', unitPrice: 150000, unit: 'tháng', enabled: false },
    { id: 'svc_cleaning', name: 'Dọn phòng', unitPrice: 200000, unit: 'tháng', enabled: false },
    { id: 'svc_security', name: 'Bảo vệ 24/7', unitPrice: 50000, unit: 'tháng', enabled: false },
    { id: 'svc_trash', name: 'Thu gom rác', unitPrice: 30000, unit: 'tháng', enabled: false },
    { id: 'svc_elevator', name: 'Thang máy', unitPrice: 50000, unit: 'tháng', enabled: false },
];

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const PERIODIC_SYNC_MS = 10 * 60 * 1000;

const DEFAULT_ADMIN_USER: AppUser = {
    id: 'U_SA',
    name: 'Super Admin',
    email: 'antonionguyen246@gmail.com',
    phone: '0900000001',
    role: 'SUPER_ADMIN',
    avatar: 'SA',
    status: 'active',
    createdAt: '2024-01-01',
};

const DEFAULT_PRICING_TIERS: PricingTier[] = [
    {
        id: 'basic',
        name: 'Cá nhân',
        price: 0,
        maxBuildings: 1,
        maxRooms: 10,
        features: ['Tổng quan', 'Quản lý 1 tòa nhà', 'Sơ đồ nhà', 'Phòng trọ (tối đa 10)', 'Khách thuê', 'Hợp đồng', 'Thu chi & Công nợ'],
        featureFlags: { dashboard: true, buildings: true, roomMap: true, rooms: true, customers: true, contracts: true, payments: true, equipment: false, autoNotify: false, cccdReader: false, imageUpload: false },
    },
    {
        id: 'standard',
        name: 'Chuyên nghiệp',
        price: 199000,
        maxBuildings: 3,
        maxRooms: 20,
        features: ['Tất cả tính năng Cá nhân', 'Tối đa 3 tòa nhà / 20 phòng', 'Quản lý trang thiết bị', 'Gửi thông báo tự động', 'Đọc CCCD từ Google Sheets', 'Upload ảnh khách thuê'],
        featureFlags: { dashboard: true, buildings: true, roomMap: true, rooms: true, customers: true, contracts: true, payments: true, equipment: true, autoNotify: true, cccdReader: true, imageUpload: true },
    },
    {
        id: 'premium',
        name: 'Doanh nghiệp',
        price: 499000,
        maxBuildings: 20,
        maxRooms: 500,
        features: ['Tất cả tính năng Chuyên nghiệp', 'Tối đa 20 tòa nhà / 500 phòng', 'API tích hợp khóa cửa', 'Hỗ trợ 24/7 ưu tiên'],
        featureFlags: { dashboard: true, buildings: true, roomMap: true, rooms: true, customers: true, contracts: true, payments: true, equipment: true, autoNotify: true, cccdReader: true, imageUpload: true },
    },
];

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
    adminEmail: 'antonionguyen246@gmail.com',
    salesEmail: 'sales@smart.vn',
    salesTeamEmails: ['sales@smart.vn'],
    emailTemplates: {
        billReminder: 'Kính gửi {{tenant}}, hóa đơn kỳ {{period}} của bạn là {{amount}}. Vui lòng thanh toán trước {{dueDate}}.',
        welcomeTenant: 'Chào mừng {{tenant}} đến với {{building}}. Phòng {{room}} đã sẵn sàng.',
        contractExpiry: 'Hợp đồng {{contractId}} sẽ hết hạn vào {{endDate}}. Vui lòng liên hệ để gia hạn.',
    },
    paymentConfig: {
        bankName: 'Vietcombank',
        accountNumber: '0123456789',
        accountName: 'CONG TY PHAN MEM SMART RENTAL',
        webhookUrl: '',
        gracePeriodDays: 5,
        subscriptionChannels: DEFAULT_SUBSCRIPTION_CHANNELS,
    },
    subscriptionRequests: [],
};

function normalizeAdminSettingsState(settings?: AdminSettings | null): AdminSettings {
    const paymentConfig = settings?.paymentConfig || DEFAULT_ADMIN_SETTINGS.paymentConfig!;
    return {
        ...DEFAULT_ADMIN_SETTINGS,
        ...settings,
        paymentConfig: {
            ...DEFAULT_ADMIN_SETTINGS.paymentConfig,
            ...paymentConfig,
            hostGatewayConfigs: paymentConfig.hostGatewayConfigs || {},
            subscriptionChannels: normalizeSubscriptionChannels(paymentConfig.subscriptionChannels),
        },
        addons: (settings?.addons || DEFAULT_ADMIN_SETTINGS.addons || []).map(addon => ({
            ...addon,
            features: addon.features || [],
        })),
        subscriptionRequests: settings?.subscriptionRequests || [],
    };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
    const [allUsers, setAllUsers] = useState<AppUser[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [bankInfo, setBankInfo] = useState<BankInfo>({ bankName: '', accountNumber: '', accountName: '' });
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [leads, setLeads] = useState<RegistrationLead[]>([]);
    const [proposals, setProposals] = useState<HostProposal[]>([]);
    const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(DEFAULT_PRICING_TIERS);
    const [hostPayments, setHostPayments] = useState<HostPayment[]>([]);
    const [crmNotes, setCrmNotes] = useState<CrmNote[]>([]);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', email: '', phone: '', bankName: '', accountNumber: '', accountName: '' });
    const [adminSettings, setAdminSettings] = useState<AdminSettings>(normalizeAdminSettingsState(DEFAULT_ADMIN_SETTINGS));
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
    const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastActivityRef = useRef<number>(Date.now());
    const pendingSheetOpsRef = useRef<Map<string, PendingSheetOperation>>(new Map());
    const notificationPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const processedRemoteNotificationIdsRef = useRef<Set<string>>(new Set());
    const flushQueueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFlushingQueueRef = useRef(false);
    const flushSheetQueueRef = useRef<() => Promise<void>>(async () => {});
    const supabaseSnapshotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isHostHydratedRef = useRef(false);
    const hasAutoLoggedInRef = useRef(false);
    const isHydratingHostRef = useRef(false);
    const activeHydrationHostIdRef = useRef<string | null>(null);
    const sheetRemoteDisabledRef = useRef(false);
    const sheetRemoteFailCountRef = useRef(0);
    const isSavingSnapshotRef = useRef(false);
    const snapshotSaveFailCountRef = useRef(0);
    const isCloudSyncSafeRef = useRef(false);
    const notificationsRef = useRef<AppNotification[]>([]);
    notificationsRef.current = notifications;
    const bankInfoRef = useRef<BankInfo>({ bankName: '', accountNumber: '', accountName: '' });
    bankInfoRef.current = bankInfo;

    const unreadNotificationCount = notifications.filter(notification => !notification.readAt).length;

    const persistHostNotifications = useCallback((hostId: string, next: AppNotification[]) => {
        saveHostNotifications(hostId, next);
        const stored = loadHostNotifications(hostId);
        processedRemoteNotificationIdsRef.current = new Set(stored.map(notification => notification.id));
        setNotifications(stored);
    }, []);

    const mergeHostNotifications = useCallback((hostId: string, incoming: AppNotification[]) => {
        const next = upsertHostNotifications(hostId, incoming);
        processedRemoteNotificationIdsRef.current = new Set(next.map(notification => notification.id));
        setNotifications(next);
        return next;
    }, []);

    const createHostNotification = useCallback((draft: Omit<AppNotification, 'id' | 'hostId' | 'createdAt'> & Partial<Pick<AppNotification, 'id' | 'hostId' | 'createdAt'>>) => {
        const hostId = draft.hostId || currentUser?.id;
        if (!hostId) return null;
        const notification: AppNotification = {
            id: draft.id || `NTF_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            hostId,
            title: draft.title,
            message: draft.message,
            type: draft.type,
            severity: draft.severity,
            createdAt: draft.createdAt || new Date().toISOString(),
            readAt: draft.readAt,
            actionPath: draft.actionPath,
            paymentIds: draft.paymentIds,
            billId: draft.billId,
            amount: draft.amount,
            metadata: draft.metadata,
        };
        const next = mergeHostNotifications(hostId, [notification]);
        if (hostId === currentUser?.id) setNotifications(next);
        return notification;
    }, [currentUser?.id, mergeHostNotifications]);

    const requestNotificationPermission = useCallback(async () => {
        if (!messaging || !currentUser?.id) return false;
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const token = await getToken(messaging, {
                    vapidKey: 'BDphNyoBsubpAMi6QgUAwdEckPXUht3DtXomPlEYn4M4HRE_I6avkQ93U06j_0ZBzUN2zS6FJS4wtmIw6vz4f44' 
                });
                if (token) {
                    await sbSaveUserPushToken(currentUser.id, token);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Notification permission failed:', error);
            return false;
        }
    }, [currentUser?.id]);

    useEffect(() => {
        if (!messaging || !currentUser?.id) return;

        // Foreground messaging
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);
            if (payload.notification) {
                createHostNotification({
                    title: payload.notification.title || 'Thông báo',
                    message: payload.notification.body || '',
                    type: 'system',
                    severity: 'info'
                });
            }
        });

        // Auto-refresh token if already granted
        if (Notification.permission === 'granted') {
            requestNotificationPermission();
        }

        return () => unsubscribe();
    }, [currentUser?.id, createHostNotification, requestNotificationPermission]);

    const persistSessionUser = useCallback((user: AppUser) => {
        localStorage.setItem(SESSION_ROLE_STORAGE_KEY, user.role);
        localStorage.setItem(SESSION_USER_ID_STORAGE_KEY, user.id);
    }, []);

    const clearPersistedSessionUser = useCallback(() => {
        localStorage.removeItem(SESSION_ROLE_STORAGE_KEY);
        localStorage.removeItem(SESSION_USER_ID_STORAGE_KEY);
    }, []);

    const clearBusinessData = useCallback(() => {
        setBuildings([]);
        setRooms([]);
        setCustomers([]);
        setContracts([]);
        setPayments([]);
        setServiceRecords([]);
        setEquipment([]);
        setLeads([]);
        setProposals([]);
        setHostPayments([]);
        setCrmNotes([]);
        setNotifications([]);
    }, []);

    const getWebhookUrl = useCallback(() => adminSettings?.googleSheetWebhookUrl || '', [adminSettings]);

    const getSheetId = useCallback((user?: AppUser | null) => {
        const sheetId = (user?.googleSheetId || currentUser?.googleSheetId || '').trim();
        return isRemoteSheetId(sheetId) ? sheetId : '';
    }, [currentUser]);

    const normalizeEquipment = useCallback((item: Equipment): Equipment => ({
        ...item,
        notes: item.notes || '',
        depreciationMonths: item.depreciationMonths ?? 36,
        salvageValue: item.salvageValue ?? 0,
        currentValue: typeof item.currentValue === 'number' ? item.currentValue : item.price,
        lastValuationDate: item.lastValuationDate || item.purchaseDate,
        maintenanceHistory: item.maintenanceHistory || [],
        hostId: item.hostId || currentUser?.id,
        createdAt: item.createdAt || new Date().toISOString(),
    }), [currentUser]);

    const getHostGatewayConfigMap = useCallback(() => adminSettings.paymentConfig?.hostGatewayConfigs || {}, [adminSettings]);

    const getCurrentHostPaymentGatewayConfig = useCallback((): HostPaymentGatewayConfig => {
        const hostId = currentUser?.id || 'unknown_host';
        const fromAdmin = getHostGatewayConfigMap()[hostId];
        return normalizeHostPaymentGatewayConfig(hostId, {
            ...fromAdmin,
            bankName: fromAdmin?.bankName || bankInfo.bankName || userProfile.bankName || '',
            accountNumber: fromAdmin?.accountNumber || bankInfo.accountNumber || userProfile.accountNumber || '',
            accountName: fromAdmin?.accountName || bankInfo.accountName || userProfile.accountName || '',
        });
    }, [bankInfo.accountName, bankInfo.accountNumber, bankInfo.bankName, currentUser?.id, getHostGatewayConfigMap, userProfile.accountName, userProfile.accountNumber, userProfile.bankName]);



    const markNotificationRead = useCallback((id: string) => {
        if (!currentUser?.id) return;
        const next = markHostNotificationRead(currentUser.id, id);
        persistHostNotifications(currentUser.id, next);
    }, [currentUser?.id, persistHostNotifications]);

    const markAllNotificationsRead = useCallback(() => {
        if (!currentUser?.id) return;
        const next = markAllHostNotificationsRead(currentUser.id);
        persistHostNotifications(currentUser.id, next);
    }, [currentUser?.id, persistHostNotifications]);

    const dismissNotification = useCallback((id: string) => {
        if (!currentUser?.id) return;
        const next = removeHostNotification(currentUser.id, id);
        persistHostNotifications(currentUser.id, next);
    }, [currentUser?.id, persistHostNotifications]);

    const buildSubscriptionSnapshotForHost = useCallback((host?: AppUser | null): HostSubscriptionSnapshot | null => {
        if (!host || host.role !== 'HOST') return null;
        const plan = pricingTiers.find(item => item.id === host.subscriptionPlanId);
        const activeAddons = (host.activeAddons || [])
            .map(addonId => adminSettings.addons?.find(addon => addon.id === addonId))
            .filter((addon): addon is AddOnFeature => Boolean(addon))
            .map(addon => ({ id: addon.id, name: addon.name, price: addon.price, description: addon.description }));
        const pendingRequests = (adminSettings.subscriptionRequests || []).filter(request => request.hostId === host.id && request.status !== 'approved' && request.status !== 'rejected' && request.status !== 'cancelled');
        const gateway = getHostGatewayConfigMap()[host.id];
        return {
            hostId: host.id,
            planId: plan?.id,
            planName: plan?.name,
            planPrice: plan?.price,
            maxBuildings: plan?.maxBuildings,
            maxRooms: plan?.maxRooms,
            features: buildPlanFeatureList(plan, activeAddons),
            activeAddons,
            paymentGateway: gateway ? {
                provider: gateway.provider,
                providerLabel: gateway.providerLabel,
                enabled: gateway.enabled,
                autoMarkPaid: gateway.autoMarkPaid,
                lastWebhookAt: gateway.lastWebhookAt,
                lastWebhookStatus: gateway.lastWebhookStatus,
                lastWebhookMessage: gateway.lastWebhookMessage,
            } : undefined,
            pendingRequests,
        };
    }, [adminSettings.addons, adminSettings.subscriptionRequests, getHostGatewayConfigMap, pricingTiers]);


    const scheduleSheetQueueFlush = useCallback(() => {
        if (flushQueueTimerRef.current) clearTimeout(flushQueueTimerRef.current);
        flushQueueTimerRef.current = setTimeout(() => {
            flushSheetQueueRef.current().catch(console.error);
        }, 900);
    }, []);

    const flushSheetQueue = useCallback(async () => {
        const url = getWebhookUrl();
        const sheetId = getSheetId();
        if (!url || !sheetId || sheetRemoteDisabledRef.current || isFlushingQueueRef.current || pendingSheetOpsRef.current.size === 0) return;
        isFlushingQueueRef.current = true;
        const operations: Array<[string, PendingSheetOperation]> = Array.from(pendingSheetOpsRef.current.entries());
        pendingSheetOpsRef.current.clear();

        try {
            for (const [key, operation] of operations) {
                try {
                    if (operation.type === 'delete' && operation.recordId) {
                        await deleteSheetRow(url, sheetId, operation.tab, operation.recordId);
                    } else if (operation.type === 'upsert' && operation.record) {
                        await upsertSheetRow(url, sheetId, operation.tab, operation.record);
                    }
                } catch (error) {
                    if (operation.attempts < 2) {
                        pendingSheetOpsRef.current.set(key, { ...operation, attempts: operation.attempts + 1 });
                    } else {
                        console.error('Google Sheet queue operation failed:', operation.tab, error);
                    }
                }
            }
            if (operations.length > 0) {
                setLastSyncTime(new Date().toISOString());
            }
        } finally {
            isFlushingQueueRef.current = false;
            if (pendingSheetOpsRef.current.size > 0) scheduleSheetQueueFlush();
        }
    }, [getSheetId, getWebhookUrl, scheduleSheetQueueFlush]);

    const queueSheetOperation = useCallback((operation: { type: 'upsert' | 'delete'; tab: SheetTabName; record?: { id: string; [key: string]: any }; recordId?: string }) => {
        const id = operation.record?.id || operation.recordId;
        if (!id) return;
        pendingSheetOpsRef.current.set(`${operation.tab}:${id}`, { ...operation, attempts: 0 });
        scheduleSheetQueueFlush();
    }, [scheduleSheetQueueFlush]);

    flushSheetQueueRef.current = flushSheetQueue;

    const pushToSheet = useCallback((tab: SheetTabName, record: { id: string; [key: string]: any }) => {
        queueSheetOperation({ type: 'upsert', tab, record });
    }, [queueSheetOperation]);

    const removeFromSheet = useCallback((tab: SheetTabName, recordId: string) => {
        queueSheetOperation({ type: 'delete', tab, recordId });
    }, [queueSheetOperation]);

    const applyHostData = useCallback((data: HostSheetData) => {
        const nextContracts = data.contracts || [];
        setBuildings(data.buildings || []);
        setRooms(reconcileRoomsWithContracts(data.rooms || [], nextContracts));
        setCustomers(data.customers || []);
        setContracts(nextContracts);
        setPayments(data.payments || []);
        setEquipment((data.equipment || []).map(normalizeEquipment));
        setServiceRecords(data.serviceRecords || []);
    }, [normalizeEquipment]);

    const buildHostSnapshot = useCallback((overrides: Partial<HostSheetData> = {}): HostSheetData => {
        const nextContracts = overrides.contracts || contracts;
        const nextRooms = reconcileRoomsWithContracts(overrides.rooms || rooms, nextContracts);
        return {
            buildings: overrides.buildings || buildings,
            rooms: nextRooms,
            customers: overrides.customers || customers,
            contracts: nextContracts,
            payments: overrides.payments || payments,
            equipment: overrides.equipment || equipment,
            serviceRecords: overrides.serviceRecords || serviceRecords,
            subscriptionSnapshot: buildSubscriptionSnapshotForHost(currentUser) || undefined,
        };
    }, [buildSubscriptionSnapshotForHost, buildings, currentUser, rooms, customers, contracts, payments, equipment, serviceRecords]);

    const saveSnapshotToSupabase = useCallback(async (user: AppUser | null, snapshot?: HostSheetData) => {
        if (!user || user.role !== 'HOST') return;
        if (!isCloudSyncSafeRef.current) {
            console.warn('[Cloud Sync Blocked] Refusing to overwrite Supabase because hydration from cloud previously failed. Reload page to retry.');
            return;
        }
        if (isSavingSnapshotRef.current) return;
        if (snapshotSaveFailCountRef.current >= 3) return;
        isSavingSnapshotRef.current = true;
        try {
            const nextSnapshot = snapshot || buildHostSnapshot();
            const result = await saveHostBusinessSnapshot(user.id, nextSnapshot);
            if (result.success) {
                snapshotSaveFailCountRef.current = 0;
                setLastSyncTime(new Date().toISOString());
            } else if (result.error) {
                snapshotSaveFailCountRef.current += 1;
                console.error('Supabase snapshot sync failed:', result.error);
            }
        } catch {
            snapshotSaveFailCountRef.current += 1;
        } finally {
            isSavingSnapshotRef.current = false;
        }
    }, [buildHostSnapshot]);

    const hydrateFromSheet = useCallback(async (user: AppUser) => {
        if (isHydratingHostRef.current && activeHydrationHostIdRef.current === user.id) return;
        isHydratingHostRef.current = true;
        activeHydrationHostIdRef.current = user.id;
        isHostHydratedRef.current = false;
        isCloudSyncSafeRef.current = false;
        snapshotSaveFailCountRef.current = 0;
        const url = getWebhookUrl();
        const sheetId = getSheetId(user);
        const emptySnapshot = createEmptyHostSnapshot();
        const cached = loadHostDataFromCache(user.id);
        const cachedHasData = hasHostSnapshotData(cached);

        // Show cached data immediately while fetching fresh data
        if (cached) {
            applyHostData(cached);
            console.log('Loaded from local cache');
        } else {
            applyHostData(emptySnapshot);
        }

        setIsSyncing(true);
        let supabaseFetchSucceeded = false;

        try {
            const supabaseResult = await fetchHostBusinessSnapshot(user.id);

            if (supabaseResult.success && supabaseResult.data) {
                isCloudSyncSafeRef.current = true;
                supabaseFetchSucceeded = true;
                const supabaseHasData = hasHostSnapshotData(supabaseResult.data);
                if (supabaseHasData) {
                    applyHostData(supabaseResult.data);
                    saveHostDataToCache(user.id, supabaseResult.data);
                    setLastSyncTime(new Date().toISOString());
                    console.log('Loaded host data from Supabase');
                    return;
                }
                // Supabase returned empty — try to recover from cache
                if (cached && cachedHasData) {
                    applyHostData(cached);
                    await saveSnapshotToSupabase(user, cached);
                    if (url && sheetId) await batchSyncToSheet(url, sheetId, cached);
                    console.log('Recovered Supabase snapshot from local cache.');
                    return;
                }
            } else {
                // Supabase fetch FAILED (network error, circuit breaker, etc.)
                // Use cache if available and DON'T overwrite Supabase
                console.warn('Supabase fetch failed:', supabaseResult.error);
                if (cached && cachedHasData) {
                    applyHostData(cached);
                    console.log('Supabase unavailable — using local cache. Data NOT synced back to avoid overwrite.');
                    // Do NOT save back to Supabase here — we don't know what's on Supabase
                    return;
                }
            }

            // Try Google Sheets as fallback
            if (url && sheetId && !sheetRemoteDisabledRef.current) {
                try {
                    const result = await fetchAllHostData(url, sheetId);
                    if (result.success && result.data) {
                        isCloudSyncSafeRef.current = true;
                        sheetRemoteFailCountRef.current = 0;
                        const remoteHasData = hasHostSnapshotData(result.data);
                        if (!remoteHasData && cached && cachedHasData) {
                            applyHostData(cached);
                            if (supabaseFetchSucceeded) {
                                await saveSnapshotToSupabase(user, cached);
                            }
                            await batchSyncToSheet(url, sheetId, cached);
                            setLastSyncTime(new Date().toISOString());
                            console.log('Recovered Google Sheet from local cache.');
                            return;
                        }
                        if (remoteHasData) {
                            applyHostData(result.data);
                            saveHostDataToCache(user.id, result.data);
                            if (supabaseFetchSucceeded) {
                                await saveSnapshotToSupabase(user, result.data);
                            }
                            setLastSyncTime(new Date().toISOString());
                            console.log('Synced host data from Google Sheets and persisted to Supabase');
                            return;
                        }
                    } else {
                        sheetRemoteFailCountRef.current += 1;
                        sheetRemoteDisabledRef.current = true;
                    }
                } catch (err) {
                    sheetRemoteFailCountRef.current += 1;
                    sheetRemoteDisabledRef.current = true;
                    console.warn('Sheet hydration unavailable in this session, using cache/Supabase fallback.');
                }
            }

            // Only save empty snapshot if Supabase fetch was genuinely successful (returned empty)
            // AND there was no cache — meaning this is a truly new user with no data
            if (!cached && supabaseFetchSucceeded) {
                saveHostDataToCache(user.id, emptySnapshot);
                await saveSnapshotToSupabase(user, emptySnapshot);
                console.log('New user with no data — initialized empty snapshot.');
            }
        } catch (err) {
            console.error('Host hydration failed:', err);
        } finally {
            isHydratingHostRef.current = false;
            activeHydrationHostIdRef.current = null;
            isHostHydratedRef.current = true;
            setIsSyncing(false);
        }
    }, [applyHostData, getSheetId, getWebhookUrl, saveSnapshotToSupabase]);

    const syncNow = useCallback(async () => {
        if (!currentUser || isSyncing) return;
        const url = getWebhookUrl();
        const sheetId = getSheetId();
        setIsSyncing(true);
        try {
            const snapshot = buildHostSnapshot();
            await saveSnapshotToSupabase(currentUser, snapshot);
            await flushSheetQueue();
            if (url && sheetId && !sheetRemoteDisabledRef.current) {
                await batchSyncToSheet(url, sheetId, snapshot);
            }
            setLastSyncTime(new Date().toISOString());
            saveHostDataToCache(currentUser.id, snapshot);
        } catch (err) {
            console.error('Sync failed:', err);
        } finally {
            setIsSyncing(false);
        }
    }, [buildHostSnapshot, currentUser, flushSheetQueue, getSheetId, getWebhookUrl, isSyncing, saveSnapshotToSupabase]);

    useEffect(() => {
        if (currentUser?.role !== 'HOST' || !currentUser.id || !isHostHydratedRef.current) return;
        if (isSavingSnapshotRef.current) return;
        if (snapshotSaveFailCountRef.current >= 3) return;
        // Safety guard: don't auto-save if ALL data arrays are empty
        // This prevents overwriting Supabase with empty data during reload/HMR
        const hasAnyData = buildings.length > 0 || rooms.length > 0 || customers.length > 0
            || contracts.length > 0 || payments.length > 0 || equipment.length > 0 || serviceRecords.length > 0;
        if (!hasAnyData) {
            console.log('Auto-save skipped: all data arrays are empty — likely mid-reload.');
            return;
        }
        if (supabaseSnapshotTimerRef.current) clearTimeout(supabaseSnapshotTimerRef.current);
        supabaseSnapshotTimerRef.current = setTimeout(() => {
            saveSnapshotToSupabase(currentUser).catch(console.error);
        }, 3000);
        return () => {
            if (supabaseSnapshotTimerRef.current) clearTimeout(supabaseSnapshotTimerRef.current);
        };
    }, [currentUser, buildings, rooms, customers, contracts, payments, equipment, serviceRecords, saveSnapshotToSupabase]);

    // FIRESTORE INIT (Users + Settings ONLY)
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    useEffect(() => {
        initDefaultsIfNeeded(DEFAULT_ADMIN_USER, DEFAULT_PRICING_TIERS, DEFAULT_ADMIN_SETTINGS).catch(console.error);

        const unsubs = [
            listenUsers(setAllUsers),
            listenAdminSettings((settings) => {
                if (settings) setAdminSettings(normalizeAdminSettingsState(settings));
            }),
            listenPricingTiers((tiers) => {
                if (tiers && tiers.length > 0) setPricingTiers(tiers);
            }),
        ];

        return () => unsubs.forEach(unsub => unsub());
    }, []);

    useEffect(() => {
        return () => {
            if (flushQueueTimerRef.current) clearTimeout(flushQueueTimerRef.current);
        };
    }, []);

    // ——— Theme ———
    useEffect(() => { const s = localStorage.getItem('theme') as 'light' | 'dark'; if (s) setTheme(s); }, []);
    useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); localStorage.setItem('theme', theme); }, [theme]);

    // Scheduled Google Sheet auto-sync at 6h, 12h, 18h, 0h
    const lastScheduledSyncHourRef = useRef<number>(-1);
    useEffect(() => {
        if (!currentUser || currentUser.role !== 'HOST') return;

        const SYNC_HOURS = [0, 6, 12, 18];
        const checkAndSync = () => {
            const currentHour = new Date().getHours();
            if (SYNC_HOURS.includes(currentHour) && lastScheduledSyncHourRef.current !== currentHour) {
                lastScheduledSyncHourRef.current = currentHour;
                console.log(`[Scheduled Sync] Triggering auto-sync at ${currentHour}:00`);
                syncNow().catch(err => console.error('[Scheduled Sync] Failed:', err));
            }
        };

        checkAndSync();
        const intervalId = window.setInterval(checkAndSync, 60_000);
        return () => window.clearInterval(intervalId);
    }, [currentUser, syncNow]);

    // ——— Auto-login ———
    useEffect(() => {
        if (hasAutoLoggedInRef.current) return;
        const savedUserId = localStorage.getItem(SESSION_USER_ID_STORAGE_KEY);
        const savedRole = localStorage.getItem(SESSION_ROLE_STORAGE_KEY) as UserRole | null;
        if (allUsers.length === 0 && savedRole !== 'SUPER_ADMIN') return;

        let userToRestore: AppUser | undefined;
        if (savedUserId) {
            userToRestore = allUsers.find(user => user.id === savedUserId);
            if (!userToRestore && savedUserId === DEFAULT_ADMIN_USER.id) {
                userToRestore = DEFAULT_ADMIN_USER;
            }
        }

        if (!userToRestore && savedRole) {
            if (savedRole === 'SUPER_ADMIN') {
                userToRestore = DEFAULT_ADMIN_USER;
            } else if (savedRole !== 'TENANT' || TENANT_LOGIN_ENABLED) {
                const sameRoleUsers = allUsers.filter(user => user.role === savedRole);
                if (sameRoleUsers.length === 1) {
                    userToRestore = sameRoleUsers[0];
                }
            }
        }

        if (!userToRestore || (userToRestore.role === 'TENANT' && !TENANT_LOGIN_ENABLED)) {
            clearPersistedSessionUser();
            return;
        }

        hasAutoLoggedInRef.current = true;
        setCurrentUser(userToRestore);
        hydrateFromSheet(userToRestore);
    }, [allUsers, hydrateFromSheet, clearPersistedSessionUser]);

    useEffect(() => {
        if (!currentUser?.id) return;
        const updatedUser = allUsers.find(user => user.id === currentUser.id);
        if (updatedUser) {
            setCurrentUser(prev => (prev && prev.id === updatedUser.id ? { ...prev, ...updatedUser } : prev));
        }
    }, [allUsers, currentUser?.id]);

    useEffect(() => {
        if (!currentUser?.id || currentUser.role !== 'HOST') {
            setNotifications([]);
            processedRemoteNotificationIdsRef.current = new Set();
            return;
        }

        const storedNotifications = loadHostNotifications(currentUser.id);
        setNotifications(storedNotifications);
        processedRemoteNotificationIdsRef.current = new Set(storedNotifications.map(notification => notification.id));
    }, [currentUser?.id, currentUser?.role]);

    useEffect(() => {
        if (!currentUser?.id || currentUser.role !== 'HOST') return;

        const currentPeriod = getCurrentBillingPeriod();
        const customerById = new Map<string, Customer>(customers.map(customer => [customer.id, customer]));
        const roomById = new Map<string, Room>(rooms.map(room => [room.id, room]));

        const contractNotifications: AppNotification[] = contracts
            .filter(contract => contract.isActive)
            .map(contract => {
                const expiry = getContractExpiryState(contract, 7);
                if (!expiry) return null;

                const room = roomById.get(contract.roomId);
                const customer = customerById.get(contract.customerId);
                return {
                    id: `contract_expiring_${contract.id}`,
                    hostId: currentUser.id,
                    type: 'contract_expiring' as const,
                    severity: expiry.tone === 'error' ? 'error' : 'warning',
                    title: expiry.tone === 'error' ? 'Hợp đồng đã quá hạn' : 'Hợp đồng sắp hết hạn',
                    message: `${customer?.name || 'Khách thuê'} tại phòng ${room?.name || contract.roomId} ${expiry.label.toLowerCase()}.`,
                    createdAt: contract.endDate || new Date().toISOString(),
                    actionPath: `/app/rooms/${contract.roomId}`,
                    metadata: {
                        contractId: contract.id,
                        roomId: contract.roomId,
                        customerId: contract.customerId,
                        daysLeft: expiry.daysLeft,
                    },
                } satisfies AppNotification;
            })
            .filter((notification): notification is AppNotification => notification !== null);

        const roomBillNotifications: AppNotification[] = buildRoomBills({
            payments,
            contracts,
            rooms,
            customers,
            buildings,
        })
            .filter(bill => bill.period === currentPeriod && bill.status !== STATUS_PAID)
            .map(bill => ({
                id: `room_bill_pending_${bill.roomId}_${bill.period.replace(/[^0-9]+/g, '_')}`,
                hostId: currentUser.id,
                type: 'room_bill_pending' as const,
                severity: bill.status === STATUS_OVERDUE ? 'error' : 'warning',
                title: bill.status === STATUS_OVERDUE ? 'Bill phòng đang quá hạn' : 'Bill phòng chưa đóng',
                message: `${bill.roomLabel} còn ${formatCurrency(bill.pendingAmount)} của kỳ ${bill.period}.`,
                createdAt: bill.dueDate || new Date().toISOString(),
                actionPath: `/app/rooms/${bill.roomId}`,
                billId: bill.id,
                amount: bill.pendingAmount,
                metadata: {
                    period: bill.period,
                    status: bill.status,
                },
            }));

        const nextNotifications = [...contractNotifications, ...roomBillNotifications];
        const generatedPrefixes = ['contract_expiring_', 'room_bill_pending_'];
        const nextGeneratedMap = new Map(nextNotifications.map(notification => [notification.id, notification]));

        const preservedNotifications = notificationsRef.current.filter(notification => {
            const isGenerated = generatedPrefixes.some(prefix => notification.id.startsWith(prefix));
            return !isGenerated;
        });

        const generatedNotifications = nextNotifications.map(notification => {
            const previous = notificationsRef.current.find(item => item.id === notification.id);
            return previous ? { ...previous, ...notification } : notification;
        });

        const nextStoredNotifications = [...preservedNotifications, ...generatedNotifications];
        if (JSON.stringify(nextStoredNotifications) !== JSON.stringify(notificationsRef.current)) {
            persistHostNotifications(currentUser.id, nextStoredNotifications);
        }
    }, [buildings, contracts, currentUser?.id, currentUser?.role, customers, payments, persistHostNotifications, rooms]);

    useEffect(() => {
        if (!currentUser) return;

        const gatewayConfig = currentUser.role === 'HOST'
            ? getCurrentHostPaymentGatewayConfig()
            : normalizeHostPaymentGatewayConfig(currentUser.id, {
                bankName: bankInfoRef.current.bankName,
                accountNumber: bankInfoRef.current.accountNumber,
                accountName: bankInfoRef.current.accountName,
            });

        const nextBankInfo = {
            bankName: gatewayConfig.bankName || '',
            accountNumber: gatewayConfig.accountNumber || '',
            accountName: gatewayConfig.accountName || '',
        };
        if (
            nextBankInfo.bankName !== bankInfoRef.current.bankName ||
            nextBankInfo.accountNumber !== bankInfoRef.current.accountNumber ||
            nextBankInfo.accountName !== bankInfoRef.current.accountName
        ) {
            setBankInfo(nextBankInfo);
        }

        setUserProfile({
            name: currentUser.name || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
            bankName: gatewayConfig.bankName || '',
            accountNumber: gatewayConfig.accountNumber || '',
            accountName: gatewayConfig.accountName || '',
            idNumber: (currentUser as any).idNumber || '',
            idIssueDate: (currentUser as any).idIssueDate || '',
            idIssuePlace: (currentUser as any).idIssuePlace || '',
            idFrontImage: (currentUser as any).idFrontImage || '',
            idBackImage: (currentUser as any).idBackImage || '',
            avatarImage: (currentUser as any).avatarImage || '',
        });
    }, [currentUser, getCurrentHostPaymentGatewayConfig]);

    const updateCurrentHostPaymentGatewayConfig = useCallback(async (config: HostPaymentGatewayConfig) => {
        if (!currentUser || currentUser.role !== 'HOST') {
            return { success: false, error: 'Chỉ host mới cấu hình được webhook thanh toán.' };
        }

        const normalized = normalizeHostPaymentGatewayConfig(currentUser.id, {
            ...getCurrentHostPaymentGatewayConfig(),
            ...config,
            updatedAt: new Date().toISOString(),
        });
        const generatedWebhookUrl = buildHostPaymentWebhookUrl(getWebhookUrl(), {
            hostId: currentUser.id,
            provider: normalized.provider,
            webhookToken: normalized.webhookToken,
        });
        const storedConfig: HostPaymentGatewayConfig = {
            ...normalized,
            generatedWebhookUrl,
        };
        const nextSettings: AdminSettings = {
            ...adminSettings,
            paymentConfig: {
                bankName: adminSettings.paymentConfig?.bankName || '',
                accountNumber: adminSettings.paymentConfig?.accountNumber || '',
                accountName: adminSettings.paymentConfig?.accountName || '',
                webhookUrl: adminSettings.paymentConfig?.webhookUrl || '',
                gracePeriodDays: adminSettings.paymentConfig?.gracePeriodDays ?? 5,
                hostGatewayConfigs: {
                    ...getHostGatewayConfigMap(),
                    [currentUser.id]: storedConfig,
                },
            },
        };

        setAdminSettings(normalizeAdminSettingsState(nextSettings));
        setBankInfo({
            bankName: storedConfig.bankName || '',
            accountNumber: storedConfig.accountNumber || '',
            accountName: storedConfig.accountName || '',
        });

        try {
            await saveAdminSettings(nextSettings);
        } catch (error) {
            console.error('saveAdminSettings failed while updating payment gateway config:', error);
            return { success: false, error: 'Không lưu được cấu hình thanh toán trên admin settings.' };
        }

        const webhookBaseUrl = getWebhookUrl();
        const sheetId = getSheetId();
        let registrationError = '';

        if (webhookBaseUrl && sheetId) {
            const registration = await registerHostPaymentGateway(webhookBaseUrl, {
                hostId: currentUser.id,
                sheetId,
                config: storedConfig,
            });
            if (!registration.success) {
                registrationError = registration.error || 'Không đăng ký được webhook với Google Apps Script.';
            }
        }

        createHostNotification({
            type: 'gateway_config_updated',
            severity: registrationError ? 'warning' : 'info',
            title: registrationError ? 'Webhook thanh toán cần kiểm tra' : 'Đã cập nhật tài khoản nhận tiền',
            message: registrationError
                ? registrationError
                : storedConfig.enabled && storedConfig.provider !== 'manual'
                    ? 'Đã lưu cấu hình ngân hàng và kích hoạt webhook đối soát tự động.'
                    : 'Đã lưu cấu hình ngân hàng nhận tiền cho bill và chuyển khoản.',
            actionPath: '/app/payments',
            metadata: {
                provider: storedConfig.provider,
                webhookEnabled: storedConfig.enabled,
            },
        });

        return {
            success: !registrationError,
            webhookUrl: generatedWebhookUrl,
            error: registrationError || undefined,
        };
    }, [
        adminSettings,
        createHostNotification,
        currentUser,
        getCurrentHostPaymentGatewayConfig,
        getHostGatewayConfigMap,
        getSheetId,
        getWebhookUrl,
    ]);

    useEffect(() => {
        if (notificationPollRef.current) {
            clearInterval(notificationPollRef.current);
            notificationPollRef.current = null;
        }

        if (!currentUser?.id || currentUser.role !== 'HOST') return;

        const webhookUrl = getWebhookUrl();
        const sheetId = getSheetId();
        const gatewayConfig = getCurrentHostPaymentGatewayConfig();
        if (!webhookUrl || !sheetId || !gatewayConfig.enabled || gatewayConfig.provider === 'manual') {
            return;
        }

        let cancelled = false;

        const pullNotifications = async () => {
            const result = await fetchHostPaymentNotifications(webhookUrl, currentUser.id, gatewayConfig.webhookToken || '');
            if (cancelled || !result.success) return;

            if (result.gatewayConfig) {
                setAdminSettings(prev => {
                    const currentPaymentConfig = prev.paymentConfig || {
                        bankName: '',
                        accountNumber: '',
                        accountName: '',
                        gracePeriodDays: 5,
                    };
                    const currentHostConfig = normalizeHostPaymentGatewayConfig(currentUser.id, {
                        ...currentPaymentConfig.hostGatewayConfigs?.[currentUser.id],
                        ...result.gatewayConfig,
                    });
                    return {
                        ...prev,
                        paymentConfig: {
                            ...currentPaymentConfig,
                            hostGatewayConfigs: {
                                ...(currentPaymentConfig.hostGatewayConfigs || {}),
                                [currentUser.id]: {
                                    ...currentHostConfig,
                                    generatedWebhookUrl: buildHostPaymentWebhookUrl(webhookUrl, {
                                        hostId: currentUser.id,
                                        provider: currentHostConfig.provider,
                                        webhookToken: currentHostConfig.webhookToken,
                                    }),
                                },
                            },
                        },
                    };
                });
            }

            const incoming = (result.notifications || []).filter(
                notification => !processedRemoteNotificationIdsRef.current.has(notification.id),
            );
            if (incoming.length === 0) return;

            mergeHostNotifications(currentUser.id, incoming);

            const paidIds = new Set<string>();
            incoming.forEach(notification => {
                if (notification.metadata?.autoMarked === false) return;
                (notification.paymentIds || []).forEach(paymentId => paidIds.add(paymentId));
            });

            if (paidIds.size === 0) return;

            const fallbackPaidDate = new Date().toISOString().split('T')[0];
            setPayments(prev => {
                const updatedPayments: Payment[] = [];
                const next = prev.map(payment => {
                    if (!paidIds.has(payment.id)) return payment;
                    const updatedPayment = payment.status === 'ÄÃ£ Ä‘Ã³ng'
                        ? payment
                        : { ...payment, status: 'ÄÃ£ Ä‘Ã³ng' as const, billStatus: 'paid' as const, paidDate: payment.paidDate || fallbackPaidDate };
                    updatedPayments.push(updatedPayment);
                    return updatedPayment;
                });

                if (currentUser) {
                    updatedPayments.forEach(payment => upsertCacheItem(currentUser.id, 'payments', payment));
                }
                return next;
            });
        };

        void pullNotifications();
        notificationPollRef.current = setInterval(() => {
            void pullNotifications();
        }, 45000);

        return () => {
            cancelled = true;
            if (notificationPollRef.current) {
                clearInterval(notificationPollRef.current);
                notificationPollRef.current = null;
            }
        };
    }, [
        currentUser,
        getCurrentHostPaymentGatewayConfig,
        getSheetId,
        getWebhookUrl,
        mergeHostNotifications,
    ]);

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // IDLE TIMER: Auto-logout after 5 min inactivity
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    useEffect(() => {
        if (!currentUser || currentUser.role === 'SUPER_ADMIN') return;

        const resetIdle = () => {
            lastActivityRef.current = Date.now();
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            idleTimerRef.current = setTimeout(() => {
                console.log('â° Idle timeout â€” auto-logout');
                logout();
            }, IDLE_TIMEOUT_MS);
        };

        // Track user activity
        const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove'];
        events.forEach(e => window.addEventListener(e, resetIdle, { passive: true }));
        resetIdle(); // Start timer

        return () => {
            events.forEach(e => window.removeEventListener(e, resetIdle));
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, [currentUser]);

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // PERIODIC SYNC: Every 10 minutes
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    useEffect(() => {
        if (!currentUser || !getSheetId()) return;

        syncIntervalRef.current = setInterval(() => {
            console.log('ðŸ”„ Periodic sync triggered');
            syncNow();
        }, PERIODIC_SYNC_MS);

        return () => {
            if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
        };
    }, [currentUser, getSheetId, syncNow]);

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // AUTH
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const login = async (rawEmail: string, password: string): Promise<AppUser | null> => {
        const email = rawEmail.trim().toLowerCase();
        try {
            await signInWithEmailAndPassword(auth, email, password);

            let user = allUsers.find(u => u.email.trim().toLowerCase() === email);
            if (!user) {
                if (email === 'antonionguyen246@gmail.com') user = DEFAULT_ADMIN_USER;
                else if (email === 'demohost@gmail.com') user = { id: 'demo_host', name: 'Demo Host', email, phone: '0901234567', role: 'HOST', avatar: 'DH', status: 'active', subscriptionPlanId: 'premium', createdAt: new Date().toISOString() };
                else if (email === 'demotenant@gmail.com' && TENANT_LOGIN_ENABLED) user = { id: 'demo_tenant', name: 'Demo Tenant', email, phone: '0901234567', role: 'TENANT', avatar: 'DT', status: 'active', createdAt: new Date().toISOString() };
                else {
                    // Firebase Auth succeeded but user not in allUsers → search Supabase directly
                    const sbUser = await sbGetUserByEmail(email);
                    if (sbUser) {
                        user = sbUser;
                    } else {
                        // Auto-create Supabase profile from Firebase Auth user
                        const firebaseUser = auth.currentUser;
                        if (firebaseUser) {
                            const newUser: AppUser = {
                                id: firebaseUser.uid,
                                name: firebaseUser.displayName || email.split('@')[0],
                                email,
                                phone: firebaseUser.phoneNumber || '',
                                role: 'HOST',
                                avatar: (firebaseUser.displayName || email)[0].toUpperCase(),
                                status: 'active',
                                createdAt: new Date().toISOString().split('T')[0],
                            };
                            try {
                                await sbSetUser(newUser);
                                user = newUser;
                                console.log('[AUTO-SYNC] Created Supabase profile from Firebase Auth for:', email);
                            } catch (syncErr) {
                                console.error('[AUTO-SYNC] Failed to create Supabase profile:', syncErr);
                            }
                        }
                    }
                }
            }

            if (user) {
                if (user.role === 'TENANT' && !TENANT_LOGIN_ENABLED) {
                    await signOut(auth).catch(console.error);
                    return null;
                }
                resetSnapshotCircuitBreakers();
                sheetRemoteDisabledRef.current = false;
                sheetRemoteFailCountRef.current = 0;
                setCurrentUser(user);
                persistSessionUser(user);
                void hydrateFromSheet(user);
                return user;
            }
            return null;
        } catch (error: any) {
            console.warn('Firebase Auth login failed:', error.code, error.message);

            // Reject fallback if password was explicitly wrong or if requests are blocked due to rate limiting/user not found
            const isAuthFailure = error?.code === 'auth/wrong-password'
                || error?.code === 'auth/invalid-credential'
                || error?.code === 'auth/too-many-requests'
                || error?.code === 'auth/user-disabled'
                || error?.code === 'auth/user-not-found';

            if (isAuthFailure) {
                console.warn('[LOGIN] Auth failed naturally (wrong password/rate limited/not found), rejecting fallback.');
                if (error?.code === 'auth/too-many-requests') {
                    alert('Bạn đã nhập sai quá nhiều lần. Quyền đăng nhập tạm thời bị khóa, vui lòng thử lại sau.');
                }
                return null;
            }

            // Fallback: If Firebase Auth fails for other reasons (user-not-found, network, etc.)
            let fallbackUser = allUsers.find(u => u.email.trim().toLowerCase() === email);
            if (!fallbackUser && email === 'antonionguyen246@gmail.com') fallbackUser = DEFAULT_ADMIN_USER;

            if (!fallbackUser && email !== 'demohost@gmail.com' && email !== 'demotenant@gmail.com') {
                try {
                    console.log('Searching Supabase directly for:', email);
                    fallbackUser = await sbGetUserByEmail(email);
                    if (!fallbackUser) {
                        fallbackUser = await sbGetUserByEmail(rawEmail);
                    }
                } catch (sbErr) {
                    console.error('Direct Supabase fetch failed:', sbErr);
                }
            }

            if (fallbackUser) {
                if (fallbackUser.role === 'TENANT' && !TENANT_LOGIN_ENABLED) {
                    return null;
                }
                console.warn(`[FALLBACK] Logging in ${email} (Firebase error: ${error?.code}).`);
                resetSnapshotCircuitBreakers();
                sheetRemoteDisabledRef.current = false;
                sheetRemoteFailCountRef.current = 0;
                setCurrentUser(fallbackUser);
                persistSessionUser(fallbackUser);
                void hydrateFromSheet(fallbackUser);
                return fallbackUser;
            }
            return null;
        }
    };

    const logout = useCallback(() => {
        const snapshot = currentUser?.role === 'HOST' ? buildHostSnapshot() : null;

        const url = getWebhookUrl();
        const sheetId = getSheetId();
        if (currentUser?.role === 'HOST' && snapshot) {
            saveHostDataToCache(currentUser.id, snapshot);
            saveSnapshotToSupabase(currentUser, snapshot).catch(console.error);
        }
        if (url && sheetId && currentUser) {
            flushSheetQueue()
                .then(() => batchSyncToSheet(url, sheetId, snapshot || buildHostSnapshot()))
                .catch(console.error);
        }

        signOut(auth).catch(console.error);
        setCurrentUser(null);
        isHostHydratedRef.current = false;
        hasAutoLoggedInRef.current = false;
        isHydratingHostRef.current = false;
        activeHydrationHostIdRef.current = null;
        sheetRemoteDisabledRef.current = false;
        sheetRemoteFailCountRef.current = 0;
        clearPersistedSessionUser();

        // Clear business data from memory
        clearBusinessData();

        // Stop timers
        if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (flushQueueTimerRef.current) clearTimeout(flushQueueTimerRef.current);
        if (supabaseSnapshotTimerRef.current) clearTimeout(supabaseSnapshotTimerRef.current);
        pendingSheetOpsRef.current.clear();
    }, [getWebhookUrl, getSheetId, currentUser, flushSheetQueue, buildHostSnapshot, clearPersistedSessionUser, clearBusinessData, saveSnapshotToSupabase]);

    const switchRole = (role: UserRole) => {
        if (role === 'TENANT' && !TENANT_LOGIN_ENABLED) return;

        let user = allUsers.find(u => u.role === role);
        if (!user && role === 'SUPER_ADMIN') {
            user = DEFAULT_ADMIN_USER;
        } else if (!user) {
            user = { id: `temp_${role}`, name: role, email: '', phone: '', role, avatar: role[0], status: 'active' as const, createdAt: new Date().toISOString() };
        }
        if (user) {
            resetSnapshotCircuitBreakers();
            sheetRemoteDisabledRef.current = false;
            sheetRemoteFailCountRef.current = 0;
            setCurrentUser(user);
            persistSessionUser(user);
            hydrateFromSheet(user);
        }
    };

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // USER CRUD â†’ Supabase
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const addUser = async (userData: Omit<AppUser, 'id' | 'createdAt'> & { defaultPassword?: string }): Promise<AppUser | null> => {
        try {
            if (userData.role === 'TENANT' && !TENANT_LOGIN_ENABLED) {
        alert('Luá»“ng tenant Ä‘ang táº¡m táº¯t. HÃ£y báº­t láº¡i khi cáº§n cho ngÆ°á»i thuÃª Ä‘Äƒng nháº­p.');
                return null;
            }

            let uid = `U_${Date.now()}`;
            if (userData.email && userData.defaultPassword) {
                try {
                    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, userData.email, userData.defaultPassword);
                    uid = userCredential.user.uid;
                    await signOut(secondaryAuth);
                } catch (authErr: any) {
                    console.error("Firebase Auth create user failed:", authErr);
                    alert(`KhÃ´ng thá»ƒ táº¡o tÃ i khoáº£n Ä‘Äƒng nháº­p (Firebase Auth): ${authErr.message}`);
                    return null; // Stop here, don't create ghost user in Firestore
                }
            }

            const newUser: AppUser = {
                ...userData,
                id: uid,
                createdAt: new Date().toISOString().split('T')[0],
                avatar: userData.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
            };
            delete (newUser as any).defaultPassword;
            await sbSetUser(newUser);
            return newUser;
        } catch (error: any) {
            console.error("Failed to create user in Supabase:", error);
            alert(`Lá»—i lÆ°u dá»¯ liá»‡u ngÆ°á»i dÃ¹ng: ${error.message}`);
            return null;
        }
    };
    const updateUser = (user: AppUser) => {
        sbSetUser(user).catch(console.error);
    };
    const deleteUser = (id: string): boolean => {
        if (currentUser?.role !== 'SUPER_ADMIN') { alert('Chá»‰ Super Admin má»›i cÃ³ quyá»n xÃ³a!'); return false; }
        sbDeleteUser(id).catch(console.error);
        return true;
    };

    // â”€â”€ Permission helper â”€â”€
    const canDelete = () => currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'HOST';

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // BUILDING â†’ State + Sheet + Cache
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const addBuilding = (b: Building, initialEq?: Partial<Equipment>[]) => {
        const fullB = { ...b, hostId: b.hostId || currentUser?.id, createdAt: b.createdAt || new Date().toISOString() };
        setBuildings(prev => [...prev, fullB]);
        pushToSheet('buildings', fullB);
        if (currentUser) upsertCacheItem(currentUser.id, 'buildings', fullB);

        if (initialEq) {
            const newEq = initialEq.map(eq => normalizeEquipment({
                ...eq, id: `EQ${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                buildingId: b.id, status: eq.status || 'Tá»‘t',
                purchaseDate: eq.purchaseDate || new Date().toISOString().split('T')[0],
                price: eq.price || 0,
                hostId: currentUser?.id,
                createdAt: new Date().toISOString()
            } as Equipment));
            setEquipment(prev => [...prev, ...newEq]);
            newEq.forEach(eq => {
                pushToSheet('equipment', eq);
                if (currentUser) upsertCacheItem(currentUser.id, 'equipment', eq);
            });
        }
    };
    const deleteBuilding = (id: string): boolean => {
        if (!canDelete()) { alert('Bạn không có quyền xóa!'); return false; }
        setBuildings(prev => prev.filter(b => b.id !== id));
        removeFromSheet('buildings', id);
        if (currentUser) deleteCacheItem(currentUser.id, 'buildings', id);
        return true;
    };

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // ROOM â†’ State + Sheet + Cache
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const addRoom = (r: Room, initialEq?: Partial<Equipment>[]) => {
        const fullR = { ...r, hostId: r.hostId || currentUser?.id, createdAt: r.createdAt || new Date().toISOString() };
        setRooms(prev => [...prev, fullR]);
        pushToSheet('rooms', fullR);
        if (currentUser) upsertCacheItem(currentUser.id, 'rooms', fullR);

        if (initialEq) {
            const newEq = initialEq.map(eq => normalizeEquipment({
                ...eq, id: `EQ${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                buildingId: r.buildingId, roomId: r.id, status: eq.status || 'Tá»‘t',
                purchaseDate: eq.purchaseDate || new Date().toISOString().split('T')[0],
                price: eq.price || 0,
                hostId: currentUser?.id,
                createdAt: new Date().toISOString()
            } as Equipment));
            setEquipment(prev => [...prev, ...newEq]);
            newEq.forEach(eq => {
                pushToSheet('equipment', eq);
                if (currentUser) upsertCacheItem(currentUser.id, 'equipment', eq);
            });
        }
    };
    const addRoomsBulk = (newRooms: Room[], newEqs: Equipment[]) => {
        const normalizedEquipment: Equipment[] = newEqs.map(item => normalizeEquipment(item));
        const nextRooms = [...rooms, ...newRooms];
        const nextEquipment = [...equipment, ...normalizedEquipment];
        setRooms(nextRooms);
        setEquipment(nextEquipment);

        const url = getWebhookUrl();
        const sheetId = getSheetId();
        if (url && sheetId && currentUser) {
            batchSyncToSheet(url, sheetId, buildHostSnapshot({
                rooms: nextRooms,
                equipment: nextEquipment
            })).catch(console.error);
        }

        if (currentUser) {
            newRooms.forEach(r => upsertCacheItem(currentUser.id, 'rooms', r));
            normalizedEquipment.forEach(eq => upsertCacheItem(currentUser.id, 'equipment', eq));
        }
    };

    const addEquipmentBulk = (newEqs: Equipment[]) => {
        const normalizedEquipment: Equipment[] = newEqs.map(item => normalizeEquipment(item));
        const nextEquipment = [...equipment, ...normalizedEquipment];
        setEquipment(nextEquipment);

        const url = getWebhookUrl();
        const sheetId = getSheetId();
        if (url && sheetId && currentUser) {
            batchSyncToSheet(url, sheetId, buildHostSnapshot({
                equipment: nextEquipment
            })).catch(console.error);
        }

        if (currentUser) {
            normalizedEquipment.forEach(eq => upsertCacheItem(currentUser.id, 'equipment', eq));
        }
    };

    const addCustomersBulk = (newCustomers: Customer[]) => {
        const fullCustomers = newCustomers.map(c => ({
            ...c,
            nationality: c.nationality || 'Việt Nam',
            currentAddress: c.currentAddress || c.permanentAddress || '',
            residenceAddress: c.residenceAddress || c.currentAddress || c.permanentAddress || '',
            declarationCreated: c.declarationCreated ?? false,
            declarationStatus: c.declarationStatus || 'not_created',
            hostId: c.hostId || currentUser?.id,
            createdAt: c.createdAt || new Date().toISOString()
        }));

        const nextCustomers = [...customers, ...fullCustomers];
        setCustomers(nextCustomers);

        const url = getWebhookUrl();
        const sheetId = getSheetId();
        if (url && sheetId && currentUser) {
            batchSyncToSheet(url, sheetId, buildHostSnapshot({
                customers: nextCustomers
            })).catch(console.error);
        }

        if (currentUser) {
            fullCustomers.forEach(c => upsertCacheItem(currentUser.id, 'customers', c));
        }
    };
    const deleteRoom = (id: string) => {
        if (!canDelete()) { alert('Bạn không có quyền xóa!'); return; }
        setRooms(prev => prev.filter(r => r.id !== id));
        removeFromSheet('rooms', id);
        if (currentUser) deleteCacheItem(currentUser.id, 'rooms', id);
    };
    const updateRoom = (updatedRoom: Room) => {
        if (!canDelete()) { alert('Bạn không có quyền sửa!'); return; }
        setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
        pushToSheet('rooms', updatedRoom);
        if (currentUser) upsertCacheItem(currentUser.id, 'rooms', updatedRoom);
    };
    const updateRoomPosition = (id: string, _floor: number, x: number, y: number) => {
        setRooms(prev => prev.map(r => r.id === id ? { ...r, position: { x, y } } : r));
        const room = rooms.find(r => r.id === id);
        if (room) {
            const updated = { ...room, position: { x, y } };
            pushToSheet('rooms', updated);
            if (currentUser) upsertCacheItem(currentUser.id, 'rooms', updated);
        }
    };

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // CUSTOMER â†’ State + Sheet + Cache
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const addCustomer = (c: Customer) => {
        const fullC = {
            ...c,
            nationality: c.nationality || 'Viá»‡t Nam',
            currentAddress: c.currentAddress || c.permanentAddress || '',
            residenceAddress: c.residenceAddress || c.currentAddress || c.permanentAddress || '',
            declarationCreated: c.declarationCreated ?? false,
            declarationStatus: c.declarationStatus || 'not_created',
            hostId: c.hostId || currentUser?.id,
            createdAt: c.createdAt || new Date().toISOString()
        };
        setCustomers(prev => [...prev, fullC]);
        pushToSheet('customers', fullC);
        if (currentUser) upsertCacheItem(currentUser.id, 'customers', fullC);
    };

    const updateCustomer = (customer: Customer) => {
        const nextCustomer: Customer = {
            ...customer,
        nationality: customer.nationality || 'Viá»‡t Nam',
            currentAddress: customer.currentAddress || customer.residenceAddress || customer.permanentAddress || '',
            residenceAddress: customer.residenceAddress || customer.currentAddress || customer.permanentAddress || '',
            declarationCreated: customer.declarationCreated ?? false,
            declarationStatus: customer.declarationStatus || (customer.declarationCreated ? 'created' : 'not_created'),
        };
        setCustomers(prev => prev.map(item => item.id === nextCustomer.id ? nextCustomer : item));
        pushToSheet('customers', nextCustomer);
        if (currentUser) upsertCacheItem(currentUser.id, 'customers', nextCustomer);
    };

    const deleteCustomer = (id: string) => {
        if (!canDelete()) { alert('Bạn không có quyền xóa!'); return; }
        setCustomers(prev => prev.filter(c => c.id !== id));
        removeFromSheet('customers', id);
        if (currentUser) deleteCacheItem(currentUser.id, 'customers', id);
    };

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // CONTRACT â†’ State + Sheet + Cache
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const createContract = (c: Contract) => {
        const fullC = { ...c, hostId: c.hostId || currentUser?.id, createdAt: c.createdAt || new Date().toISOString() };
        const nextContracts = [...contracts, fullC];
        setContracts(nextContracts);
        pushToSheet('contracts', fullC);
        if (currentUser) upsertCacheItem(currentUser.id, 'contracts', fullC);

        const nextRooms = reconcileRoomsWithContracts(rooms, nextContracts);
        setRooms(nextRooms);
        const room = rooms.find(r => r.id === c.roomId);
        if (room) {
            const updated = nextRooms.find(item => item.id === c.roomId) || room;
            pushToSheet('rooms', updated);
            if (currentUser) upsertCacheItem(currentUser.id, 'rooms', updated);
        }
    };
    const updateContract = (c: Contract) => {
        const previousContract = contracts.find(contract => contract.id === c.id);
        const nextContracts = contracts.map(contract => contract.id === c.id ? c : contract);
        setContracts(nextContracts);
        pushToSheet('contracts', c);
        if (currentUser) upsertCacheItem(currentUser.id, 'contracts', c);

        const nextRooms = reconcileRoomsWithContracts(rooms, nextContracts);
        setRooms(nextRooms);

        const affectedRoomIds = new Set([previousContract?.roomId, c.roomId].filter(Boolean));
        affectedRoomIds.forEach(roomId => {
            const roomUpdated = nextRooms.find(item => item.id === roomId);
            if (!roomUpdated) return;
            pushToSheet('rooms', roomUpdated);
            if (currentUser) upsertCacheItem(currentUser.id, 'rooms', roomUpdated);
        });
    };
    const terminateContract = (id: string) => {
        const contract = contracts.find(c => c.id === id);
        if (!contract) return;
        const today = new Date().toISOString().split('T')[0];
        const updated = { ...contract, isActive: false, endDate: today };
        const nextContracts = contracts.map(c => c.id === id ? updated : c);
        setContracts(nextContracts);
        pushToSheet('contracts', updated);
        if (currentUser) upsertCacheItem(currentUser.id, 'contracts', updated);

        const nextRooms = reconcileRoomsWithContracts(rooms, nextContracts);
        setRooms(nextRooms);
        const room = rooms.find(r => r.id === contract.roomId);
        if (room) {
            const roomUpdated = nextRooms.find(item => item.id === contract.roomId) || room;
            pushToSheet('rooms', roomUpdated);
            if (currentUser) upsertCacheItem(currentUser.id, 'rooms', roomUpdated);
        }

        const customer = customers.find(item => item.id === contract.customerId);
        const remainingOccupants = nextContracts.filter(item => item.isActive && item.roomId === contract.roomId).length;
        createHostNotification({
            type: 'contract_terminated',
            severity: 'info',
            title: 'Đã hủy hợp đồng',
            message: `${customer?.name || 'Khách thuê'} đã được đưa khỏi phòng ${room?.name || contract.roomId}. ${remainingOccupants === 0 ? 'Phòng đã chuyển về trạng thái trống.' : `Phòng còn ${remainingOccupants} khách đang ở.`}`,
            actionPath: `/app/rooms/${contract.roomId}`,
            metadata: {
                contractId: contract.id,
                customerId: contract.customerId,
                roomId: contract.roomId,
                remainingOccupants,
            },
        });
    };

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // SERVICE RECORD â†’ State + Sheet + Cache
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    const createServiceRecordId = (roomId: string, month: string) => `SV_${roomId}_${month.replace(/\//g, '_')}`;

    const getBillingPeriodRange = (period: string) => {
        const parsed = parseBillingPeriod(period);
        if (!parsed) return null;

        const start = new Date(parsed.year, parsed.month - 1, 1);
        const end = new Date(parsed.year, parsed.month, 0, 23, 59, 59, 999);
        return { start, end };
    };

    const isContractBillableForPeriod = (contract: Contract, period: string) => {
        const range = getBillingPeriodRange(period);
        if (!range) return Boolean(contract.isActive);

        const startDate = contract.startDate ? new Date(contract.startDate) : null;
        const endDate = contract.endDate ? new Date(contract.endDate) : null;

        if (startDate && !Number.isNaN(startDate.getTime()) && startDate.getTime() > range.end.getTime()) {
            return false;
        }
        if (endDate && !Number.isNaN(endDate.getTime()) && endDate.getTime() < range.start.getTime()) {
            return false;
        }

        return true;
    };

    const getBillableContractsForPeriod = (period: string) => {
        return contracts.filter(contract => isContractBillableForPeriod(contract, period));
    };

    const getLatestCompletedBillingPeriod = (): string | null => {
        const roomRentPayments = payments.filter(
            payment => (payment.direction || 'income') !== 'expense' && (payment.category || 'other') === 'room',
        );
        const periodValues = roomRentPayments
            .map(payment => payment.period)
            .filter((period): period is string => typeof period === 'string' && period.length > 0);
        const periods = Array.from(new Set<string>(periodValues)).sort(compareBillingPeriods);

        let latestPeriod: string | null = null;
        periods.forEach(period => {
            const billableContracts = getBillableContractsForPeriod(period);
            if (billableContracts.length === 0) return;

            const hasFullCoverage = billableContracts.every(contract =>
                roomRentPayments.some(payment => payment.contractId === contract.id && payment.period === period),
            );
            if (hasFullCoverage) {
                latestPeriod = period;
            }
        });

        return latestPeriod;
    };

    const resolveTargetBillingPeriod = (periodOverride?: string): string => {
        if (periodOverride) return periodOverride;

        const currentPeriod = getCurrentBillingPeriod();
        const currentContracts = getBillableContractsForPeriod(currentPeriod);
        if (currentContracts.length === 0) return currentPeriod;

        const roomRentPayments = payments.filter(
            payment => (payment.direction || 'income') !== 'expense' && (payment.category || 'other') === 'room',
        );
        const currentHasFullCoverage = currentContracts.every(contract =>
            roomRentPayments.some(payment => payment.contractId === contract.id && payment.period === currentPeriod),
        );
        if (!currentHasFullCoverage) return currentPeriod;

        const latestCompletedPeriod = getLatestCompletedBillingPeriod();
        return getNextBillingPeriod(latestCompletedPeriod || currentPeriod);
    };

    // Service records
    const addServiceRecord = (r: ServiceRecord) => {
        const existingRecord = serviceRecords.find(record => record.roomId === r.roomId && record.month === r.month);
        const normalizedRecord: ServiceRecord = {
            ...existingRecord,
            ...r,
            id: existingRecord?.id || r.id || createServiceRecordId(r.roomId, r.month),
            electricOldReading: r.electricOldReading ?? existingRecord?.electricOldReading ?? 0,
            electricNewReading: r.electricNewReading ?? existingRecord?.electricNewReading ?? 0,
            electricUsage: r.electricUsage,
            waterOldReading: r.waterOldReading ?? existingRecord?.waterOldReading ?? 0,
            waterNewReading: r.waterNewReading ?? existingRecord?.waterNewReading ?? 0,
            waterUsage: r.waterUsage,
            internetCost: r.internetCost,
            otherCost: r.otherCost,
            totalCost: r.totalCost,
            electricRecordedAt: r.electricRecordedAt || existingRecord?.electricRecordedAt || new Date().toISOString(),
            waterRecordedAt: r.waterRecordedAt || existingRecord?.waterRecordedAt || new Date().toISOString(),
            note: r.note || existingRecord?.note || '',
            recordedAt: r.recordedAt || new Date().toISOString(),
        };

        setServiceRecords(prev => {
            const next = prev.filter(record => !(record.roomId === normalizedRecord.roomId && record.month === normalizedRecord.month));
            next.push(normalizedRecord);
            return next.sort((left, right) => compareBillingPeriods(left.month, right.month));
        });
        pushToSheet('serviceRecords', normalizedRecord);
        if (currentUser) upsertCacheItem(currentUser.id, 'serviceRecords', normalizedRecord);
    };

    // Payments
    const markPaymentPaid = (id: string, amount?: number) => {
        const payment = payments.find(item => item.id === id);
        if (!payment) return;

        const remainingAmount = getPaymentRemainingAmount(payment);
        const collectedAmount = Math.max(0, Math.min(Math.round(amount ?? remainingAmount), remainingAmount));
        if (collectedAmount <= 0) return;

        const collectedDate = new Date().toISOString().split('T')[0];
        const updatedPayment = applyPaymentCollection(payment, collectedAmount, collectedDate);
        setPayments(prev => prev.map(item => item.id === id ? updatedPayment : item));
        pushToSheet('payments', updatedPayment);
        if (currentUser) upsertCacheItem(currentUser.id, 'payments', updatedPayment);

        const contract = contracts.find(item => item.id === updatedPayment.contractId);
        const room = rooms.find(item => item.id === contract?.roomId);
        const customer = customers.find(item => item.id === contract?.customerId);
        const isPartial = getPaymentRemainingAmount(updatedPayment) > 0;

        createHostNotification({
            type: 'payment_paid',
            severity: isPartial ? 'info' : 'success',
            title: isPartial ? 'Đã ghi nhận thanh toán một phần' : 'Đã ghi nhận thanh toán',
            message: `${customer?.name || 'Khách thuê'} đã thanh toán ${formatCurrency(collectedAmount)} cho ${updatedPayment.type}${room ? ` tại phòng ${room.name}` : ''}.${isPartial ? ` Còn lại ${formatCurrency(getPaymentRemainingAmount(updatedPayment))}.` : ''}`,
            paymentIds: [updatedPayment.id],
            amount: collectedAmount,
            actionPath: '/app/payments',
        });
    };
    const sendReminder = (id: string) => {
        const payment = payments.find(item => item.id === id);
        if (!payment) return;

        const contract = contracts.find(item => item.id === payment.contractId);
        const customer = customers.find(item => item.id === contract?.customerId);
        createHostNotification({
            type: 'payment_reminder',
            severity: 'warning',
            title: 'Đã tạo nhắc nợ',
            message: `Đã tạo nhắc thanh toán cho ${customer?.name || 'khách thuê'} với phiếu ${id}.`,
            paymentIds: [id],
            amount: getPaymentRemainingAmount(payment),
            actionPath: '/app/payments',
        });
        alert(`Đã gửi nhắc nợ cho mã phiếu ${id} qua Zalo!`);
    };
    const createRoomPayments = (referenceContract: Contract, targetPeriod: string, activeBillingContracts: Contract[], generatedPayments: Payment[], existingKeys: Set<string>, latestServiceRecords: Map<string, ServiceRecord>, roomSharedCategories: Set<string>, contractById: Map<string, Contract>) => {
        const parsedPeriod = parseBillingPeriod(targetPeriod) || parseBillingPeriod(getCurrentBillingPeriod()) || {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
        };
        const month = String(parsedPeriod.month).padStart(2, '0');
        const year = String(parsedPeriod.year);
        const dueDate = `${year}-${month}-05`;
        const sourceDate = new Date().toISOString().split('T')[0];

        const resolvePaymentKey = (payment: Payment) => {
            const category = payment.category || 'other';
            if (roomSharedCategories.has(category)) {
                const roomId = contractById.get(payment.contractId)?.roomId || payment.contractId;
                return `room:${roomId}:${category}:${payment.type}`;
            }
            if (category === 'service') {
                return `contract:${payment.contractId}:${category}:${payment.type}:${payment.description || ''}`;
            }
            return `contract:${payment.contractId}:${category}:${payment.type}`;
        };

        const queuePayment = (payment: Payment) => {
            const key = resolvePaymentKey(payment);
            if (existingKeys.has(key)) return;
            existingKeys.add(key);
            generatedPayments.push(payment);
        };

        const roomBillId = `BILL_${referenceContract.roomId}_${year}${month}`;
        const makePayment = (amount: number, type: string, category: Payment['category'], description = ''): Payment => ({
            id: `PY_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            contractId: referenceContract.id,
            billId: roomBillId,
            amount,
            paidAmount: 0,
            remainingAmount: amount,
            lastCollectedAmount: 0,
            type,
            period: targetPeriod,
            dueDate,
            status: STATUS_PENDING,
            description,
            category,
            direction: 'income',
            sourceDate,
            billStatus: paymentStatusToBillStatus(STATUS_PENDING),
            paymentMethod: 'bank_transfer',
        });

        // 1. Tiền phòng định kỳ (Chỉ thu dựa trên Hợp đồng chính của phòng)
        queuePayment({
            id: `PY_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            contractId: referenceContract.id,
            billId: roomBillId,
            amount: referenceContract.price,
            paidAmount: 0,
            remainingAmount: referenceContract.price,
            lastCollectedAmount: 0,
            type: '\u0054i\u1ec1n ph\u00f2ng \u0111\u1ecbnh k\u1ef3',
            period: targetPeriod,
            dueDate,
            status: STATUS_PENDING,
            category: 'room',
            direction: 'income',
            sourceDate,
            billStatus: paymentStatusToBillStatus(STATUS_PENDING),
            paymentMethod: 'bank_transfer',
        });

        // 2. Extra Services (Dịch vụ thêm theo hợp đồng chính)
        (referenceContract.extraServices || [])
            .filter(service => service.enabled)
            .forEach(service => {
                queuePayment({
                    id: `PY_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                    contractId: referenceContract.id,
                    billId: roomBillId,
                    amount: service.unitPrice,
                    paidAmount: 0,
                    remainingAmount: service.unitPrice,
                    lastCollectedAmount: 0,
                    type: service.name,
                    period: targetPeriod,
                    dueDate,
                    status: STATUS_PENDING,
                    description: `D\u1ecbch v\u1ee5: ${service.name}`,
                    category: 'service',
                    direction: 'income',
                    sourceDate,
                    billStatus: paymentStatusToBillStatus(STATUS_PENDING),
                    paymentMethod: 'bank_transfer',
                });
            });

        // 3. Internet
        if (referenceContract.internetPrice > 0) {
            queuePayment(makePayment(referenceContract.internetPrice, 'Internet', 'internet'));
        }

        const usage = latestServiceRecords.get(referenceContract.roomId);
        
        // 4. Điện
        const isElectricFixed = referenceContract.electricBillingType === 'fixed';
        if (isElectricFixed) {
            queuePayment(makePayment(referenceContract.electricPrice, '\u0054i\u1ec1n \u0111i\u1ec7n', 'electric', 'Kho\u00e1n c\u1ed1 \u0111\u1ecbnh'));
        } else if (usage && usage.electricUsage > 0) {
            queuePayment(makePayment(usage.electricUsage * referenceContract.electricPrice, '\u0054i\u1ec1n \u0111i\u1ec7n', 'electric', `${usage.electricOldReading ?? 0} -> ${usage.electricNewReading ?? usage.electricUsage} (${usage.electricUsage} kWh)`));
        }

        // 5. Nước
        const isWaterFixed = referenceContract.waterBillingType === 'fixed';
        if (isWaterFixed) {
            queuePayment(makePayment(referenceContract.waterPrice, '\u0054i\u1ec1n n\u01b0\u1edbc', 'water', 'Kho\u00e1n c\u1ed1 \u0111\u1ecbnh'));
        } else if (usage && usage.waterUsage > 0) {
            queuePayment(makePayment(usage.waterUsage * referenceContract.waterPrice, '\u0054i\u1ec1n n\u01b0\u1edbc', 'water', `${usage.waterOldReading ?? 0} -> ${usage.waterNewReading ?? usage.waterUsage} (${usage.waterUsage} m3)`));
        }

        // 6. Phụ thu khác
        if (usage && usage.otherCost > 0) {
            queuePayment(makePayment(usage.otherCost, 'Ph\u1ee5 thu kh\u00e1c', 'other', `Kh\u00e1c k\u1ef3 ${usage.month}`));
        }
    };

    const generateMonthlyPayments = (periodOverride?: string) => {
        const targetPeriod = resolveTargetBillingPeriod(periodOverride);
        const roomSharedCategories = new Set<NonNullable<Payment['category']>>(['internet', 'electric', 'water', 'other']);
        const contractById = new Map<string, Contract>(contracts.map(contract => [contract.id, contract]));
        const activeContracts = getBillableContractsForPeriod(targetPeriod);

        if (activeContracts.length === 0) {
            alert('Chưa có hợp đồng hiệu lực để tạo phiếu thu.');
            return;
        }

        const resolvePaymentKey = (payment: Payment) => {
            const category = payment.category || 'other';
            if (roomSharedCategories.has(category)) {
                const roomId = contractById.get(payment.contractId)?.roomId || payment.contractId;
                return `room:${roomId}:${category}:${payment.type}`;
            }
            if (category === 'service') {
                return `contract:${payment.contractId}:${category}:${payment.type}:${payment.description || ''}`;
            }
            return `contract:${payment.contractId}:${category}:${payment.type}`;
        };

        const existingKeys = new Set<string>(
            payments
                .filter(payment => payment.period === targetPeriod && (payment.direction || 'income') !== 'expense')
                .map(resolvePaymentKey),
        );

        const latestServiceRecords = new Map<string, ServiceRecord>();
        serviceRecords
            .filter(record => record.month === targetPeriod)
            .sort((left, right) => new Date(left.recordedAt || 0).getTime() - new Date(right.recordedAt || 0).getTime())
            .forEach(record => {
                latestServiceRecords.set(record.roomId, record);
            });

        const generatedPayments: Payment[] = [];
        const activeContractsByRoom = new Map<string, Contract[]>();

        activeContracts.forEach(contract => {
            const roomContracts = activeContractsByRoom.get(contract.roomId) || [];
            roomContracts.push(contract);
            activeContractsByRoom.set(contract.roomId, roomContracts);
        });

        activeContractsByRoom.forEach(roomContracts => {
            roomContracts.sort(
                (left, right) =>
                    new Date(right.startDate || right.createdAt || 0).getTime() -
                    new Date(left.startDate || left.createdAt || 0).getTime(),
            );

            const referenceContract = roomContracts[0];
            createRoomPayments(referenceContract, targetPeriod, roomContracts, generatedPayments, existingKeys, latestServiceRecords, roomSharedCategories, contractById);
        });

        if (generatedPayments.length === 0) {
            alert(`Không có phiếu mới để tạo cho kỳ ${targetPeriod}.`);
            return;
        }

        setPayments(prev => [...prev, ...generatedPayments]);
        generatedPayments.forEach(payment => {
            pushToSheet('payments', payment);
            if (currentUser) upsertCacheItem(currentUser.id, 'payments', payment);
        });
        createHostNotification({
            type: 'monthly_bills_generated',
            severity: 'info',
            title: 'Đã tạo phiếu thu kỳ mới',
            message: `Đã tạo ${generatedPayments.length} phiếu cho kỳ ${targetPeriod}, tổng giá trị ${formatCurrency(generatedPayments.reduce((sum, payment) => sum + payment.amount, 0))}.`,
            paymentIds: generatedPayments.map(payment => payment.id),
            amount: generatedPayments.reduce((sum, payment) => sum + payment.amount, 0),
            actionPath: '/app/payments',
        });
        alert(`Đã tạo ${generatedPayments.length} phiếu thu cho kỳ ${targetPeriod}.`);
    };

    const generateRoomBill = (roomId: string, periodOverride?: string) => {
        const targetPeriod = resolveTargetBillingPeriod(periodOverride);
        const roomSharedCategories = new Set<NonNullable<Payment['category']>>(['internet', 'electric', 'water', 'other']);
        const contractById = new Map<string, Contract>(contracts.map(contract => [contract.id, contract]));
        
        const activeContracts = getBillableContractsForPeriod(targetPeriod).filter(contract => contract.roomId === roomId);

        if (activeContracts.length === 0) {
            alert(`Không có hợp đồng hiệu lực cho phòng này để tạo phiếu thu kỳ ${targetPeriod}.`);
            return { length: 0 };
        }

        const resolvePaymentKey = (payment: Payment) => {
            const category = payment.category || 'other';
            if (roomSharedCategories.has(category)) {
                return `room:${roomId}:${category}:${payment.type}`;
            }
            if (category === 'service') {
                return `contract:${payment.contractId}:${category}:${payment.type}:${payment.description || ''}`;
            }
            return `contract:${payment.contractId}:${category}:${payment.type}`;
        };

        const existingKeys = new Set<string>(
            payments
                .filter(payment => payment.period === targetPeriod && (payment.direction || 'income') !== 'expense')
                .map(resolvePaymentKey),
        );

        const latestServiceRecords = new Map<string, ServiceRecord>();
        serviceRecords
            .filter(record => record.month === targetPeriod && record.roomId === roomId)
            .sort((left, right) => new Date(left.recordedAt || 0).getTime() - new Date(right.recordedAt || 0).getTime())
            .forEach(record => {
                latestServiceRecords.set(record.roomId, record);
            });

        const generatedPayments: Payment[] = [];

        activeContracts.sort(
            (left, right) =>
                new Date(right.startDate || right.createdAt || 0).getTime() -
                new Date(left.startDate || left.createdAt || 0).getTime(),
        );

        const referenceContract = activeContracts[0];
        createRoomPayments(referenceContract, targetPeriod, activeContracts, generatedPayments, existingKeys, latestServiceRecords, roomSharedCategories, contractById);

        if (generatedPayments.length === 0) {
            alert(`Sắp xuất hoá đơn cho nhóm chi phí chưa tính, nhưng không có dữ liệu cần tạo mới.`);
            return { length: 0 };
        }

        setPayments(prev => [...prev, ...generatedPayments]);
        generatedPayments.forEach(payment => {
            pushToSheet('payments', payment);
            if (currentUser) upsertCacheItem(currentUser.id, 'payments', payment);
        });
        
        alert(`Đã tạo thành công ${generatedPayments.length} khoản thu cho phòng trong kỳ ${targetPeriod}.`);
        return { length: generatedPayments.length, period: targetPeriod };
    };
    const sendBulkBills = (period: string) => {
        const periodBills = buildRoomBills({ payments, contracts, rooms, customers, buildings }).filter(bill => bill.period === period);
        const pendingAmount = periodBills.reduce((sum, bill) => sum + bill.pendingAmount, 0);
        createHostNotification({
            type: 'bulk_bills_sent',
            severity: 'info',
            title: 'Đã tạo lô gửi bill',
            message: `Đã chuẩn bị gửi ${periodBills.length} bill trong kỳ ${period}.`,
            paymentIds: periodBills.flatMap(bill => bill.pendingPaymentIds),
            amount: pendingAmount,
            actionPath: '/app/payments',
        });
        alert(`Đã gửi hàng loạt hóa đơn kỳ ${period}.`);
    };

    const updateBankInfo = (info: BankInfo) => {
        setBankInfo(info);
        setUserProfile(prev => ({
            ...prev,
            bankName: info.bankName || '',
            accountNumber: info.accountNumber || '',
            accountName: info.accountName || '',
        }));
    };

    const addEquipment = (item: Equipment) => {
        const normalizedItem = normalizeEquipment({
            ...item,
            hostId: item.hostId || currentUser?.id,
            createdAt: item.createdAt || new Date().toISOString(),
        });
        setEquipment(prev => [...prev, normalizedItem]);
        pushToSheet('equipment', normalizedItem);
        if (currentUser) upsertCacheItem(currentUser.id, 'equipment', normalizedItem);
    };

    const updateEquipment = (item: Equipment) => {
        const normalizedItem = normalizeEquipment(item);
        setEquipment(prev => prev.map(entry => entry.id === normalizedItem.id ? normalizedItem : entry));
        pushToSheet('equipment', normalizedItem);
        if (currentUser) upsertCacheItem(currentUser.id, 'equipment', normalizedItem);
    };

    const deleteEquipment = (id: string) => {
        if (!canDelete()) {
            alert('Bạn không có quyền xóa!');
            return;
        }
        setEquipment(prev => prev.filter(item => item.id !== id));
        removeFromSheet('equipment', id);
        if (currentUser) deleteCacheItem(currentUser.id, 'equipment', id);
    };

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const updateUserProfile = (profile: UserProfile) => {
        setUserProfile(profile);

        const nextBankInfo: BankInfo = {
            bankName: profile.bankName || '',
            accountNumber: profile.accountNumber || '',
            accountName: profile.accountName || '',
        };
        setBankInfo(nextBankInfo);

        if (currentUser && currentUser.role !== 'SUPER_ADMIN') {
            const nextUser: AppUser = {
                ...currentUser,
                name: profile.name || currentUser.name,
                email: profile.email || currentUser.email,
                phone: profile.phone || currentUser.phone,
            };
            setCurrentUser(nextUser);
            sbSetUser(nextUser).catch(console.error);
        }

        if (currentUser?.role === 'HOST') {
            const gatewayConfig = getCurrentHostPaymentGatewayConfig();
            if (gatewayConfig.bankName !== nextBankInfo.bankName || gatewayConfig.accountNumber !== nextBankInfo.accountNumber || gatewayConfig.accountName !== nextBankInfo.accountName) {
                updateCurrentHostPaymentGatewayConfig({ ...gatewayConfig, ...nextBankInfo }).catch(console.error);
            }
        }
    };

    const updateAdminSettings = (settings: AdminSettings) => {
        const normalized = normalizeAdminSettingsState(settings);
        setAdminSettings(normalized);
        saveAdminSettings(normalized).catch(console.error);
    };

    const addLead = (lead: Omit<RegistrationLead, 'id' | 'createdAt' | 'status'>) => {
        setLeads(prev => [
            ...prev,
            {
                ...lead,
                id: `LEAD${Date.now()}`,
                createdAt: new Date().toISOString(),
                status: 'new',
            },
        ]);
    };

    const updateLeadStatus = (id: string, status: RegistrationLead['status']) => {
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status } : lead));
    };

    const addProposal = (proposal: Omit<HostProposal, 'id' | 'createdAt' | 'status'>) => {
        setProposals(prev => [
            ...prev,
            {
                ...proposal,
                id: `PROP${Date.now()}`,
                createdAt: new Date().toISOString(),
                status: 'pending',
            },
        ]);
    };

    const updateProposalStatus = (id: string, status: HostProposal['status']) => {
        setProposals(prev => prev.map(proposal => proposal.id === id ? { ...proposal, status } : proposal));
    };

    const updateHostPaymentStatus = (id: string, status: HostPayment['status']) => {
        const paidDate = status === STATUS_PAID ? new Date().toISOString().split('T')[0] : undefined;
        setHostPayments(prev => prev.map(payment => payment.id === id ? { ...payment, status, paidDate: paidDate || payment.paidDate } : payment));
    };

    const addPricingTier = (tier: Omit<PricingTier, 'id'>) => {
        const nextTiers = [...pricingTiers, { ...tier, id: `tier_${Date.now()}` }];
        setPricingTiers(nextTiers);
        savePricingTiers(nextTiers).catch(console.error);
    };

    const updatePricingTier = (tier: PricingTier) => {
        const nextTiers = pricingTiers.map(entry => entry.id === tier.id ? tier : entry);
        setPricingTiers(nextTiers);
        savePricingTiers(nextTiers).catch(console.error);
    };

    const deletePricingTier = (id: string) => {
        const nextTiers = pricingTiers.filter(entry => entry.id !== id);
        setPricingTiers(nextTiers);
        savePricingTiers(nextTiers).catch(console.error);
    };

    const addCrmNote = (note: Omit<CrmNote, 'id' | 'createdAt'>) => {
        setCrmNotes(prev => [
            ...prev,
            {
                ...note,
                id: `CRM_${Date.now()}`,
                createdAt: new Date().toISOString(),
            },
        ]);
    };

    const sendHostPaymentReminder = (hostId: string, amount: number) => {
        createHostNotification({
            hostId,
            type: 'system',
            severity: 'warning',
            title: 'Hết hạn thanh toán cước phí',
            message: `Hệ thống nhắc nhở: Vui lòng thanh toán khoản phí sử dụng nền tảng ${formatCurrency(amount)} để tránh bị gián đoạn dịch vụ.`,
            actionPath: '/app/settings',
            metadata: {
                amount,
            }
        });
        alert(`Đã gửi thông báo nhắc thanh toán ${formatCurrency(amount)} đến Host.`);
    };

    const createGoogleSheetForHost = async (hostId: string): Promise<{ success: boolean; url?: string; error?: string }> => {
        const host = allUsers.find(user => user.id === hostId);
        if (!host) return { success: false, error: 'Host not found' };

        const hostBuildings = buildings.filter(building => building.hostId === hostId);
        const buildingIds = new Set(hostBuildings.map(building => building.id));
        const hostRooms = rooms.filter(room => buildingIds.has(room.buildingId));
        const roomIds = new Set(hostRooms.map(room => room.id));
        const hostContracts = contracts.filter(contract => roomIds.has(contract.roomId));
        const contractIds = new Set(hostContracts.map(contract => contract.id));
        const customerIds = new Set(hostContracts.map(contract => contract.customerId));
        const hostCustomers = customers.filter(customer => customerIds.has(customer.id));
        const hostPaymentsData = payments.filter(payment => contractIds.has(payment.contractId));
        const hostEquipmentData = equipment.filter(item => buildingIds.has(item.buildingId));
        const hostServiceRecords = serviceRecords.filter(record => roomIds.has(record.roomId));
        const hostPaymentLedger = hostPayments.filter(payment => payment.hostId === hostId);
        const pricingTier = pricingTiers.find(tier => tier.id === host.subscriptionPlanId) || null;
        const webhookUrl = getWebhookUrl();

        if (webhookUrl && webhookUrl.trim()) {
            try {
                const result = await createHostGoogleSheet(webhookUrl, {
                    hostId,
                    hostName: host.name,
                    hostEmail: host.email,
                    hostPhone: host.phone,
                    buildings: hostBuildings,
                    rooms: hostRooms,
                    customers: hostCustomers,
                    contracts: hostContracts,
                    payments: hostPaymentsData,
                    equipment: hostEquipmentData,
                    serviceRecords: hostServiceRecords,
                    hostPayments: hostPaymentLedger,
                    pricingTier,
                    subscriptionSnapshot: buildSubscriptionSnapshotForHost(host),
                });

                if (result.success && result.spreadsheetId) {
                    const nextHost: AppUser = {
                        ...host,
                        googleSheetId: result.spreadsheetId,
                        googleSheetUrl: result.spreadsheetUrl,
                    };
                    setAllUsers(prev => prev.map(user => user.id === hostId ? nextHost : user));
                    if (currentUser?.id === hostId) setCurrentUser(nextHost);
                    sbSetUser(nextHost).catch(console.error);
                }

                return { success: result.success, url: result.spreadsheetUrl, error: result.error };
            } catch (error) {
                console.error('createGoogleSheetForHost failed:', error);
            }
        }

        exportHostDataToExcel({
            hostName: host.name,
            buildings: hostBuildings,
            rooms: hostRooms,
            customers: hostCustomers,
            contracts: hostContracts,
            payments: hostPaymentsData,
            equipment: hostEquipmentData,
        });

        const nextHost: AppUser = {
            ...host,
            googleSheetId: `local_${hostId}`,
            googleSheetUrl: '',
        };
        setAllUsers(prev => prev.map(user => user.id === hostId ? nextHost : user));
        if (currentUser?.id === hostId) setCurrentUser(nextHost);
        sbSetUser(nextHost).catch(console.error);

        return {
            success: true,
            url: '',
            error: webhookUrl ? 'CORS blocked. Da tai xuong file Excel thay the.' : undefined,
        };
    };

    const getCustomerImagesFromSheet = async (hostId: string, customerId: string): Promise<CustomerImagesResponse> => {
        const host = allUsers.find(user => user.id === hostId);
        const webhookUrl = getWebhookUrl();
        if (!host?.googleSheetId || !webhookUrl || !isRemoteSheetId(host.googleSheetId)) {
            const customer = customers.find(entry => entry.id === customerId);
            return {
                success: true,
                customerId,
                name: customer?.name || '',
                idFrontImage: customer?.idFrontImage || '',
                idBackImage: customer?.idBackImage || '',
                avatarImage: customer?.avatarImage || '',
            };
        }

        const result = await fetchCustomerImages(webhookUrl, host.googleSheetId, customerId);
        if (result.success) return result;

        const customer = customers.find(entry => entry.id === customerId);
        return {
            success: true,
            customerId,
            name: customer?.name || '',
            idFrontImage: customer?.idFrontImage || '',
            idBackImage: customer?.idBackImage || '',
            avatarImage: customer?.avatarImage || '',
        };
    };

    const exportData = () => JSON.stringify({
        buildings,
        rooms,
        customers,
        contracts,
        payments,
        equipment,
        serviceRecords,
        userProfile,
        adminSettings,
        allUsers,
        pricingTiers,
        hostPayments,
        leads,
        proposals,
        crmNotes,
    }, null, 2);

    const importData = (jsonData: string) => {
        try {
            const parsed = JSON.parse(jsonData);
            const nextContracts = parsed.contracts || contracts;
            if (parsed.buildings) setBuildings(parsed.buildings);
            if (parsed.rooms) setRooms(reconcileRoomsWithContracts(parsed.rooms, nextContracts));
            if (parsed.customers) setCustomers(parsed.customers);
            if (parsed.contracts) setContracts(parsed.contracts);
            if (parsed.payments) setPayments(parsed.payments);
            if (parsed.equipment) setEquipment(parsed.equipment.map(normalizeEquipment));
            if (parsed.serviceRecords) setServiceRecords(parsed.serviceRecords);
            if (parsed.leads) setLeads(parsed.leads);
            if (parsed.proposals) setProposals(parsed.proposals);
            if (parsed.hostPayments) setHostPayments(parsed.hostPayments);
            if (parsed.crmNotes) setCrmNotes(parsed.crmNotes);
            if (parsed.adminSettings) {
                const normalizedAdminSettings = normalizeAdminSettingsState(parsed.adminSettings);
                setAdminSettings(normalizedAdminSettings);
                saveAdminSettings(normalizedAdminSettings).catch(console.error);
            }
            if (parsed.pricingTiers) {
                setPricingTiers(parsed.pricingTiers);
                savePricingTiers(parsed.pricingTiers).catch(console.error);
            }
            if (parsed.allUsers) {
                parsed.allUsers.forEach((user: AppUser) => sbSetUser(user).catch(console.error));
            }
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    };

    const hostFeatureFlags = React.useMemo<FeatureFlags>(() => {
        if (!currentUser || currentUser.role !== 'HOST') return DEFAULT_FEATURE_FLAGS;
        const tier = pricingTiers.find(entry => entry.id === currentUser.subscriptionPlanId);
        const baseFlags = { ...(tier?.featureFlags || DEFAULT_FEATURE_FLAGS) };
        const enabledAddonFlags = (currentUser.activeAddons || [])
            .map(addonId => adminSettings.addons?.find(addon => addon.id === addonId))
            .filter((addon): addon is AddOnFeature => Boolean(addon?.featureFlag));

        enabledAddonFlags.forEach(addon => {
            if (addon.featureFlag) baseFlags[addon.featureFlag] = true;
        });

        return baseFlags;
    }, [adminSettings.addons, currentUser, pricingTiers]);

    const context: AppContextType = {
        currentUser,
        hostFeatureFlags,
        allUsers,
        login,
        logout,
        switchRole,
        addUser,
        updateUser,
        deleteUser,
        buildings,
        rooms,
        customers,
        contracts,
        payments,
        serviceRecords,
        equipment,
        bankInfo,
        pricingTiers,
        leads,
        proposals,
        hostPayments,
        crmNotes,
        notifications,
        unreadNotificationCount,
        theme,
        toggleTheme,
        userProfile,
        adminSettings,
        updateUserProfile,
        updateAdminSettings,
        getCurrentHostPaymentGatewayConfig,
        updateCurrentHostPaymentGatewayConfig,
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
        addBuilding,
        deleteBuilding,
        addRoom,
        addRoomsBulk,
        addCustomersBulk,
        addEquipmentBulk,
        deleteRoom,
        updateRoom,
        updateRoomPosition,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        createContract,
        updateContract,
        terminateContract,
        addServiceRecord,
        markPaymentPaid,
        sendReminder,
        generateRoomBill,
        generateMonthlyPayments,
        sendBulkBills,
        updateBankInfo,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        addLead,
        updateLeadStatus,
        addProposal,
        updateProposalStatus,
        updateHostPaymentStatus,
        addPricingTier,
        updatePricingTier,
        deletePricingTier,
        addCrmNote,
        sendHostPaymentReminder,
        createGoogleSheetForHost,
        getCustomerImagesFromSheet,
        syncNow,
        isSyncing,
        lastSyncTime,
        exportData,
        importData,
        requestNotificationPermission,
    };

    return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};


