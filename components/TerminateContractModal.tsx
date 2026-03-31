import React from 'react';
import { AlertTriangle, Home, Receipt, Trash2, UserRoundX, Wrench } from 'lucide-react';
import { formatCurrency } from '../AppContext';
import type { Contract, Customer, Equipment, EquipmentStatus, Payment, Room } from '../types';
import { formatDateLabel } from '../utils/contractStatus';

type EquipmentAssessment = {
    id: string;
    status: EquipmentStatus;
};

interface TerminateContractModalProps {
    contract: Contract;
    customer: Customer;
    room: Room;
    roomEquipment: Equipment[];
    outstandingPayments: Payment[];
    remainingOccupantCount: number;
    onClose: () => void;
    onConfirm: (updates: EquipmentAssessment[]) => void;
}

const EQUIPMENT_STATUSES: EquipmentStatus[] = ['Tốt', 'Hỏng', 'Đang sửa', 'Thanh lý'];

export default function TerminateContractModal({
    contract,
    customer,
    room,
    roomEquipment,
    outstandingPayments,
    remainingOccupantCount,
    onClose,
    onConfirm,
}: TerminateContractModalProps) {
    const [equipmentAssessments, setEquipmentAssessments] = React.useState<Record<string, EquipmentStatus>>(
        () => Object.fromEntries(roomEquipment.map(item => [item.id, item.status])),
    );

    const totalOutstanding = outstandingPayments.reduce((sum, payment) => sum + payment.amount, 0);

    const handleConfirm = () => {
        const updates = roomEquipment
            .map(item => ({
                id: item.id,
                status: equipmentAssessments[item.id] || item.status,
            }))
            .filter(update => {
                const current = roomEquipment.find(item => item.id === update.id);
                return current && current.status !== update.status;
            });

        onConfirm(updates);
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-rose-50 p-3 text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">
                            <UserRoundX className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Hủy hợp đồng nhanh</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Xác nhận chi phí còn mở, rà lại tài sản trong phòng, rồi đưa khách ra khỏi phòng.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 p-6">
                    <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Khách thuê</div>
                                <div className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{customer.name}</div>
                                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{customer.phone || 'Chưa cập nhật số điện thoại'}</div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Phòng</div>
                                <div className="mt-2 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                                    <Home className="h-4 w-4 text-blue-500" />
                                    {room.name}
                                </div>
                                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Hợp đồng {contract.id}</div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Thời gian ở</div>
                                <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">Ngày vào: {formatDateLabel(contract.startDate)}</div>
                                <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">Hết hạn: {formatDateLabel(contract.endDate)}</div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-4 flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-amber-500" />
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Chi phí cần chốt trước khi hủy</h4>
                        </div>

                        {outstandingPayments.length === 0 ? (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
                                Không còn phiếu mở cho khách này. Có thể hủy hợp đồng ngay.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {outstandingPayments.map(payment => (
                                    <div key={payment.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="font-medium text-slate-900 dark:text-white">{payment.type}</div>
                                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                Kỳ {payment.period} · Hạn {formatDateLabel(payment.dueDate)} · {payment.status}
                                            </div>
                                        </div>
                                        <div className="text-right text-sm font-semibold text-rose-600 dark:text-rose-300">
                                            {formatCurrency(payment.amount)}
                                        </div>
                                    </div>
                                ))}

                                <div className="rounded-2xl bg-amber-50 px-4 py-4 text-sm dark:bg-amber-950/20">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="font-medium text-amber-800 dark:text-amber-200">Tổng công nợ cần xử lý</span>
                                        <span className="text-base font-semibold text-amber-900 dark:text-amber-100">{formatCurrency(totalOutstanding)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-4 flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-violet-500" />
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Đánh giá lại tài sản trong phòng</h4>
                        </div>

                        {roomEquipment.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                Phòng này chưa có tài sản gắn riêng để đánh giá lại.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {roomEquipment.map(item => (
                                    <div key={item.id} className="grid gap-3 rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-700 sm:grid-cols-[1.2fr_0.8fr] sm:items-center">
                                        <div>
                                            <div className="font-medium text-slate-900 dark:text-white">{item.name}</div>
                                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                Mã {item.id} · Trạng thái hiện tại: {item.status}
                                            </div>
                                        </div>
                                        <select
                                            value={equipmentAssessments[item.id] || item.status}
                                            onChange={event => setEquipmentAssessments(prev => ({ ...prev, [item.id]: event.target.value as EquipmentStatus }))}
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                        >
                                            {EQUIPMENT_STATUSES.map(status => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 dark:border-rose-900/50 dark:bg-rose-950/20">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-600 dark:text-rose-300" />
                            <div className="text-sm text-rose-700 dark:text-rose-200">
                                <div className="font-semibold">Xác nhận thao tác cuối</div>
                                <div className="mt-2 leading-6">
                                    Sau khi hủy, khách sẽ bị đưa ra khỏi phòng này ngay.
                                    {remainingOccupantCount <= 0
                                        ? ' Vì không còn ai trong phòng, trạng thái phòng sẽ tự chuyển về trống.'
                                        : ` Phòng vẫn còn ${remainingOccupantCount} khách đang ở nên trạng thái phòng sẽ giữ nguyên.`}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/70 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                    >
                        Đóng
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700"
                    >
                        <Trash2 className="h-4 w-4" />
                        Hủy hợp đồng & đưa khách khỏi phòng
                    </button>
                </div>
            </div>
        </div>
    );
}
