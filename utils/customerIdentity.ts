import type { Customer, CustomerGender } from '../types';

export type CustomerDraft = Omit<Customer, 'hostId' | 'createdAt'>;

const DEFAULT_CUSTOMER_DRAFT: CustomerDraft = {
    id: '',
    name: '',
    phone: '',
    email: '',
    zalo: '',
    idNumber: '',
    idIssueDate: '',
    idIssuePlace: '',
    idFrontImage: '',
    idBackImage: '',
    avatarImage: '',
    dateOfBirth: '',
    gender: 'Nam',
    nationality: 'Việt Nam',
    placeOfOrigin: '',
    permanentAddress: '',
    currentAddress: '',
    occupation: '',
    qrCodeData: '',
    notes: '',
};

export function createCustomerDraft(seed?: Partial<CustomerDraft>): CustomerDraft {
    return {
        ...DEFAULT_CUSTOMER_DRAFT,
        id: seed?.id || `KH${Date.now().toString().slice(-6)}`,
        ...seed,
    };
}

function formatDateFromCompact(input?: string): string {
    if (!input) return '';
    const raw = input.replace(/\D/g, '');
    if (raw.length !== 8) return input;
    const day = raw.slice(0, 2);
    const month = raw.slice(2, 4);
    const year = raw.slice(4, 8);
    return `${year}-${month}-${day}`;
}

function normalizeGender(value?: string): CustomerGender | undefined {
    const raw = (value || '').trim().toLowerCase();
    if (!raw) return undefined;
    if (raw === 'nam' || raw === 'male' || raw === 'm') return 'Nam';
    if (raw === 'nữ' || raw === 'nu' || raw === 'female' || raw === 'f') return 'Nữ';
    return 'Khác';
}

function normalizeName(value?: string): string {
    if (!value) return '';
    return value
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function parseVnCitizenQrPayload(rawValue: string): Partial<CustomerDraft> | null {
    const raw = rawValue.trim();
    if (!raw) return null;

    const parts = raw.split('|').map(part => part.trim()).filter(Boolean);
    if (parts.length < 4) return null;

    const idNumber = parts[0];
    const name = parts[2] || parts[1] || '';
    const dateOfBirth = formatDateFromCompact(parts[3]);
    const gender = normalizeGender(parts[4]);
    const permanentAddress = parts[5] || '';
    const idIssueDate = formatDateFromCompact(parts[6]);

    return {
        idNumber,
        name: normalizeName(name),
        dateOfBirth,
        gender,
        permanentAddress,
        currentAddress: permanentAddress,
        idIssueDate,
        idIssuePlace: 'Bộ Công an',
        qrCodeData: raw,
    };
}

export function applyCustomerQrData(current: CustomerDraft, rawValue: string): CustomerDraft {
    const parsed = parseVnCitizenQrPayload(rawValue);
    if (!parsed) return current;

    return {
        ...current,
        ...parsed,
        id: current.id || `KH${Date.now().toString().slice(-6)}`,
    };
}
