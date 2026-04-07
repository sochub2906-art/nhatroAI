import type {
    AdminSettings,
    AppUser,
    Contract,
    PricingTier,
    Room,
} from '../types';
import type { HostSheetData } from '../services/googleSheetService';
import { DEFAULT_SUBSCRIPTION_CHANNELS, normalizeSubscriptionChannels } from '../utils/subscriptionPayments';

export const createEmptyHostSnapshot = (): HostSheetData => ({
    buildings: [],
    rooms: [],
    customers: [],
    contracts: [],
    payments: [],
    equipment: [],
    serviceRecords: [],
});

export const hasHostSnapshotData = (snapshot?: HostSheetData | null) => Boolean(
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

export const reconcileRoomsWithContracts = (rooms: Room[], contracts: Contract[]): Room[] => {
    const occupiedRoomIds = new Set(
        contracts
            .filter(contract => contract.isActive)
            .map(contract => contract.roomId),
    );

    return rooms.map(room => {
        if (room.status === 'Đang sửa') return room;
        const nextStatus: Room['status'] = occupiedRoomIds.has(room.id) ? 'Đang ở' : 'Trống';
        return room.status === nextStatus ? room : { ...room, status: nextStatus };
    });
};

export const DEFAULT_ADMIN_USER: AppUser = {
    id: 'U_SA',
    name: 'Super Admin',
    email: 'antonionguyen246@gmail.com',
    phone: '0900000001',
    role: 'SUPER_ADMIN',
    avatar: 'SA',
    status: 'active',
    createdAt: '2024-01-01',
};

export const DEFAULT_PRICING_TIERS: PricingTier[] = [
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

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
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

export function normalizeAdminSettingsState(settings?: AdminSettings | null): AdminSettings {
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
