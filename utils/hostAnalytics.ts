import type {
    Building,
    Contract,
    Equipment,
    EquipmentMaintenanceRecord,
    Payment,
    PaymentCategory,
    Room,
} from '../types';
import { getPaymentPaidAmount, getPaymentRemainingAmount } from './paymentState';

interface MetricRange {
    start: Date;
    end: Date;
}

interface CategorySummary {
    key: string;
    label: string;
    amount: number;
}

export interface HostFinancialSnapshot {
    occupancyRate: number;
    occupiedRooms: number;
    totalRooms: number;
    totalDebt: number;
    income: {
        day: number;
        month: number;
        year: number;
        total: number;
        byCategory: CategorySummary[];
    };
    expense: {
        month: number;
        year: number;
        total: number;
        byCategory: CategorySummary[];
    };
    assets: {
        purchaseValue: number;
        currentValue: number;
        maintenanceCost: number;
        monthlyDepreciation: number;
    };
}

const INCOME_LABELS: Record<string, string> = {
    room: 'Tiền phòng',
    electric: 'Điện',
    water: 'Nước',
    internet: 'Internet',
    service: 'Dịch vụ thêm',
    deposit: 'Đặt cọc',
    other: 'Khác',
};

const EXPENSE_LABELS: Record<string, string> = {
    lease: 'Thuê tòa nhà',
    purchase: 'Mua sắm tài sản',
    maintenance: 'Sửa chữa bảo trì',
    depreciation: 'Khấu hao',
};

function clampDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function getRangeAnchor(date: Date = new Date()) {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    return {
        day: { start: startOfDay, end: clampDate(date) },
        month: { start: startOfMonth, end: clampDate(date) },
        year: { start: startOfYear, end: clampDate(date) },
        total: { start: new Date(2000, 0, 1), end: clampDate(date) },
    };
}

function parseDate(value?: string): Date | null {
    if (!value) return null;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
    const [year, month, day] = value.split('-').map(Number);
    if (year && month && day) return new Date(year, month - 1, day);
    return null;
}

function isWithinRange(date: Date | null, range: MetricRange): boolean {
    if (!date) return false;
    return date >= range.start && date <= range.end;
}

function inferPaymentCategory(payment: Payment): PaymentCategory {
    if (payment.category) return payment.category;
    const type = payment.type.toLowerCase();
    if (type.includes('điện')) return 'electric';
    if (type.includes('nước')) return 'water';
    if (type.includes('internet')) return 'internet';
    if (type.includes('đặt cọc')) return 'deposit';
    if (type.includes('dịch vụ')) return 'service';
    if (type.includes('thuê') || type.includes('phòng')) return 'room';
    return 'other';
}

function toMap(entries: CategorySummary[]): CategorySummary[] {
    return entries.filter(entry => entry.amount > 0).sort((a, b) => b.amount - a.amount);
}

function accumulate(map: Map<string, number>, key: string, amount: number) {
    map.set(key, (map.get(key) || 0) + amount);
}

function countRecurringLeaseExpense(building: Building, range: MetricRange): number {
    if (building.type !== 'Rented' || !building.rentalCost) return 0;

    const leaseStart = parseDate(building.leaseStartDate) || range.start;
    const leaseEnd = parseDate(building.leaseEndDate) || range.end;
    if (leaseEnd < range.start || leaseStart > range.end) return 0;

    const start = new Date(Math.max(leaseStart.getTime(), range.start.getTime()));
    const end = new Date(Math.min(leaseEnd.getTime(), range.end.getTime()));

    const startMarker = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMarker = new Date(end.getFullYear(), end.getMonth(), 1);
    const months = (endMarker.getFullYear() - startMarker.getFullYear()) * 12 + (endMarker.getMonth() - startMarker.getMonth()) + 1;
    return months * building.rentalCost;
}

function getEquipmentMaintenanceCost(item: Equipment): number {
    return (item.maintenanceHistory || []).reduce((sum, record) => sum + (record.cost || 0), 0);
}

function getEquipmentCurrentValue(item: Equipment): number {
    if (typeof item.currentValue === 'number') return item.currentValue;
    const monthly = getMonthlyDepreciation(item);
    const purchaseDate = parseDate(item.purchaseDate);
    if (!purchaseDate || !monthly) return item.price;
    const now = new Date();
    const elapsedMonths = Math.max(0, (now.getFullYear() - purchaseDate.getFullYear()) * 12 + (now.getMonth() - purchaseDate.getMonth()));
    const currentValue = item.price - elapsedMonths * monthly;
    return Math.max(item.salvageValue || 0, currentValue);
}

function getMonthlyDepreciation(item: Equipment): number {
    const months = item.depreciationMonths || 0;
    if (!months) return 0;
    return Math.max(0, (item.price - (item.salvageValue || 0)) / months);
}

function getMaintenanceEntriesInRange(items: Equipment[], range: MetricRange): EquipmentMaintenanceRecord[] {
    return items.flatMap(item => (item.maintenanceHistory || []).filter(entry => isWithinRange(parseDate(entry.date), range)));
}

export function createHostFinancialSnapshot(input: {
    rooms: Room[];
    contracts: Contract[];
    payments: Payment[];
    buildings: Building[];
    equipment: Equipment[];
}): HostFinancialSnapshot {
    const { rooms, contracts, payments, buildings, equipment } = input;
    const ranges = getRangeAnchor();
    const occupiedRooms = rooms.filter(room => room.status === 'Đang ở').length;
    const totalDebt = payments
        .filter(payment => (payment.direction || 'income') === 'income')
        .reduce((sum, payment) => sum + getPaymentRemainingAmount(payment), 0);

    const paidPayments = payments.filter(payment => getPaymentPaidAmount(payment) > 0 && (payment.direction || 'income') === 'income');
    const incomeCategoryMap = new Map<string, number>();

    const incomeByRange = {
        day: 0,
        month: 0,
        year: 0,
        total: 0,
    };

    for (const payment of paidPayments) {
        const date = parseDate(payment.paidDate || payment.sourceDate || payment.dueDate);
        const category = inferPaymentCategory(payment);
        const collectedAmount = getPaymentPaidAmount(payment);
        accumulate(incomeCategoryMap, category, collectedAmount);

        if (isWithinRange(date, ranges.day)) incomeByRange.day += collectedAmount;
        if (isWithinRange(date, ranges.month)) incomeByRange.month += collectedAmount;
        if (isWithinRange(date, ranges.year)) incomeByRange.year += collectedAmount;
        if (isWithinRange(date, ranges.total)) incomeByRange.total += collectedAmount;
    }

    const expenseCategoryMap = new Map<string, number>();
    let expenseMonth = 0;
    let expenseYear = 0;
    let expenseTotal = 0;

    for (const building of buildings) {
        const leaseMonth = countRecurringLeaseExpense(building, ranges.month);
        const leaseYear = countRecurringLeaseExpense(building, ranges.year);
        const leaseTotal = countRecurringLeaseExpense(building, ranges.total);
        if (leaseTotal > 0) {
            accumulate(expenseCategoryMap, 'lease', leaseTotal);
            expenseMonth += leaseMonth;
            expenseYear += leaseYear;
            expenseTotal += leaseTotal;
        }
    }

    for (const item of equipment) {
        const purchaseDate = parseDate(item.purchaseDate);
        if (isWithinRange(purchaseDate, ranges.month)) expenseMonth += item.price;
        if (isWithinRange(purchaseDate, ranges.year)) expenseYear += item.price;
        if (isWithinRange(purchaseDate, ranges.total)) expenseTotal += item.price;
        accumulate(expenseCategoryMap, 'purchase', item.price);
    }

    const maintenanceMonth = getMaintenanceEntriesInRange(equipment, ranges.month).reduce((sum, entry) => sum + entry.cost, 0);
    const maintenanceYear = getMaintenanceEntriesInRange(equipment, ranges.year).reduce((sum, entry) => sum + entry.cost, 0);
    const maintenanceTotal = getMaintenanceEntriesInRange(equipment, ranges.total).reduce((sum, entry) => sum + entry.cost, 0);
    expenseMonth += maintenanceMonth;
    expenseYear += maintenanceYear;
    expenseTotal += maintenanceTotal;
    if (maintenanceTotal > 0) accumulate(expenseCategoryMap, 'maintenance', maintenanceTotal);

    const monthlyDepreciation = equipment.reduce((sum, item) => sum + getMonthlyDepreciation(item), 0);
    const yearlyDepreciation = monthlyDepreciation * 12;
    expenseMonth += monthlyDepreciation;
    expenseYear += yearlyDepreciation;
    expenseTotal += yearlyDepreciation;
    if (yearlyDepreciation > 0) accumulate(expenseCategoryMap, 'depreciation', yearlyDepreciation);

    const activeContracts = contracts.filter(contract => contract.isActive).length;
    const occupancyRate = rooms.length === 0 ? 0 : occupiedRooms / rooms.length;

    return {
        occupancyRate,
        occupiedRooms,
        totalRooms: rooms.length,
        totalDebt,
        income: {
            ...incomeByRange,
            byCategory: toMap(
                Array.from(incomeCategoryMap.entries()).map(([key, amount]) => ({
                    key,
                    amount,
                    label: INCOME_LABELS[key] || key,
                })),
            ),
        },
        expense: {
            month: expenseMonth,
            year: expenseYear,
            total: expenseTotal,
            byCategory: toMap(
                Array.from(expenseCategoryMap.entries()).map(([key, amount]) => ({
                    key,
                    amount,
                    label: EXPENSE_LABELS[key] || key,
                })),
            ),
        },
        assets: {
            purchaseValue: equipment.reduce((sum, item) => sum + item.price, 0),
            currentValue: equipment.reduce((sum, item) => sum + getEquipmentCurrentValue(item), 0),
            maintenanceCost: equipment.reduce((sum, item) => sum + getEquipmentMaintenanceCost(item), 0),
            monthlyDepreciation,
        },
    };
}

export function getEquipmentBookValue(item: Equipment): number {
    return getEquipmentCurrentValue(item);
}

export function getEquipmentMaintenanceTotal(item: Equipment): number {
    return getEquipmentMaintenanceCost(item);
}

export function getEquipmentMonthlyDepreciation(item: Equipment): number {
    return getMonthlyDepreciation(item);
}
