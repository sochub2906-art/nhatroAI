import type { Contract, PaymentStatus } from '../types';
import { STATUS_OVERDUE, STATUS_PAID, STATUS_PARTIAL } from './paymentState';
import { formatDateVN } from './dateFormat';

export type ContractExpiryState = {
    tone: 'warning' | 'error';
    label: string;
    daysLeft: number;
};

export function getCurrentBillingPeriod(date = new Date()): string {
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function parseDateValue(value?: string): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateLabel(value?: string): string {
    const date = parseDateValue(value);
    if (!date) return value || 'Chua cap nhat';
    return formatDateVN(date);
}

function toStartOfDay(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function getContractExpiryState(contract: Contract, warningDays = 7, now = new Date()): ContractExpiryState | null {
    if (!contract.isActive || !contract.endDate) return null;

    const endDate = parseDateValue(contract.endDate);
    if (!endDate) return null;

    const daysLeft = Math.ceil((toStartOfDay(endDate) - toStartOfDay(now)) / (24 * 60 * 60 * 1000));

    if (daysLeft < 0) {
        return {
            tone: 'error',
            label: `Qua han ${Math.abs(daysLeft)} ngay`,
            daysLeft,
        };
    }

    if (daysLeft <= warningDays) {
        return {
            tone: 'warning',
            label: daysLeft === 0 ? 'Het han hom nay' : `Sap het han ${daysLeft} ngay`,
            daysLeft,
        };
    }

    return null;
}

export function getBillStatusTone(status?: PaymentStatus | 'missing'): string {
    if (status === STATUS_PAID) return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300';
    if (status === STATUS_PARTIAL) return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-300';
    if (status === STATUS_OVERDUE) return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300';
    if (status === 'missing') return 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300';
    return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300';
}
