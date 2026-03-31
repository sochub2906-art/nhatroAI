import type { BankInfo, Building, Contract, Customer, Payment, PaymentStatus, Room } from '../types';
import { getPaymentPaidAmount, getPaymentRemainingAmount, resolvePaymentStatus } from './paymentState';
import { formatDateVN } from './dateFormat';

export type PaymentCategoryKey = NonNullable<Payment['category']> | 'other';

export const CATEGORY_LABELS: Record<PaymentCategoryKey, string> = {
    room: 'Tiền phòng',
    electric: 'Điện',
    water: 'Nước',
    internet: 'Internet',
    service: 'Dịch vụ',
    deposit: 'Đặt cọc',
    maintenance: 'Sửa chữa',
    expense: 'Chi phí',
    other: 'Khác',
};

const ROOM_SHARED_CATEGORIES = new Set<PaymentCategoryKey>(['electric', 'water', 'internet', 'other']);

interface EnrichedPayment {
    payment: Payment;
    contract?: Contract;
    room?: Room;
    building?: Building;
    customer?: Customer;
    categoryKey: PaymentCategoryKey;
}

interface BillItemAccumulator {
    key: string;
    representative: EnrichedPayment;
    rawPayments: EnrichedPayment[];
    scope: 'room' | 'customer';
}

export interface RoomBillCustomer {
    id: string;
    name: string;
    phone: string;
}

export interface RoomBillItem {
    id: string;
    title: string;
    description: string;
    amount: number;
    collectedAmount: number;
    remainingAmount: number;
    categoryKey: PaymentCategoryKey;
    status: PaymentStatus;
    scope: 'room' | 'customer';
    customerNames: string[];
    rawPaymentIds: string[];
    actionPaymentIds: string[];
    dueDate: string;
    paidDate?: string;
    duplicateCount: number;
    note?: string;
}

export interface RoomBill {
    id: string;
    roomId: string;
    roomName: string;
    roomLabel: string;
    buildingName?: string;
    buildingAddress?: string;
    period: string;
    dueDate: string;
    status: PaymentStatus;
    totalAmount: number;
    collectedAmount: number;
    pendingAmount: number;
    customers: RoomBillCustomer[];
    items: RoomBillItem[];
    rawPaymentIds: string[];
    pendingPaymentIds: string[];
    productSummary: string;
    searchText: string;
    mergedDuplicateCount: number;
}

function safeText(value?: string | null): string {
    return value?.trim() || '';
}

function normalizeTransferToken(value?: string | null): string {
    return safeText(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase();
}

function parsePeriodTokens(period?: string): { cycle: string; year: string } {
    const raw = safeText(period);
    if (!raw) return { cycle: '0', year: String(new Date().getFullYear()) };

    const slashParts = raw.split('/');
    if (slashParts.length === 2) {
        return {
            cycle: slashParts[0].replace(/\D/g, '') || raw,
            year: slashParts[1].replace(/\D/g, '') || String(new Date().getFullYear()),
        };
    }

    const matches = raw.match(/\d+/g) || [];
    if (matches.length >= 2) {
        return { cycle: matches[0], year: matches[1] };
    }

    return { cycle: raw, year: String(new Date().getFullYear()) };
}

function normalizeKey(value?: string | null): string {
    return safeText(value).toLowerCase();
}

function formatDate(value?: string): string {
    if (!value) return '';
    return formatDateVN(value, value);
}

function formatMoney(amount: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount || 0);
}

export function buildBillTransferContent(bill: Pick<RoomBill, 'id' | 'roomName' | 'period'>): string {
    const period = parsePeriodTokens(bill.period);
    const roomToken = normalizeTransferToken(bill.roomName || 'PHONG');
    return `NHA TRO PHONG ${roomToken} TT TIEN KY ${period.cycle} NAM ${period.year} ${bill.id}`;
}

export function inferPaymentCategory(payment: Payment): PaymentCategoryKey {
    if (payment.category) return payment.category;
    const type = payment.type.toLowerCase();
    if (type.includes('điện')) return 'electric';
    if (type.includes('nước')) return 'water';
    if (type.includes('internet')) return 'internet';
    if (type.includes('dịch vụ')) return 'service';
    if (type.includes('đặt cọc')) return 'deposit';
    if (type.includes('phòng') || type.includes('thuê')) return 'room';
    return 'other';
}

function compareContracts(left?: Contract, right?: Contract): number {
    const leftTime = left ? new Date(left.startDate || left.createdAt || 0).getTime() : 0;
    const rightTime = right ? new Date(right.startDate || right.createdAt || 0).getTime() : 0;
    return leftTime - rightTime;
}

function deriveStatus(statuses: PaymentStatus[]): PaymentStatus {
    const paid = '\u0110\u00e3\u0020\u0111\u00f3\u006e\u0067' as PaymentStatus;
    const overdue = '\u0051\u0075\u00e1\u0020\u0068\u1ea1\u006e' as PaymentStatus;
    const partial = '\u0054\u0068\u0061\u006e\u0068\u0020\u0074\u006f\u00e1\u006e\u0020\u006d\u1ed9\u0074\u0020\u0070\u0068\u1ea7\u006e' as PaymentStatus;
    const pending = '\u0043\u0068\u1edd\u0020\u0074\u0068\u0061\u006e\u0068\u0020\u0074\u006f\u00e1\u006e' as PaymentStatus;

    if (statuses.every(status => status === paid)) return paid;
    if (statuses.some(status => status === overdue)) return overdue;
    if (statuses.some(status => status === partial)) return partial;
    return pending;
}

function latestPaidDate(values: Array<string | undefined>): string | undefined {
    return values
        .filter(Boolean)
        .sort((left, right) => new Date(right as string).getTime() - new Date(left as string).getTime())[0];
}

function itemLabel(item: RoomBillItem): string {
    if (item.scope === 'customer' && item.customerNames.length > 0) {
        return `${item.title} (${item.customerNames.join(', ')})`;
    }
    return item.title;
}

export function buildRoomBills(params: {
    payments: Payment[];
    contracts: Contract[];
    rooms: Room[];
    customers: Customer[];
    buildings: Building[];
}): RoomBill[] {
    const { payments, contracts, rooms, customers, buildings } = params;
    const contractById = new Map(contracts.map(contract => [contract.id, contract]));
    const roomById = new Map(rooms.map(room => [room.id, room]));
    const customerById = new Map(customers.map(customer => [customer.id, customer]));
    const buildingById = new Map(buildings.map(building => [building.id, building]));

    const billAccumulators = new Map<string, { room?: Room; building?: Building; period: string; items: Map<string, BillItemAccumulator> }>();

    payments
        .filter(payment => payment.direction !== 'expense')
        .forEach(payment => {
            const contract = contractById.get(payment.contractId);
            const room = contract ? roomById.get(contract.roomId) : undefined;
            const building = room ? buildingById.get(room.buildingId) : undefined;
            const customer = contract ? customerById.get(contract.customerId) : undefined;
            const categoryKey = inferPaymentCategory(payment);
            const billKey = `${room?.id || payment.contractId}:${payment.period}`;
            const billEntry = billAccumulators.get(billKey) || {
                room,
                building,
                period: payment.period,
                items: new Map<string, BillItemAccumulator>(),
            };

            const sharedRoomCharge = ROOM_SHARED_CATEGORIES.has(categoryKey);
            const itemKey = sharedRoomCharge
                ? `shared:${categoryKey}:${normalizeKey(payment.type)}:${normalizeKey(payment.description)}`
                : `payment:${payment.id}`;

            const enriched: EnrichedPayment = { payment, contract, room, building, customer, categoryKey };
            const current = billEntry.items.get(itemKey);

            if (!current) {
                billEntry.items.set(itemKey, {
                    key: itemKey,
                    representative: enriched,
                    rawPayments: [enriched],
                    scope: sharedRoomCharge ? 'room' : 'customer',
                });
            } else {
                current.rawPayments.push(enriched);
                if (compareContracts(current.representative.contract, enriched.contract) < 0) {
                    current.representative = enriched;
                }
            }

            billAccumulators.set(billKey, billEntry);
        });

    return Array.from(billAccumulators.entries())
        .map(([billKey, bill]) => {
            const customerMap = new Map<string, RoomBillCustomer>();
            const items = Array.from(bill.items.values())
                                .map(entry => {
                    const representative = entry.representative;
                    const rawAmounts = entry.rawPayments.map(raw => raw.payment.amount);
                    const actionPayments = entry.scope === 'room'
                        ? [representative.payment]
                        : entry.rawPayments.map(raw => raw.payment);
                    const uniqueCustomerNames = Array.from(
                        new Set(
                            entry.rawPayments
                                .map(raw => raw.customer?.name)
                                .filter((value): value is string => Boolean(value)),
                        ),
                    );

                    entry.rawPayments.forEach(raw => {
                        if (raw.customer) {
                            customerMap.set(raw.customer.id, {
                                id: raw.customer.id,
                                name: raw.customer.name,
                                phone: raw.customer.phone,
                            });
                        }
                    });

                    const hasMixedSharedAmounts = entry.scope === 'room' && new Set(rawAmounts).size > 1;
                    const duplicateCount = Math.max(0, entry.rawPayments.length - 1);
                    const collectedAmount = actionPayments.reduce((sum, payment) => sum + getPaymentPaidAmount(payment), 0);
                    const remainingAmount = actionPayments.reduce((sum, payment) => sum + getPaymentRemainingAmount(payment), 0);
                    const totalAmount = actionPayments.reduce((sum, payment) => sum + payment.amount, 0);
                    const resolvedStatuses = actionPayments.map(payment => resolvePaymentStatus(payment));

                    return {
                        id: entry.key,
                        title: representative.payment.type,
                        description: representative.payment.description || CATEGORY_LABELS[representative.categoryKey],
                        amount: totalAmount,
                        collectedAmount,
                        remainingAmount,
                        categoryKey: representative.categoryKey,
                        status: deriveStatus(resolvedStatuses),
                        scope: entry.scope,
                        customerNames: uniqueCustomerNames,
                        rawPaymentIds: entry.rawPayments.map(raw => raw.payment.id),
                        actionPaymentIds: actionPayments.map(payment => payment.id),
                        dueDate: representative.payment.dueDate,
                        paidDate: latestPaidDate(actionPayments.map(payment => payment.paidDate)),
                        duplicateCount,
                        note: hasMixedSharedAmounts
                            ? 'Khoan dung chung theo phong dang lay theo hop dong gan nhat.'
                            : duplicateCount > 0
                                ? `Da gop ${entry.rawPayments.length} dong trung theo phong.`
                                : undefined,
                    } satisfies RoomBillItem;
                })
                .sort((left, right) => {
                    const leftOrder = ['room', 'electric', 'water', 'internet', 'service', 'deposit', 'other'];
                    return leftOrder.indexOf(left.categoryKey) - leftOrder.indexOf(right.categoryKey);
                });

            const roomName = bill.room?.name || 'Chưa gắn phòng';
            const dueDate = items
                .map(item => item.dueDate)
                .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0] || '';
            const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
            const collectedAmount = items.reduce((sum, item) => sum + item.collectedAmount, 0);
            const pendingAmount = items.reduce((sum, item) => sum + item.remainingAmount, 0);
            const statuses = items.map(item => item.status);
            const roomLabel = bill.building?.name ? `${bill.building.name} · Phòng ${roomName}` : `Phòng ${roomName}`;
            const rawPaymentIds = items.flatMap(item => item.rawPaymentIds);
            const pendingPaymentIds = items
                .filter(item => item.remainingAmount > 0)
                .flatMap(item => item.actionPaymentIds);
            const productSummaryItems = items.slice(0, 3).map(item => itemLabel(item));
            const productSummary = productSummaryItems.join(' • ');
            const extraItemCount = Math.max(0, items.length - productSummaryItems.length);
            const customersForSearch = Array.from(customerMap.values());

            const billId = `BL_${billKey.replace(/[^a-zA-Z0-9]+/g, '_')}`;

            return {
                id: billId,
                roomId: bill.room?.id || billKey.split(':')[0],
                roomName,
                roomLabel,
                buildingName: bill.building?.name,
                buildingAddress: bill.building?.address,
                period: bill.period,
                dueDate,
                status: deriveStatus(statuses.length > 0 ? statuses : ['\u0043\u0068\u1edd\u0020\u0074\u0068\u0061\u006e\u0068\u0020\u0074\u006f\u00e1\u006e' as PaymentStatus]),
                totalAmount,
                collectedAmount,
                pendingAmount,
                customers: customersForSearch,
                items,
                rawPaymentIds,
                pendingPaymentIds,
                productSummary: extraItemCount > 0 ? `${productSummary} • +${extraItemCount} khoản` : productSummary,
                searchText: [
                    billId,
                    roomName,
                    bill.building?.name || '',
                    bill.period,
                    ...customersForSearch.map(customer => `${customer.name} ${customer.phone}`),
                    ...items.map(item => `${item.title} ${item.description}`),
                    rawPaymentIds.join(' '),
                ].join(' ').toLowerCase(),
                mergedDuplicateCount: items.reduce((sum, item) => sum + item.duplicateCount, 0),
            } satisfies RoomBill;
        })
        .sort((left, right) => new Date(right.dueDate).getTime() - new Date(left.dueDate).getTime());
}

export function buildBillShareText(bill: RoomBill, bankInfo?: BankInfo): string {
    const lines = [
        `Phiếu thu phòng ${bill.roomName} - kỳ ${bill.period}`,
        bill.buildingName ? `Tòa nhà: ${bill.buildingName}` : '',
        bill.buildingAddress ? `Địa chỉ: ${bill.buildingAddress}` : '',
        `Khách thuê: ${bill.customers.map(customer => customer.name).join(', ') || 'Chưa cập nhật'}`,
        `Hạn thanh toán: ${formatDate(bill.dueDate) || bill.dueDate}`,
        '',
        'Chi tiết khoản thu:',
        ...bill.items.map(item => {
            const suffix = item.scope === 'customer' && item.customerNames.length > 0 ? ` - ${item.customerNames.join(', ')}` : ' - dùng chung phòng';
            return `• ${item.title}${suffix}: ${formatMoney(item.amount)}`;
        }),
        '',
        `Tổng thanh toán: ${formatMoney(bill.totalAmount)}`,
        bill.pendingAmount !== bill.totalAmount ? `Còn phải thu: ${formatMoney(bill.pendingAmount)}` : '',
    ];

    if (bankInfo?.bankName && bankInfo.accountNumber && bankInfo.accountName) {
        lines.push(
            '',
            'Thông tin chuyển khoản:',
            `Ngân hàng: ${bankInfo.bankName}`,
            `Số tài khoản: ${bankInfo.accountNumber}`,
            `Chủ tài khoản: ${bankInfo.accountName}`,
            `Nội dung: ${buildBillTransferContent(bill)}`,
        );
    }

    return lines.filter(Boolean).join('\n');
}

export function buildBillDocumentHtml(bill: RoomBill, bankInfo?: BankInfo): string {
    const transferContent = buildBillTransferContent(bill);
    const amountForQr = bill.pendingAmount > 0 ? bill.pendingAmount : bill.totalAmount;
    const qrUrl = bankInfo?.bankName && bankInfo.accountNumber && bankInfo.accountName
        ? `https://img.vietqr.io/image/${bankInfo.bankName}-${bankInfo.accountNumber}-compact.png?amount=${amountForQr}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankInfo.accountName)}`
        : '';

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Phiếu thu ${bill.roomName} kỳ ${bill.period}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; margin: 28px; line-height: 1.55; }
    .page { max-width: 900px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; }
    .brand { font-size: 28px; font-weight: 800; color: #1d4ed8; margin: 0; }
    .muted { color: #475569; }
    .title { margin: 18px 0 8px; font-size: 22px; font-weight: 800; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 24px; margin: 18px 0; }
    .card { border: 1px solid #cbd5e1; border-radius: 18px; padding: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 18px; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 12px; vertical-align: top; }
    th { background: #e2e8f0; text-align: left; font-size: 12px; text-transform: uppercase; }
    .text-right { text-align: right; }
    .summary { margin-top: 18px; display: flex; justify-content: space-between; gap: 24px; }
    .summary-block { flex: 1; border: 1px solid #cbd5e1; border-radius: 18px; padding: 16px; }
    .summary-label { font-size: 13px; color: #475569; }
    .summary-value { margin-top: 8px; font-size: 24px; font-weight: 800; }
    .bank { margin-top: 18px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; }
    .bank pre { white-space: pre-wrap; margin: 0; font-family: inherit; }
    .qr { display: flex; align-items: center; justify-content: center; border: 1px solid #cbd5e1; border-radius: 18px; min-height: 220px; padding: 16px; }
    .footer { margin-top: 18px; font-size: 12px; color: #64748b; }
    @media print { body { margin: 16px; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <p class="brand">Smart Rental</p>
        <p class="muted">${bill.buildingName || 'Phiếu thu theo phòng'}</p>
        <p class="muted">${bill.buildingAddress || ''}</p>
      </div>
      <div class="card">
        <div class="summary-label">Mã phiếu</div>
        <div><strong>${bill.id}</strong></div>
        <div class="summary-label" style="margin-top:8px;">Ngày lập</div>
      <div><strong>${formatDateVN(new Date())}</strong></div>
      </div>
    </div>

    <div class="title">Phiếu thu phòng ${bill.roomName} - kỳ ${bill.period}</div>

    <div class="grid">
      <div class="card">
        <div class="summary-label">Khách thuê</div>
        <div><strong>${bill.customers.map(customer => customer.name).join(', ') || 'Chưa cập nhật'}</strong></div>
        <div class="summary-label" style="margin-top:8px;">Điện thoại</div>
        <div>${bill.customers.map(customer => customer.phone).filter(Boolean).join(', ') || 'Chưa cập nhật'}</div>
      </div>
      <div class="card">
        <div class="summary-label">Phòng / kỳ hạn</div>
        <div><strong>${bill.roomLabel}</strong></div>
        <div class="summary-label" style="margin-top:8px;">Hạn thanh toán</div>
        <div>${formatDate(bill.dueDate) || bill.dueDate}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Khoản thu</th>
          <th>Áp dụng</th>
          <th>Ghi chú</th>
          <th class="text-right">Số tiền</th>
        </tr>
      </thead>
      <tbody>
        ${bill.items
            .map(item => `
              <tr>
                <td><strong>${item.title}</strong></td>
                <td>${item.scope === 'customer' ? (item.customerNames.join(', ') || 'Theo hợp đồng') : 'Dùng chung theo phòng'}</td>
                <td>${item.note || item.description}</td>
                <td class="text-right"><strong>${formatMoney(item.amount)}</strong></td>
              </tr>
            `)
            .join('')}
      </tbody>
    </table>

    <div class="summary">
      <div class="summary-block">
        <div class="summary-label">Tổng phiếu</div>
        <div class="summary-value">${formatMoney(bill.totalAmount)}</div>
      </div>
      <div class="summary-block">
        <div class="summary-label">Còn phải thu</div>
        <div class="summary-value">${formatMoney(bill.pendingAmount)}</div>
      </div>
    </div>

    <div class="bank">
      <div class="summary-block">
        <div class="summary-label">Nội dung chuyển khoản</div>
        <pre>${buildBillShareText(bill, bankInfo)}</pre>
      </div>
      <div class="qr">
        ${qrUrl ? `<img src="${qrUrl}" alt="QR thanh toán" style="max-width:100%; max-height:100%; object-fit:contain;" referrerpolicy="no-referrer" />` : '<span class="muted">Chưa cấu hình tài khoản nhận tiền</span>'}
      </div>
    </div>

    <div class="footer">
      Phiếu thu này tổng hợp theo phòng để dễ chia sẻ qua Zalo, Messenger, email hoặc in trực tiếp.
    </div>
  </div>
</body>
</html>`;
}
