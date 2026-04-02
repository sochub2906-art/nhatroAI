export type UserRole = 'SUPER_ADMIN' | 'ADMIN_L2' | 'SALES' | 'ACCOUNTANT' | 'HOST' | 'TENANT';

// ═══════════════════════════════════════
// ROLE PERMISSION SYSTEM
// ═══════════════════════════════════════

export type AdminPermission =
    | 'manage_users'
    | 'manage_hosts'
    | 'manage_plans'
    | 'manage_sales'
    | 'manage_cms'
    | 'manage_settings'
    | 'manage_roles'
    | 'view_dashboard'
    | 'view_revenue'
    | 'manage_payments'
    | 'manage_subscriptions'
    | 'export_data';

export interface PermissionMeta {
    key: AdminPermission;
    label: string;
    desc: string;
    group: 'core' | 'data' | 'finance' | 'system';
}

export const PERMISSIONS_LIST: PermissionMeta[] = [
    { key: 'view_dashboard',       label: 'Xem tổng quan',              desc: 'Truy cập Dashboard tổng quan', group: 'core' },
    { key: 'manage_users',         label: 'Quản lý Users',              desc: 'Thêm, sửa, xóa tài khoản người dùng', group: 'core' },
    { key: 'manage_hosts',         label: 'Quản lý Hosts',              desc: 'Xem và quản lý dữ liệu Host', group: 'core' },
    { key: 'manage_sales',         label: 'Quản lý Sales',              desc: 'Lead, proposal và pipeline bán hàng', group: 'core' },
    { key: 'manage_plans',         label: 'Quản lý gói dịch vụ',       desc: 'Tạo và chỉnh sửa pricing tiers', group: 'finance' },
    { key: 'manage_payments',      label: 'Quản lý thanh toán',         desc: 'Xem và xử lý giao dịch thanh toán', group: 'finance' },
    { key: 'manage_subscriptions', label: 'Quản lý đăng ký gói',       desc: 'Duyệt yêu cầu nâng cấp, addon', group: 'finance' },
    { key: 'view_revenue',         label: 'Xem doanh thu',              desc: 'Truy cập báo cáo doanh thu và thống kê', group: 'finance' },
    { key: 'export_data',          label: 'Xuất dữ liệu',              desc: 'Export báo cáo, backup dữ liệu', group: 'data' },
    { key: 'manage_cms',           label: 'Quản lý CMS',               desc: 'Tạo và chỉnh sửa trang nội dung', group: 'data' },
    { key: 'manage_settings',      label: 'Cài đặt hệ thống',          desc: 'Thay đổi cấu hình toàn cục', group: 'system' },
    { key: 'manage_roles',         label: 'Phân quyền vai trò',         desc: 'Thay đổi quyền hạn của các role', group: 'system' },
];

export const ADMIN_ROLE_META: { role: UserRole; label: string; desc: string; locked?: boolean }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin',    desc: 'Toàn quyền hệ thống — không thể thay đổi', locked: true },
    { role: 'ADMIN_L2',    label: 'Admin cấp 2',    desc: 'Quản trị viên hỗ trợ, quyền hạn bị giới hạn' },
    { role: 'SALES',       label: 'Nhân viên Sales', desc: 'Quản lý lead, host và pipeline bán hàng' },
    { role: 'ACCOUNTANT',  label: 'Kế toán',         desc: 'Theo dõi doanh thu, thanh toán và giao dịch' },
];

export const DEFAULT_ROLE_PERMISSIONS: Record<string, AdminPermission[]> = {
    SUPER_ADMIN: PERMISSIONS_LIST.map(p => p.key),  // Full access
    ADMIN_L2: ['view_dashboard', 'manage_users', 'manage_hosts', 'manage_sales', 'manage_cms', 'view_revenue', 'export_data'],
    SALES: ['view_dashboard', 'manage_sales', 'manage_hosts'],
    ACCOUNTANT: ['view_dashboard', 'view_revenue', 'manage_payments', 'manage_subscriptions', 'export_data'],
};

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
    zaloZnsStatus?: 'unregistered' | 'pending' | 'active' | 'rejected';
    sepayStatus?: 'unregistered' | 'pending' | 'active' | 'rejected';
    sepayWebhookToken?: string;
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
    sepayStatus?: 'unregistered' | 'pending' | 'active' | 'rejected';
    sepayWebhookToken?: string;
}

export interface AdminSettings {
    adminEmail: string;
    salesEmail: string;
    googleSheetWebhookUrl?: string;
    landingBackgroundUrl?: string;
    logoUrl?: string;
    faviconUrl?: string;
    companyInfo?: {
        name?: string;
        description?: string;
        address?: string;
        phone?: string;
        email?: string;
        facebookUrl?: string;
    };
    emailTemplates?: {
        billReminder?: string;
        welcomeTenant?: string;
        contractExpiry?: string;
    };
    salesTeamEmails?: string[];
    zaloZnsConfig?: {
        enabled: boolean;
        pricePerMonth: number;
        description: string;
    };
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
    rolePermissions?: Record<string, AdminPermission[]>;
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
    isCustom?: boolean;
    targetHostId?: string;
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

// ═══════════════════════════════════════
// CMS BLOCK BUILDER TYPES
// ═══════════════════════════════════════

export type CmsBlockType =
    | 'hero'
    | 'text'
    | 'features'
    | 'image-text'
    | 'faq'
    | 'cta'
    | 'stats'
    | 'divider'
    | 'testimonials'
    | 'gallery';

export interface CmsBlockStyle {
    bgColor?: string;
    textColor?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    darkOverlay?: boolean;
}

export interface CmsBlock {
    id: string;
    type: CmsBlockType;
    data: Record<string, any>;
    style?: CmsBlockStyle;
}

export const CMS_BLOCK_META: { type: CmsBlockType; label: string; icon: string; desc: string }[] = [
    { type: 'hero', label: 'Hero Banner', icon: 'layout', desc: 'Banner lớn với tiêu đề, mô tả và nút CTA' },
    { type: 'text', label: 'Văn bản', icon: 'type', desc: 'Nội dung văn bản tự do (rich text)' },
    { type: 'features', label: 'Tính năng', icon: 'grid-3x3', desc: 'Lưới các thẻ tính năng với icon' },
    { type: 'image-text', label: 'Ảnh + Văn bản', icon: 'panel-left', desc: 'Hình ảnh kèm nội dung mô tả' },
    { type: 'faq', label: 'FAQ', icon: 'help-circle', desc: 'Câu hỏi thường gặp dạng accordion' },
    { type: 'cta', label: 'Call to Action', icon: 'megaphone', desc: 'Banner kêu gọi hành động' },
    { type: 'stats', label: 'Thống kê', icon: 'bar-chart-3', desc: 'Dãy số liệu ấn tượng' },
    { type: 'divider', label: 'Phân cách', icon: 'minus', desc: 'Đường kẻ hoặc khoảng trống' },
    { type: 'testimonials', label: 'Đánh giá', icon: 'quote', desc: 'Lời nhận xét từ khách hàng' },
    { type: 'gallery', label: 'Thư viện ảnh', icon: 'images', desc: 'Lưới hình ảnh đẹp mắt' },
];

export interface CmsPage {
    id: string;
    slug: string;
    title: string;
    contentHtml: string;
    contentBlocks?: CmsBlock[];
    metaDescription?: string;
    isPublished: boolean;
    category?: 'legal' | 'support' | 'company';
    sortOrder?: number;
    updatedAt: string;
    createdAt: string;
}

