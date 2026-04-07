import type {
    AdminSettings,
    AppUser,
    Building,
    Contract,
    CrmNote,
    Customer,
    Equipment,
    HostPayment,
    HostProposal,
    Payment,
    PricingTier,
    RegistrationLead,
    Room,
    ServiceRecord,
    UserProfile,
    UserRole,
} from '../types';

export const IMPORT_MAX_CHARS = 2_000_000;
const IMPORT_MAX_ITEMS_PER_COLLECTION = 10_000;
const ALLOWED_IMPORT_KEYS = new Set([
    'buildings',
    'rooms',
    'customers',
    'contracts',
    'payments',
    'equipment',
    'serviceRecords',
    'userProfile',
    'adminSettings',
    'allUsers',
    'pricingTiers',
    'hostPayments',
    'leads',
    'proposals',
    'crmNotes',
]);
const ALLOWED_USER_ROLES = new Set<UserRole>([
    'SUPER_ADMIN',
    'ADMIN_L2',
    'SALES',
    'ACCOUNTANT',
    'MARKETING',
    'HOST',
    'TENANT',
]);

export type ImportPayload = Partial<{
    buildings: Building[];
    rooms: Room[];
    customers: Customer[];
    contracts: Contract[];
    payments: Payment[];
    equipment: Equipment[];
    serviceRecords: ServiceRecord[];
    userProfile: UserProfile;
    adminSettings: AdminSettings;
    allUsers: AppUser[];
    pricingTiers: PricingTier[];
    hostPayments: HostPayment[];
    leads: RegistrationLead[];
    proposals: HostProposal[];
    crmNotes: CrmNote[];
}>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === '[object Object]';
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
}

function validateArrayOfObjects(
    fieldName: string,
    value: unknown,
    validateRecord: (record: Record<string, unknown>) => boolean,
): string | null {
    if (!Array.isArray(value)) return `${fieldName} must be an array`;
    if (value.length > IMPORT_MAX_ITEMS_PER_COLLECTION) return `${fieldName} has too many items`;
    for (let index = 0; index < value.length; index += 1) {
        const record = value[index];
        if (!isPlainObject(record) || !validateRecord(record)) {
            return `${fieldName}[${index}] is invalid`;
        }
    }
    return null;
}

function validateUserProfileInput(value: unknown): value is UserProfile {
    if (!isPlainObject(value)) return false;
    if (!isNonEmptyString(value.name)) return false;
    if (!isNonEmptyString(value.email)) return false;
    if (!isNonEmptyString(value.phone)) return false;
    if (value.bankName !== undefined && typeof value.bankName !== 'string') return false;
    if (value.accountNumber !== undefined && typeof value.accountNumber !== 'string') return false;
    if (value.accountName !== undefined && typeof value.accountName !== 'string') return false;
    return true;
}

function validateAdminSettingsInput(value: unknown): value is AdminSettings {
    if (!isPlainObject(value)) return false;
    if (!isNonEmptyString(value.adminEmail)) return false;
    if (!isNonEmptyString(value.salesEmail)) return false;
    if (value.googleSheetWebhookUrl !== undefined && typeof value.googleSheetWebhookUrl !== 'string') return false;
    if (value.landingBackgroundUrl !== undefined && typeof value.landingBackgroundUrl !== 'string') return false;
    if (value.logoUrl !== undefined && typeof value.logoUrl !== 'string') return false;
    if (value.faviconUrl !== undefined && typeof value.faviconUrl !== 'string') return false;
    if (value.salesTeamEmails !== undefined) {
        if (!Array.isArray(value.salesTeamEmails) || value.salesTeamEmails.some(email => typeof email !== 'string')) return false;
    }
    if (value.paymentConfig !== undefined) {
        if (!isPlainObject(value.paymentConfig)) return false;
        const paymentConfig = value.paymentConfig;
        if (!isNonEmptyString(paymentConfig.bankName)) return false;
        if (!isNonEmptyString(paymentConfig.accountNumber)) return false;
        if (!isNonEmptyString(paymentConfig.accountName)) return false;
        if (paymentConfig.webhookUrl !== undefined && typeof paymentConfig.webhookUrl !== 'string') return false;
        if (paymentConfig.gracePeriodDays !== undefined && !isFiniteNumber(paymentConfig.gracePeriodDays)) return false;
    }
    return true;
}

export function validateImportPayload(value: unknown): { valid: true; data: ImportPayload } | { valid: false; error: string } {
    if (!isPlainObject(value)) return { valid: false, error: 'Import payload must be an object' };
    const payload = value as Record<string, unknown>;
    const unknownKeys = Object.keys(payload).filter(key => !ALLOWED_IMPORT_KEYS.has(key));
    if (unknownKeys.length > 0) {
        return { valid: false, error: `Unsupported keys in import payload: ${unknownKeys.join(', ')}` };
    }

    const fail = (error: string) => ({ valid: false as const, error });

    if (Object.prototype.hasOwnProperty.call(payload, 'buildings')) {
        const error = validateArrayOfObjects('buildings', payload.buildings, record =>
            isNonEmptyString(record.id) && isNonEmptyString(record.name) && isNonEmptyString(record.address),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'rooms')) {
        const error = validateArrayOfObjects('rooms', payload.rooms, record =>
            isNonEmptyString(record.id) && isNonEmptyString(record.name) && isNonEmptyString(record.buildingId),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'customers')) {
        const error = validateArrayOfObjects('customers', payload.customers, record =>
            isNonEmptyString(record.id) && isNonEmptyString(record.name),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'contracts')) {
        const error = validateArrayOfObjects('contracts', payload.contracts, record =>
            isNonEmptyString(record.id) && isNonEmptyString(record.roomId) && isNonEmptyString(record.customerId),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'payments')) {
        const error = validateArrayOfObjects('payments', payload.payments, record =>
            isNonEmptyString(record.id) && isNonEmptyString(record.contractId) && isFiniteNumber(record.amount),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'equipment')) {
        const error = validateArrayOfObjects('equipment', payload.equipment, record =>
            isNonEmptyString(record.id) && isNonEmptyString(record.name) && isNonEmptyString(record.buildingId),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'serviceRecords')) {
        const error = validateArrayOfObjects('serviceRecords', payload.serviceRecords, record =>
            isNonEmptyString(record.id) && isNonEmptyString(record.roomId),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'hostPayments')) {
        const error = validateArrayOfObjects('hostPayments', payload.hostPayments, record =>
            isNonEmptyString(record.id) && isNonEmptyString(record.hostId) && isFiniteNumber(record.amount),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'leads')) {
        const error = validateArrayOfObjects('leads', payload.leads, record =>
            isNonEmptyString(record.id) && isNonEmptyString(record.customerName) && isNonEmptyString(record.phone),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'proposals')) {
        const error = validateArrayOfObjects('proposals', payload.proposals, record =>
            isNonEmptyString(record.id) && isNonEmptyString(record.salesUserId) && isNonEmptyString(record.hostName),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'crmNotes')) {
        const error = validateArrayOfObjects('crmNotes', payload.crmNotes, record =>
            isNonEmptyString(record.id) && isNonEmptyString(record.hostId) && isNonEmptyString(record.authorId) && isNonEmptyString(record.content),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'allUsers')) {
        const error = validateArrayOfObjects('allUsers', payload.allUsers, record =>
            isNonEmptyString(record.id)
            && isNonEmptyString(record.name)
            && isNonEmptyString(record.email)
            && typeof record.phone === 'string'
            && typeof record.role === 'string'
            && ALLOWED_USER_ROLES.has(record.role as UserRole),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'pricingTiers')) {
        const error = validateArrayOfObjects('pricingTiers', payload.pricingTiers, record =>
            isNonEmptyString(record.id)
            && isNonEmptyString(record.name)
            && isFiniteNumber(record.price)
            && isFiniteNumber(record.maxBuildings)
            && isFiniteNumber(record.maxRooms)
            && Array.isArray(record.features)
            && record.features.every(feature => typeof feature === 'string'),
        );
        if (error) return fail(error);
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'userProfile') && !validateUserProfileInput(payload.userProfile)) {
        return fail('userProfile is invalid');
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'adminSettings') && !validateAdminSettingsInput(payload.adminSettings)) {
        return fail('adminSettings is invalid');
    }

    return { valid: true, data: payload as ImportPayload };
}
