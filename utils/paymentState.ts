import type { BillLifecycleStatus, Payment, PaymentStatus } from '../types';

export const STATUS_PENDING = '\u0043\u0068\u1edd\u0020\u0074\u0068\u0061\u006e\u0068\u0020\u0074\u006f\u00e1\u006e' as PaymentStatus;
export const STATUS_PARTIAL = '\u0054\u0068\u0061\u006e\u0068\u0020\u0074\u006f\u00e1\u006e\u0020\u006d\u1ed9\u0074\u0020\u0070\u0068\u1ea7\u006e' as PaymentStatus;
export const STATUS_PAID = '\u0110\u00e3\u0020\u0111\u00f3\u006e\u0067' as PaymentStatus;
export const STATUS_OVERDUE = '\u0051\u0075\u00e1\u0020\u0068\u1ea1\u006e' as PaymentStatus;

export function paymentStatusToBillStatus(status: PaymentStatus): BillLifecycleStatus {
    switch (status) {
        case STATUS_PAID:
            return 'paid';
        case STATUS_PARTIAL:
            return 'partially_paid';
        case STATUS_OVERDUE:
            return 'overdue';
        default:
            return 'issued';
    }
}

function parseDueDate(value?: string): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function getPaymentPaidAmount(payment: Payment): number {
    if (typeof payment.paidAmount === 'number') {
        return Math.max(0, payment.paidAmount);
    }
    if (typeof payment.remainingAmount === 'number') {
        return Math.max(0, payment.amount - Math.max(0, payment.remainingAmount));
    }
    return payment.status === STATUS_PAID ? payment.amount : 0;
}

export function getPaymentRemainingAmount(payment: Payment): number {
    if (typeof payment.remainingAmount === 'number') {
        return Math.max(0, payment.remainingAmount);
    }
    return Math.max(0, payment.amount - getPaymentPaidAmount(payment));
}

export function resolvePaymentStatus(payment: Payment, now = new Date()): PaymentStatus {
    const remainingAmount = getPaymentRemainingAmount(payment);
    if (remainingAmount <= 0) return STATUS_PAID;

    const paidAmount = getPaymentPaidAmount(payment);
    const dueDate = parseDueDate(payment.dueDate);
    const isOverdue = Boolean(dueDate && dueDate.getTime() < now.getTime());

    if (isOverdue) return STATUS_OVERDUE;
    if (paidAmount > 0) return STATUS_PARTIAL;
    return payment.status === STATUS_OVERDUE ? STATUS_OVERDUE : STATUS_PENDING;
}

export function applyPaymentCollection(payment: Payment, collectedAmount: number, collectedDate: string): Payment {
    const normalizedAmount = Math.max(0, Math.round(collectedAmount));
    const nextPaidAmount = Math.min(payment.amount, getPaymentPaidAmount(payment) + normalizedAmount);
    const remainingAmount = Math.max(0, payment.amount - nextPaidAmount);

    return {
        ...payment,
        paidAmount: nextPaidAmount,
        remainingAmount,
        lastCollectedAmount: normalizedAmount,
        paidDate: collectedDate,
        status: remainingAmount === 0
            ? STATUS_PAID
            : resolvePaymentStatus({
                ...payment,
                paidAmount: nextPaidAmount,
                remainingAmount,
                paidDate: collectedDate,
            }),
        billStatus: paymentStatusToBillStatus(
            remainingAmount === 0
                ? STATUS_PAID
                : resolvePaymentStatus({
                    ...payment,
                    paidAmount: nextPaidAmount,
                    remainingAmount,
                    paidDate: collectedDate,
                }),
        ),
    };
}

export function sumOutstandingPayments(payments: Payment[]): number {
    return payments.reduce((sum, payment) => sum + getPaymentRemainingAmount(payment), 0);
}

export function sumCollectedPayments(payments: Payment[]): number {
    return payments.reduce((sum, payment) => sum + getPaymentPaidAmount(payment), 0);
}
