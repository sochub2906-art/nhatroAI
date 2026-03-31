export type UserRole = 'SUPER_ADMIN' | 'SALES' | 'HOST' | 'TENANT';

export interface AppUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    avatar?: string;
    status?: 'active' | 'pending' | 'suspended';
    subscriptionPlanId?: string;
    subscriptionStartDate?: string;
    subscriptionEndDate?: string;
    activeAddons?: string[];
    managedBuildingIds?: string[];
    googleSheetId?: string;
    googleSheetUrl?: string;
    linkedRoomId?: string;
    linkedContractId?: string;
    assignedHostIds?: string[];
    createdAt?: string;
}

export interface RegistrationLead {
    id: string;
    customerName: string;
    phone: string;
    needs: string;
    createdAt: string;
    assignedSalesId?: string;
    status: 'new' | 'contacted' | 'converted' | 'lost';
}

export interface HostProposal {
    id: string;
    salesUserId: string;
    hostName: string;
    address: string;
    buildingCount: number;
    roomCount: number;
    notes: string;
    subscriptionPlanId?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export interface CrmNote {
    id: string;
    hostId: string;
    authorId: string;
    content: string;
    createdAt: string;
}

export type BuildingType = 'Owned' | 'Rented';

export interface Building {
    id: string;
    name: string;
    address: string;
    type: BuildingType;
    totalFloors: number;
    hostId?: string;
    rentalCost?: number;
    leaseStartDate?: string;
    leaseDurationMonths?: number;
    leaseEndDate?: string;
    warningDays?: number;
    createdAt?: string;
}

export type RoomStatus = '\u0110ang \u1edf' | 'Tr\u1ed1ng' | '\u0110ang s\u1eeda';

export interface Room {
    id: string;
    name: string;
    price: number;
    floor: number;
    status: RoomStatus;
    buildingId: string;
    position?: { x: number; y: number };
    hostId?: string;
    createdAt?: string;
}

export type CustomerGender = 'Nam' | 'N\u1eef' | 'Kh\u00e1c';

export interface Customer {
    id: string;
    name: string;
    phone: string;
    email: string;
    zalo: string;
    idNumber?: string;
    idIssueDate?: string;
    idIssuePlace?: string;
    idFrontImage?: string;
    idBackImage?: string;
    avatarImage?: string;
    dateOfBirth?: string;
    gender?: CustomerGender;
    nationality?: string;
    placeOfOrigin?: string;
    permanentAddress?: string;
    currentAddress?: string;
    residenceAddress?: string;
    occupation?: string;
    qrCodeData?: string;
    declarationCreated?: boolean;
    declarationCreatedAt?: string;
    declarationStatus?: 'not_created' | 'created' | 'submitted';
    notes?: string;
    hostId?: string;
    createdAt?: string;
}

export interface ContractService {
    id: string;
    name: string;
    unitPrice: number;
    unit?: string;
    enabled: boolean;
}

export interface Contract {
    id: string;
    roomId: string;
    customerId: string;
    startDate: string;
    durationMonths: number;
    price: number;
    electricPrice: number;
    waterPrice: number;
    internetPrice: number;
    extraServices?: ContractService[];
    isActive: boolean;
    endDate: string;
    hostId?: string;
    createdAt?: string;
}

export type PaymentStatus = 'Ch\u1edd thanh to\u00e1n' | 'Thanh to\u00e1n m\u1ed9t ph\u1ea7n' | '\u0110\u00e3 \u0111\u00f3ng' | 'Qu\u00e1 h\u1ea1n';
export type PaymentCategory = 'room' | 'electric' | 'water' | 'internet' | 'service' | 'deposit' | 'other' | 'maintenance' | 'expense';
export type CashDirection = 'income' | 'expense';
export type BillLifecycleStatus = 'draft' | 'issued' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export interface Payment {
    id: string;
    contractId: string;
    billId?: string;
    amount: number;
    paidAmount?: number;
    remainingAmount?: number;
    lastCollectedAmount?: number;
    type: string;
    period: string;
    dueDate: string;
    status: PaymentStatus;
    paidDate?: string;
    description?: string;
    category?: PaymentCategory;
    direction?: CashDirection;
    sourceDate?: string;
    billStatus?: BillLifecycleStatus;
    paymentMethod?: string;
    gatewayTransactionId?: string;
}

export interface HostPayment {
    id: string;
    hostId: string;
    amount: number;
    period: string;
    dueDate: string;
    status: PaymentStatus;
    paidDate?: string;
}

export interface ServiceRecord {
    id: string;
    roomId: string;
    month: string;
    electricOldReading?: number;
    electricNewReading?: number;
    electricUsage: number;
    waterOldReading?: number;
    waterNewReading?: number;
    waterUsage: number;
    internetCost: number;
    otherCost: number;
    totalCost: number;
    electricRecordedAt?: string;
    waterRecordedAt?: string;
    note?: string;
    recordedAt?: string;
}

export type EquipmentStatus = 'T\u1ed1t' | 'H\u1ecfng' | '\u0110ang s\u1eeda' | 'Thanh l\u00fd';
export type EquipmentMaintenanceType = 'repair' | 'maintenance' | 'revaluation';

export interface EquipmentMaintenanceRecord {
    id: string;
    date: string;
    type: EquipmentMaintenanceType;
    cost: number;
    note?: string;
    valueAfter?: number;
}

export interface Equipment {
    id: string;
    name: string;
    status: EquipmentStatus;
    buildingId: string;
    roomId?: string;
    purchaseDate: string;
    price: number;
    notes?: string;
    hostId?: string;
    createdAt?: string;
    depreciationMonths?: number;
    salvageValue?: number;
    currentValue?: number;
    lastValuationDate?: string;
    maintenanceHistory?: EquipmentMaintenanceRecord[];
}

export interface BankInfo {
    bankName: string;
    accountNumber: string;
    accountName: string;
}

export type PaymentGatewayProvider = 'manual' | 'sepay' | 'custom';
export type PaymentGatewayMatchMode = 'bill_id' | 'payment_id' | 'transfer_content';

export interface HostPaymentGatewayConfig extends BankInfo {
    hostId: string;
    provider: PaymentGatewayProvider;
    providerLabel?: string;
    enabled: boolean;
    webhookToken?: string;
    generatedWebhookUrl?: string;
    autoMarkPaid: boolean;
    matchMode: PaymentGatewayMatchMode;
    note?: string;
    lastWebhookAt?: string;
    lastWebhookStatus?: string;
    lastWebhookMessage?: string;
    updatedAt?: string;
}

export type AppNotificationType =
    | 'payment_paid'
    | 'payment_reminder'
    | 'monthly_bills_generated'
    | 'bulk_bills_sent'
    | 'gateway_payment_received'
    | 'gateway_config_updated'
    | 'contract_expiring'
    | 'room_bill_pending'
    | 'contract_terminated'
    | 'system';

export type AppNotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
    id: string;
    hostId: string;
    type: AppNotificationType;
    severity: AppNotificationSeverity;
    title: string;
    message: string;
    createdAt: string;
    readAt?: string;
    actionPath?: string;
    paymentIds?: string[];
    billId?: string;
    amount?: number;
    metadata?: Record<string, string | number | boolean | null | undefined>;
}

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    idNumber?: string;
    idIssueDate?: string;
    idIssuePlace?: string;
    idFrontImage?: string;
    idBackImage?: string;
    avatarImage?: string;
}

export interface AdminSettings {
    adminEmail: string;
    salesEmail: string;
    googleSheetWebhookUrl?: string;
    landingBackgroundUrl?: string;
    emailTemplates?: {
        billReminder?: string;
        welcomeTenant?: string;
        contractExpiry?: string;
    };
    salesTeamEmails?: string[];
    paymentConfig?: {
        bankName: string;
        accountNumber: string;
        accountName: string;
        webhookUrl?: string;
        gracePeriodDays: number;
        hostGatewayConfigs?: Record<string, HostPaymentGatewayConfig>;
        subscriptionChannels?: PaymentChannelConfig[];
    };
    addons?: AddOnFeature[];
    subscriptionRequests?: SubscriptionRequest[];
}

export interface FeatureFlags {
    dashboard: boolean;
    buildings: boolean;
    roomMap: boolean;
    rooms: boolean;
    customers: boolean;
    contracts: boolean;
    payments: boolean;
    equipment: boolean;
    autoNotify: boolean;
    cccdReader: boolean;
    imageUpload: boolean;
}

export const ALL_FEATURE_KEYS: { key: keyof FeatureFlags; label: string }[] = [
    { key: 'dashboard', label: 'Tổng quan' },
    { key: 'buildings', label: 'Quản lý tòa nhà' },
    { key: 'roomMap', label: 'Sơ đồ nhà' },
    { key: 'rooms', label: 'Quản lý phòng trọ' },
    { key: 'customers', label: 'Quản lý khách thuê' },
    { key: 'contracts', label: 'Hợp đồng' },
    { key: 'payments', label: 'Thu chi & Công nợ' },
    { key: 'equipment', label: 'Trang thiết bị' },
    { key: 'autoNotify', label: 'Gửi thông báo tự động (Email/Zalo)' },
    { key: 'cccdReader', label: 'Đọc CCCD từ Google Sheets' },
    { key: 'imageUpload', label: 'Upload ảnh khách thuê' },
];

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
    dashboard: true,
    buildings: true,
    roomMap: true,
    rooms: true,
    customers: true,
    contracts: true,
    payments: true,
    equipment: false,
    autoNotify: false,
    cccdReader: false,
    imageUpload: false,
};

export interface PricingTier {
    id: string;
    name: string;
    price: number;
    maxBuildings: number;
    maxRooms: number;
    features: string[];
    featureFlags?: FeatureFlags;
}

export interface AddOnFeature {
    id: string;
    name: string;
    description: string;
    price: number;
    featureFlag?: keyof FeatureFlags;
    features?: string[];
}

export interface PaymentChannelConfig {
    id: string;
    name: string;
    provider: 'manual' | 'sepay' | 'custom';
    enabled: boolean;
    checkoutUrlTemplate?: string;
    qrImageTemplate?: string;
    webhookUrl?: string;
    note?: string;
}

export type SubscriptionRequestType = 'plan_change' | 'addon_purchase' | 'addon_cancel' | 'bundle_update';
export type SubscriptionRequestStatus = 'draft' | 'pending_payment' | 'pending_review' | 'approved' | 'rejected' | 'cancelled';

export interface SubscriptionRequest {
    id: string;
    hostId: string;
    hostName: string;
    hostEmail: string;
    currentPlanId?: string;
    requestedPlanId?: string;
    requestedAddonIds?: string[];
    removedAddonIds?: string[];
    type: SubscriptionRequestType;
    status: SubscriptionRequestStatus;
    amount: number;
    paymentCode: string;
    paymentChannelId?: string;
    paymentChannelProvider?: PaymentChannelConfig['provider'];
    paymentLink?: string;
    qrImageUrl?: string;
    qrPayload?: string;
    note?: string;
    requestedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    adminNote?: string;
}

export interface HostSubscriptionSnapshot {
    hostId: string;
    planId?: string;
    planName?: string;
    planPrice?: number;
    maxBuildings?: number;
    maxRooms?: number;
    features: string[];
    activeAddons: Array<{
        id: string;
        name: string;
        price: number;
        description: string;
    }>;
    paymentGateway?: Pick<
        HostPaymentGatewayConfig,
        'provider' | 'providerLabel' | 'enabled' | 'autoMarkPaid' | 'lastWebhookAt' | 'lastWebhookStatus' | 'lastWebhookMessage'
    >;
    pendingRequests: SubscriptionRequest[];
}
