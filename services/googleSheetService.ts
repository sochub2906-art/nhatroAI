/**
 * ═══════════════════════════════════════════════════
 * Google Sheets Integration Service (v2 — Sheets-First)
 * ═══════════════════════════════════════════════════
 * Handles all CRUD operations via Google Sheets API (masterscript.gs)
 * Firestore is NO LONGER used for business data.
 */

import type {
    Building, Room, Customer, Contract, Payment,
    ServiceRecord, Equipment, HostPayment, PricingTier,
    AppNotification, HostPaymentGatewayConfig, HostSubscriptionSnapshot
} from '../types';

// ═══════════════════════════════════════
// TYPES
// ═══════════════════════════════════════
export interface CreateSheetPayload {
    hostId: string;
    hostName: string;
    hostEmail: string;
    hostPhone: string;
    buildings: Building[];
    rooms: Room[];
    customers: Customer[];
    contracts: Contract[];
    payments: Payment[];
    equipment: Equipment[];
    serviceRecords: ServiceRecord[];
    hostPayments: HostPayment[];
    pricingTier: PricingTier | null;
    subscriptionSnapshot?: HostSubscriptionSnapshot | null;
}

export interface SheetResponse {
    success: boolean;
    spreadsheetId?: string;
    spreadsheetUrl?: string;
    message?: string;
    error?: string;
}

export interface CustomerImagesResponse {
    success: boolean;
    customerId?: string;
    name?: string;
    idFrontImage?: string;
    idBackImage?: string;
    avatarImage?: string;
    error?: string;
}

/** All host business data fetched from Google Sheets */
export interface HostSheetData {
    buildings: Building[];
    rooms: Room[];
    customers: Customer[];
    contracts: Contract[];
    payments: Payment[];
    equipment: Equipment[];
    serviceRecords: ServiceRecord[];
    subscriptionSnapshot?: HostSubscriptionSnapshot | null;
}

export type SheetTabName = 'buildings' | 'rooms' | 'customers' | 'contracts' | 'payments' | 'equipment' | 'serviceRecords';

export interface PaymentGatewayRegistrationPayload {
    hostId: string;
    sheetId: string;
    config: HostPaymentGatewayConfig;
}

export interface PaymentGatewayRegistrationResponse {
    success: boolean;
    error?: string;
    message?: string;
}

export interface PaymentNotificationResponse {
    success: boolean;
    notifications?: AppNotification[];
    gatewayConfig?: Partial<HostPaymentGatewayConfig>;
    error?: string;
}

// ═══════════════════════════════════════
// CORE: Fetch wrapper (handles GAS redirect)
// ═══════════════════════════════════════
async function gasPost(webhookUrl: string, payload: Record<string, any>): Promise<any> {
    const response = await fetchWithRetry(webhookUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        redirect: 'follow',
        mode: 'cors'
    });
    return parseJsonResponse(response, { success: true, message: 'Request sent (response not parseable)' });
}

async function gasGet(webhookUrl: string, params: Record<string, string>): Promise<any> {
    const url = new URL(webhookUrl);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const response = await fetchWithRetry(url.toString(), { redirect: 'follow' });
    return parseJsonResponse(response, { success: false, error: 'Response not parseable' });
}

async function fetchWithRetry(url: string, init: RequestInit, retries = 2): Promise<Response> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 12000);

        try {
            const response = await fetch(url, { ...init, signal: controller.signal });
            clearTimeout(timeout);

            if (!response.ok && attempt < retries) {
                await wait(500 * (attempt + 1));
                continue;
            }

            return response;
        } catch (error) {
            clearTimeout(timeout);
            lastError = error;
            if (attempt < retries) {
                await wait(500 * (attempt + 1));
                continue;
            }
        }
    }

    throw lastError instanceof Error ? lastError : new Error('Google Sheets request failed');
}

async function parseJsonResponse(response: Response, fallback: Record<string, any>) {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        return fallback;
    }
}

function wait(ms: number) {
    return new Promise(resolve => window.setTimeout(resolve, ms));
}

// ═══════════════════════════════════════
// 1. FETCH ALL DATA (Login → Hydrate)
// ═══════════════════════════════════════
/**
 * Fetch all Host data from their Google Sheet.
 * Called once on login, result goes into React state + localStorage.
 */
export async function fetchAllHostData(
    webhookUrl: string,
    sheetId: string
): Promise<{ success: boolean; data?: HostSheetData; error?: string }> {
    try {
        const result = await gasGet(webhookUrl, { action: 'getAllData', sheetId });
        if (!result.success) return { success: false, error: result.error };

        // Parse raw sheet data → typed objects
        const raw = result.data || {};
        return {
            success: true,
            data: {
                buildings: (raw.buildings || []).map(parseBuilding),
                rooms: (raw.rooms || []).map(parseRoom),
                customers: (raw.customers || []).map(parseCustomer),
                contracts: (raw.contracts || []).map(parseContract),
                payments: (raw.payments || []).map(parsePayment),
                equipment: (raw.equipment || []).map(parseEquipment),
                serviceRecords: (raw.serviceRecords || []).map(parseServiceRecord),
            }
        };
    } catch (err) {
        console.error('fetchAllHostData failed:', err);
        return { success: false, error: String(err) };
    }
}

// ═══════════════════════════════════════
// 2. UPSERT ROW (Instant Sync on CRUD)
// ═══════════════════════════════════════
/**
 * Add or update a single record in the Host's Google Sheet.
 * Called after every create/update operation in the app.
 */
export async function upsertSheetRow(
    webhookUrl: string,
    sheetId: string,
    tab: SheetTabName,
    record: { id: string;[key: string]: any }
): Promise<{ success: boolean; error?: string }> {
    try {
        return await gasPost(webhookUrl, { action: 'upsertRow', sheetId, tab, record });
    } catch (err) {
        console.error(`upsertSheetRow [${tab}] failed:`, err);
        return { success: false, error: String(err) };
    }
}

// ═══════════════════════════════════════
// 3. DELETE ROW
// ═══════════════════════════════════════
export async function deleteSheetRow(
    webhookUrl: string,
    sheetId: string,
    tab: SheetTabName,
    recordId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        return await gasPost(webhookUrl, { action: 'deleteRow', sheetId, tab, recordId });
    } catch (err) {
        console.error(`deleteSheetRow [${tab}] failed:`, err);
        return { success: false, error: String(err) };
    }
}

// ═══════════════════════════════════════
// 4. BATCH SYNC (Periodic 10m / Full Sync)
// ═══════════════════════════════════════
/**
 * Push all current state to the Sheet (overwrites all tabs).
 * Used for periodic sync and "Sync Now" button.
 */
export async function batchSyncToSheet(
    webhookUrl: string,
    sheetId: string,
    data: Partial<HostSheetData>
): Promise<{ success: boolean; stats?: Record<string, string>; error?: string }> {
    try {
        return await gasPost(webhookUrl, { action: 'batchSync', sheetId, ...data });
    } catch (err) {
        console.error('batchSyncToSheet failed:', err);
        return { success: false, error: String(err) };
    }
}

// ═══════════════════════════════════════
// 5. UPLOAD IMAGE (to Google Drive)
// ═══════════════════════════════════════
export async function uploadImageToDrive(
    webhookUrl: string,
    options: {
        base64: string;
        filename: string;
        mimeType?: string;
        hostId?: string;
        sheetId?: string;
        customerId?: string;
        imageField?: 'idFrontImage' | 'idBackImage' | 'avatarImage';
    }
): Promise<{ success: boolean; url?: string; fileId?: string; error?: string }> {
    try {
        return await gasPost(webhookUrl, { action: 'uploadImage', ...options });
    } catch (err) {
        console.error('uploadImageToDrive failed:', err);
        return { success: false, error: String(err) };
    }
}

// ═══════════════════════════════════════
// 6. CREATE SHEET (first-time setup for a Host)
// ═══════════════════════════════════════
export async function createHostGoogleSheet(
    webhookUrl: string,
    payload: CreateSheetPayload
): Promise<SheetResponse> {
    try {
        const result = await gasPost(webhookUrl, { action: 'createSheet', ...payload });
        if (result.success && result.spreadsheetId) {
            return result;
        }
        throw new Error(result.error || 'Failed without valid response (CORS/Opaque)');
    } catch (err) {
        console.warn('createHostGoogleSheet failed or blocked by CORS. Attempting fallback lookup in 4s...', err);
        
        // Wait 4 seconds to give GAS time to finish creating the sheet natively
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        try {
            const findResult = await gasGet(webhookUrl, { action: 'findSheet', hostId: payload.hostId });
            if (findResult.success && findResult.spreadsheetId) {
                console.log('✅ Fallback successful! Sheet found:', findResult.spreadsheetId);
                return {
                    success: true,
                    spreadsheetId: findResult.spreadsheetId,
                    spreadsheetUrl: findResult.spreadsheetUrl,
                    message: 'Recovered via fallback'
                };
            }
        } catch (fallbackErr) {
            console.error('Fallback lookup also failed:', fallbackErr);
        }

        console.error('createHostGoogleSheet failed completely:', err);
        return { success: false, error: String(err) };
    }
}

// ═══════════════════════════════════════
// 7. GET CUSTOMER IMAGES
// ═══════════════════════════════════════
export async function fetchCustomerImages(
    webhookUrl: string,
    sheetId: string,
    customerId: string
): Promise<CustomerImagesResponse> {
    try {
        return await gasGet(webhookUrl, { action: 'getCustomerImages', sheetId, customerId });
    } catch (err) {
        console.error('fetchCustomerImages failed:', err);
        return { success: false, error: String(err) };
    }
}

export async function registerHostPaymentGateway(
    webhookUrl: string,
    payload: PaymentGatewayRegistrationPayload,
): Promise<PaymentGatewayRegistrationResponse> {
    try {
        return await gasPost(webhookUrl, { action: 'registerPaymentGateway', ...payload });
    } catch (err) {
        console.error('registerHostPaymentGateway failed:', err);
        return { success: false, error: String(err) };
    }
}

export async function fetchHostPaymentNotifications(
    webhookUrl: string,
    hostId: string,
    webhookToken?: string,
): Promise<PaymentNotificationResponse> {
    try {
        return await gasGet(webhookUrl, { action: 'getPaymentNotifications', hostId, token: webhookToken || '' });
    } catch (err) {
        console.error('fetchHostPaymentNotifications failed:', err);
        return { success: false, error: String(err) };
    }
}

function parseJsonField<T>(value: unknown, fallback: T): T {
    if (!value || typeof value !== 'string') return fallback;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}

function toLegacyHeader(key: string): string {
    try {
        return unescape(encodeURIComponent(key));
    } catch {
        return key;
    }
}

function pickRaw(raw: Record<string, any>, ...keys: string[]) {
    for (const key of keys) {
        if (raw[key] !== undefined && raw[key] !== null && raw[key] !== '') return raw[key];
        const legacyKey = toLegacyHeader(key);
        if (legacyKey !== key && raw[legacyKey] !== undefined && raw[legacyKey] !== null && raw[legacyKey] !== '') {
            return raw[legacyKey];
        }
    }
    return undefined;
}

// ═══════════════════════════════════════
// PARSERS: Sheet row → Typed object
// ═══════════════════════════════════════
function parseBuilding(raw: any): Building {
    return {
        id: String(pickRaw(raw, 'ID', 'id') || ''),
        name: String(pickRaw(raw, 'TÊN', 'name') || ''),
        address: String(pickRaw(raw, 'ĐỊA CHỈ', 'address') || ''),
        type: (pickRaw(raw, 'LOẠI HÌNH', 'type') || 'Nhà trọ') as any,
        totalFloors: Number(pickRaw(raw, 'SỐ TẦNG', 'totalFloors') || 1),
        rentalCost: Number(pickRaw(raw, 'CHI PHÍ THUÊ', 'rentalCost') || 0),
        leaseStartDate: String(pickRaw(raw, 'NGÀY BĐ THUÊ', 'leaseStartDate') || ''),
        leaseEndDate: String(pickRaw(raw, 'NGÀY KT THUÊ', 'leaseEndDate') || ''),
        hostId: String(pickRaw(raw, 'HOST_ID', 'hostId') || ''),
        createdAt: String(pickRaw(raw, 'CREATED_AT', 'createdAt') || ''),
    };
}

function parseRoom(raw: any): Room {
    return {
        id: String(pickRaw(raw, 'ID', 'id') || ''),
        name: String(pickRaw(raw, 'TÊN', 'name') || ''),
        price: Number(pickRaw(raw, 'GIÁ THUÊ', 'price') || 0),
        floor: Number(pickRaw(raw, 'TẦNG', 'floor') || 1),
        status: (pickRaw(raw, 'TRẠNG THÁI', 'status') || 'Trống') as any,
        buildingId: String(pickRaw(raw, 'MÃ TÒA NHÀ', 'MÃ TOÀ NHÀ', 'buildingId') || ''),
        position: {
            x: Number(pickRaw(raw, 'POS_X', 'x') || 0),
            y: Number(pickRaw(raw, 'POS_Y', 'y') || 0)
        },
        hostId: String(pickRaw(raw, 'HOST_ID', 'hostId') || ''),
        createdAt: String(pickRaw(raw, 'CREATED_AT', 'createdAt') || ''),
    };
}

function parseCustomer(raw: any): Customer {
    return {
        id: String(pickRaw(raw, 'ID', 'id') || ''),
        name: String(pickRaw(raw, 'HỌ TÊN', 'name') || ''),
        phone: String(pickRaw(raw, 'SỐ ĐT', 'phone') || ''),
        email: String(pickRaw(raw, 'EMAIL', 'email') || ''),
        zalo: String(pickRaw(raw, 'ZALO', 'zalo') || ''),
        idNumber: String(pickRaw(raw, 'SỐ CCCD', 'idNumber') || ''),
        idIssueDate: String(pickRaw(raw, 'NGÀY CẤP', 'idIssueDate') || ''),
        idIssuePlace: String(pickRaw(raw, 'NƠI CẤP', 'idIssuePlace') || ''),
        idFrontImage: String(pickRaw(raw, 'ẢNH MẶT TRƯỚC', 'idFrontImage') || ''),
        idBackImage: String(pickRaw(raw, 'ẢNH MẶT SAU', 'idBackImage') || ''),
        avatarImage: String(pickRaw(raw, 'ẢNH CÁ NHÂN', 'avatarImage') || ''),
        dateOfBirth: String(pickRaw(raw, 'NGÀY SINH', 'dateOfBirth') || ''),
        gender: (pickRaw(raw, 'GIỚI TÍNH', 'gender') || '') as any,
        nationality: String(pickRaw(raw, 'QUỐC TỊCH', 'nationality') || ''),
        placeOfOrigin: String(pickRaw(raw, 'NGUYÊN QUÁN', 'placeOfOrigin') || ''),
        permanentAddress: String(pickRaw(raw, 'ĐỊA CHỈ THƯỜNG TRÚ', 'permanentAddress') || ''),
        currentAddress: String(pickRaw(raw, 'ĐỊA CHỈ TẠM TRÚ', 'currentAddress') || ''),
        residenceAddress: String(pickRaw(raw, 'ĐỊA CHỈ CƯ TRÚ', 'RESIDENCE_ADDRESS', 'residenceAddress', 'currentAddress') || ''),
        occupation: String(pickRaw(raw, 'NGHỀ NGHIỆP', 'occupation') || ''),
        qrCodeData: String(pickRaw(raw, 'QR_CODE_DATA', 'qrCodeData') || ''),
        declarationCreated:
            String(pickRaw(raw, 'ĐÃ TẠO TỜ KHAI CƯ TRÚ', 'DECLARATION_CREATED', 'declarationCreated') || '').toLowerCase() === 'true'
            || String(pickRaw(raw, 'ĐÃ TẠO TỜ KHAI CƯ TRÚ', 'DECLARATION_CREATED') || '') === 'Có',
        declarationCreatedAt: String(pickRaw(raw, 'NGÀY TẠO TỜ KHAI CƯ TRÚ', 'DECLARATION_CREATED_AT', 'declarationCreatedAt') || ''),
        declarationStatus: (pickRaw(raw, 'TRẠNG THÁI TỜ KHAI CƯ TRÚ', 'DECLARATION_STATUS', 'declarationStatus') || '') as any,
        notes: String(pickRaw(raw, 'GHI CHÚ', 'notes') || ''),
        hostId: String(pickRaw(raw, 'HOST_ID', 'hostId') || ''),
        createdAt: String(pickRaw(raw, 'CREATED_AT', 'createdAt') || ''),
    };
}

function parseContract(raw: any): Contract {
    let extraServices: any[] = [];
    try {
        const svcField = pickRaw(raw, 'DỊCH VỤ THÊM', 'extraServices') || '';
        if (typeof svcField === 'string' && svcField.startsWith('[')) {
            extraServices = JSON.parse(svcField);
        }
    } catch { /* ignore */ }

    return {
        id: String(pickRaw(raw, 'ID', 'id') || ''),
        roomId: String(pickRaw(raw, 'MÃ PHÒNG', 'roomId') || ''),
        customerId: String(pickRaw(raw, 'MÃ KH', 'customerId') || ''),
        startDate: String(pickRaw(raw, 'NGÀY BĐ', 'startDate') || ''),
        durationMonths: Number(pickRaw(raw, 'THỜI HẠN', 'durationMonths') || 12),
        price: Number(pickRaw(raw, 'GIÁ THUÊ', 'price') || 0),
        electricPrice: Number(pickRaw(raw, 'GIÁ ĐIỆN', 'electricPrice') || 0),
        waterPrice: Number(pickRaw(raw, 'GIÁ NƯỚC', 'waterPrice') || 0),
        internetPrice: Number(pickRaw(raw, 'GIÁ INTERNET', 'internetPrice') || 0),
        extraServices,
        isActive: (pickRaw(raw, 'CÒN HIỆU LỰC', 'isActive') === 'Có') || pickRaw(raw, 'CÒN HIỆU LỰC', 'isActive') === true,
        endDate: String(pickRaw(raw, 'NGÀY KẾT THÚC', 'endDate') || ''),
        hostId: String(pickRaw(raw, 'HOST_ID', 'hostId') || ''),
        createdAt: String(pickRaw(raw, 'CREATED_AT', 'createdAt') || ''),
    };
}

function parsePayment(raw: any): Payment {
    return {
        id: String(pickRaw(raw, 'ID', 'id') || ''),
        contractId: String(pickRaw(raw, 'MÃ HĐ', 'contractId') || ''),
        billId: String(pickRaw(raw, 'MÃ BILL', 'BILL_ID', 'billId') || ''),
        amount: Number(pickRaw(raw, 'SỐ TIỀN', 'amount') || 0),
        paidAmount: Number(pickRaw(raw, 'ĐÃ THU', 'PAID_AMOUNT', 'paidAmount') || 0),
        remainingAmount: Number(pickRaw(raw, 'CÒN LẠI', 'REMAINING_AMOUNT', 'remainingAmount') || 0),
        lastCollectedAmount: Number(pickRaw(raw, 'THU LẦN CUỐI', 'LAST_COLLECTION_AMOUNT', 'lastCollectedAmount') || 0),
        type: String(pickRaw(raw, 'LOẠI', 'type') || ''),
        period: String(pickRaw(raw, 'KỲ', 'period') || ''),
        dueDate: String(pickRaw(raw, 'HẠN ĐÓNG', 'dueDate') || ''),
        status: (pickRaw(raw, 'TRẠNG THÁI', 'status') || 'Chờ thanh toán') as any,
        paidDate: String(pickRaw(raw, 'NGÀY ĐÓNG', 'paidDate') || ''),
        description: String(pickRaw(raw, 'MÔ TẢ', 'description') || ''),
        category: (pickRaw(raw, 'NHÓM', 'category') || '') as any,
        direction: (pickRaw(raw, 'LUỒNG TIỀN', 'direction') || 'income') as any,
        sourceDate: String(pickRaw(raw, 'NGÀY HẠCH TOÁN', 'sourceDate') || ''),
        billStatus: (pickRaw(raw, 'TRẠNG THÁI BILL', 'BILL_STATUS', 'billStatus') || '') as any,
        paymentMethod: String(pickRaw(raw, 'PHƯƠNG THỨC THANH TOÁN', 'PAYMENT_METHOD', 'paymentMethod') || ''),
        gatewayTransactionId: String(pickRaw(raw, 'MÃ GIAO DỊCH CỔNG', 'GATEWAY_TRANSACTION_ID', 'gatewayTransactionId') || ''),
    };
}

function parseEquipment(raw: any): Equipment {
    return {
        id: String(pickRaw(raw, 'ID', 'id') || ''),
        name: String(pickRaw(raw, 'TÊN', 'name') || ''),
        status: (pickRaw(raw, 'TRẠNG THÁI', 'status') || 'Tốt') as any,
        buildingId: String(pickRaw(raw, 'MÃ TÒA NHÀ', 'MÃ TOÀ NHÀ', 'buildingId') || ''),
        roomId: String(pickRaw(raw, 'MÃ PHÒNG', 'roomId') || ''),
        purchaseDate: String(pickRaw(raw, 'NGÀY MUA', 'purchaseDate') || ''),
        price: Number(pickRaw(raw, 'GIÁ TIỀN', 'price') || 0),
        notes: String(pickRaw(raw, 'GHI CHÚ', 'notes') || ''),
        depreciationMonths: Number(pickRaw(raw, 'THỜI GIAN KHẤU HAO', 'depreciationMonths') || 0),
        salvageValue: Number(pickRaw(raw, 'GIÁ TRỊ THU HỒI', 'salvageValue') || 0),
        currentValue: Number(pickRaw(raw, 'GIÁ TRỊ HIỆN TẠI', 'currentValue') || 0),
        lastValuationDate: String(pickRaw(raw, 'NGÀY ĐỊNH GIÁ', 'lastValuationDate') || ''),
        maintenanceHistory: parseJsonField(pickRaw(raw, 'LỊCH SỬ BẢO TRÌ', 'maintenanceHistory'), []),
        hostId: String(pickRaw(raw, 'HOST_ID', 'hostId') || ''),
        createdAt: String(pickRaw(raw, 'CREATED_AT', 'createdAt') || ''),
    };
}

function parseServiceRecord(raw: any): ServiceRecord {
    return {
        id: String(pickRaw(raw, 'ID', 'id') || ''),
        roomId: String(pickRaw(raw, 'MÃ PHÒNG', 'ROOM_ID', 'roomId', 'M?? PH??NG') || ''),
        month: String(pickRaw(raw, 'THÁNG', 'PERIOD', 'month', 'TH??NG') || ''),
        electricOldReading: Number(pickRaw(raw, 'ĐIỆN_CŨ', 'ELECTRIC_OLD', 'electricOldReading', '?I?N_C?') || 0),
        electricNewReading: Number(pickRaw(raw, 'ĐIỆN_MỚI', 'ELECTRIC_NEW', 'electricNewReading', '?I?N_M?I') || 0),
        electricUsage: Number(pickRaw(raw, 'ĐIỆN', 'ELECTRIC_USAGE', 'electricUsage', '??I=N') || 0),
        waterOldReading: Number(pickRaw(raw, 'NƯỚC_CŨ', 'WATER_OLD', 'waterOldReading', 'N??C_C?') || 0),
        waterNewReading: Number(pickRaw(raw, 'NƯỚC_MỚI', 'WATER_NEW', 'waterNewReading', 'N??C_M?I') || 0),
        waterUsage: Number(pickRaw(raw, 'NƯỚC', 'WATER_USAGE', 'waterUsage', 'N=??C') || 0),
        internetCost: Number(pickRaw(raw, 'INTERNET', 'internetCost') || 0),
        otherCost: Number(pickRaw(raw, 'KHÁC', 'otherCost', 'KH??C') || 0),
        totalCost: Number(pickRaw(raw, 'TỔNG', 'totalCost', 'T=NG') || 0),
        electricRecordedAt: String(pickRaw(raw, 'ELECTRIC_RECORDED_AT', 'electricRecordedAt') || ''),
        waterRecordedAt: String(pickRaw(raw, 'WATER_RECORDED_AT', 'waterRecordedAt') || ''),
        note: String(pickRaw(raw, 'NOTE', 'note') || ''),
        recordedAt: String(pickRaw(raw, 'RECORDED_AT', 'recordedAt') || ''),
    };
}

