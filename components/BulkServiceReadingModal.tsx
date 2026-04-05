import React from 'react';
import { ArrowLeft, ArrowRight, Bolt, Droplets, ReceiptText, Save, X } from 'lucide-react';
import { formatCurrency, useApp } from '../AppContext';
import { compareBillingPeriods, getNextBillingPeriod, getPreviousBillingPeriod } from '../utils/billingPeriods';
import { getCurrentBillingPeriod } from '../utils/contractStatus';
import { getActiveContractsForRoom, getRoomOccupants } from '../utils/roomOccupancy';

interface BulkServiceReadingModalProps {
    onClose: () => void;
}

type DraftRow = {
    roomId: string;
    roomName: string;
    buildingName: string;
    floor: number;
    occupants: string;
    electricPrice: number;
    waterPrice: number;
    electricOld: number;
    electricNew: number;
    waterOld: number;
    waterNew: number;
    internetCost: number;
    otherCost: number;
    electricBillingType?: 'meter' | 'fixed';
    waterBillingType?: 'meter' | 'fixed';
};

function normalizeNumber(value: number): number {
    return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

function sortRooms(left: DraftRow, right: DraftRow): number {
    return (
        left.buildingName.localeCompare(right.buildingName, 'vi') ||
        left.floor - right.floor ||
        left.roomName.localeCompare(right.roomName, 'vi')
    );
}

export default function BulkServiceReadingModal({ onClose }: BulkServiceReadingModalProps) {
    const {
        rooms,
        buildings,
        contracts,
        customers,
        serviceRecords,
        addServiceRecord,
        generateMonthlyPayments,
    } = useApp();

    const buildingById = React.useMemo(
        () => new Map(buildings.map(building => [building.id, building])),
        [buildings],
    );

    const defaultPeriod = React.useMemo(() => {
        const currentPeriod = getCurrentBillingPeriod();
        const activeRoomIds = rooms.filter(room => getActiveContractsForRoom(room.id, contracts).length > 0).map(room => room.id);
        if (activeRoomIds.length === 0) return currentPeriod;

        const hasCurrentCoverage = activeRoomIds.every(roomId =>
            serviceRecords.some(record => record.roomId === roomId && record.month === currentPeriod),
        );

        return hasCurrentCoverage ? getNextBillingPeriod(currentPeriod) : currentPeriod;
    }, [contracts, rooms, serviceRecords]);

    const [period, setPeriod] = React.useState(defaultPeriod);

    React.useEffect(() => {
        setPeriod(defaultPeriod);
    }, [defaultPeriod]);

    const sortedRooms = React.useMemo(() => {
        return rooms
            .map(room => {
                const building = buildingById.get(room.buildingId);
                const roomContracts = getActiveContractsForRoom(room.id, contracts);
                const referenceContract = roomContracts[0];
                const occupants = getRoomOccupants(room.id, contracts, customers)
                    .map(entry => entry.customer.name)
                    .join(', ');

                return {
                    roomId: room.id,
                    roomName: room.name,
                    buildingName: building?.name || 'Chưa gắn tòa nhà',
                    floor: room.floor,
                    occupants: occupants || 'Chưa có khách',
                    electricPrice: referenceContract?.electricPrice || 0,
                    waterPrice: referenceContract?.waterPrice || 0,
                    electricOld: 0,
                    electricNew: 0,
                    waterOld: 0,
                    waterNew: 0,
                    internetCost: referenceContract?.internetPrice || 0,
                    otherCost: 0,
                    electricBillingType: referenceContract?.electricBillingType || 'meter',
                    waterBillingType: referenceContract?.waterBillingType || 'meter',
                } satisfies DraftRow;
            })
            .sort(sortRooms);
    }, [buildingById, contracts, customers, rooms]);

    const buildDraftRows = React.useCallback((targetPeriod: string): DraftRow[] => {
        return sortedRooms.map(room => {
            const currentRecord = serviceRecords
                .filter(record => record.roomId === room.roomId && record.month === targetPeriod)
                .sort((left, right) => new Date(right.recordedAt || 0).getTime() - new Date(left.recordedAt || 0).getTime())[0];

            const previousRecord = serviceRecords
                .filter(record => record.roomId === room.roomId && compareBillingPeriods(record.month, targetPeriod) < 0)
                .sort((left, right) => compareBillingPeriods(right.month, left.month))[0];

            const electricOld = normalizeNumber(
                currentRecord?.electricOldReading
                    ?? previousRecord?.electricNewReading
                    ?? previousRecord?.electricOldReading
                    ?? 0,
            );
            const waterOld = normalizeNumber(
                currentRecord?.waterOldReading
                    ?? previousRecord?.waterNewReading
                    ?? previousRecord?.waterOldReading
                    ?? 0,
            );
            const electricNew = normalizeNumber(
                currentRecord?.electricNewReading
                    ?? (electricOld + (currentRecord?.electricUsage || 0)),
            );
            const waterNew = normalizeNumber(
                currentRecord?.waterNewReading
                    ?? (waterOld + (currentRecord?.waterUsage || 0)),
            );

            return {
                ...room,
                electricOld,
                electricNew: Math.max(electricOld, electricNew),
                waterOld,
                waterNew: Math.max(waterOld, waterNew),
                internetCost: normalizeNumber(currentRecord?.internetCost ?? room.internetCost),
                otherCost: normalizeNumber(currentRecord?.otherCost ?? 0),
                electricBillingType: room.electricBillingType,
                waterBillingType: room.waterBillingType,
            };
        });
    }, [serviceRecords, sortedRooms]);

    const [draftRows, setDraftRows] = React.useState<DraftRow[]>(() => buildDraftRows(defaultPeriod));

    React.useEffect(() => {
        setDraftRows(buildDraftRows(period));
    }, [buildDraftRows, period]);

    const totals = React.useMemo(() => {
        return draftRows.reduce(
            (sum, row) => {
                const electricUsage = row.electricBillingType === 'fixed' ? 0 : Math.max(0, row.electricNew - row.electricOld);
                const waterUsage = row.waterBillingType === 'fixed' ? 0 : Math.max(0, row.waterNew - row.waterOld);
                
                const calcElectric = row.electricBillingType === 'fixed' ? row.electricPrice : (electricUsage * row.electricPrice);
                const calcWater = row.waterBillingType === 'fixed' ? row.waterPrice : (waterUsage * row.waterPrice);
                const total = calcElectric + calcWater + row.internetCost + row.otherCost;

                return {
                    electricUsage: sum.electricUsage + electricUsage,
                    waterUsage: sum.waterUsage + waterUsage,
                    totalCost: sum.totalCost + total,
                };
            },
            { electricUsage: 0, waterUsage: 0, totalCost: 0 },
        );
    }, [draftRows]);

    const updateRow = (roomId: string, patch: Partial<DraftRow>) => {
        setDraftRows(prev => prev.map(row => row.roomId === roomId ? { ...row, ...patch } : row));
    };

    const persistRows = (createBillsAfterSave: boolean) => {
        draftRows.forEach(row => {
            const electricUsage = row.electricBillingType === 'fixed' ? 0 : Math.max(0, row.electricNew - row.electricOld);
            const waterUsage = row.waterBillingType === 'fixed' ? 0 : Math.max(0, row.waterNew - row.waterOld);
            
            const calcElectric = row.electricBillingType === 'fixed' ? row.electricPrice : (electricUsage * row.electricPrice);
            const calcWater = row.waterBillingType === 'fixed' ? row.waterPrice : (waterUsage * row.waterPrice);
            const totalCost = calcElectric + calcWater + row.internetCost + row.otherCost;

            addServiceRecord({
                id: `SV_${row.roomId}_${period.replace(/\//g, '_')}`,
                roomId: row.roomId,
                month: period,
                electricOldReading: row.electricOld,
                electricNewReading: row.electricNew,
                electricUsage,
                waterOldReading: row.waterOld,
                waterNewReading: row.waterNew,
                waterUsage,
                internetCost: row.internetCost,
                otherCost: row.otherCost,
                totalCost,
                recordedAt: new Date().toISOString(),
            });
        });

        if (createBillsAfterSave) {
            generateMonthlyPayments(period);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
            <div className="flex max-h-[94vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Ghi chỉ số điện nước theo lô</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Nhập chỉ số cũ và mới cho toàn bộ phòng. Hệ thống tự tính chênh lệch và nhân với đơn giá hợp đồng.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 overflow-y-auto px-6 py-5">
                    <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto_auto]">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
                            <div className="text-sm text-slate-500 dark:text-slate-400">Kỳ ghi số</div>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPeriod(getPreviousBillingPeriod(period))}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Kỳ trước
                                </button>
                                <input
                                    value={period}
                                    onChange={event => setPeriod(event.target.value)}
                                    className="min-w-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-medium outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPeriod(getNextBillingPeriod(period))}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                >
                                    Kỳ sau
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Bolt className="h-4 w-4 text-amber-500" />
                                Điện tiêu thụ
                            </div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{totals.electricUsage}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">kWh</div>
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Droplets className="h-4 w-4 text-sky-500" />
                                Nước tiêu thụ
                            </div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{totals.waterUsage}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">m³</div>
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <ReceiptText className="h-4 w-4 text-blue-500" />
                                Tổng dự tính
                            </div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{formatCurrency(totals.totalCost)}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Toàn bộ phòng trong lô</div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
                        <div className="overflow-x-auto">
                            <table className="min-w-[1280px] w-full text-left">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3">Tòa nhà / phòng</th>
                                        <th className="px-4 py-3">Khách đang ở</th>
                                        <th className="px-4 py-3">Điện cũ</th>
                                        <th className="px-4 py-3">Điện mới</th>
                                        <th className="px-4 py-3">Điện tiêu thụ</th>
                                        <th className="px-4 py-3">Nước cũ</th>
                                        <th className="px-4 py-3">Nước mới</th>
                                        <th className="px-4 py-3">Nước tiêu thụ</th>
                                        <th className="px-4 py-3">Internet</th>
                                        <th className="px-4 py-3">Phí khác</th>
                                        <th className="px-4 py-3 text-right">Tổng tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950">
                                    {draftRows.map(row => {
                                        const electricUsage = Math.max(0, row.electricNew - row.electricOld);
                                        const waterUsage = Math.max(0, row.waterNew - row.waterOld);
                                        const total = electricUsage * row.electricPrice + waterUsage * row.waterPrice + row.internetCost + row.otherCost;

                                        return (
                                            <tr key={row.roomId} className="align-top">
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold text-slate-900 dark:text-white">{row.buildingName}</div>
                                                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                                        Phòng {row.roomName} · Tầng {row.floor}
                                                    </div>
                                                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                        Điện: {row.electricBillingType === 'fixed' ? 'Khoán' : formatCurrency(row.electricPrice)} · 
                                                        Nước: {row.waterBillingType === 'fixed' ? 'Khoán' : formatCurrency(row.waterPrice)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{row.occupants}</td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        disabled={row.electricBillingType === 'fixed'}
                                                        value={row.electricOld}
                                                        onChange={event => updateRow(row.roomId, { electricOld: normalizeNumber(Number(event.target.value)), electricNew: Math.max(normalizeNumber(Number(event.target.value)), row.electricNew) })}
                                                        className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="number"
                                                        min={row.electricOld}
                                                        disabled={row.electricBillingType === 'fixed'}
                                                        value={row.electricNew}
                                                        onChange={event => updateRow(row.roomId, { electricNew: Math.max(row.electricOld, normalizeNumber(Number(event.target.value))) })}
                                                        className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold text-slate-900 dark:text-white">{row.electricBillingType === 'fixed' ? 'Khoán' : electricUsage}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{formatCurrency(row.electricBillingType === 'fixed' ? row.electricPrice : (electricUsage * row.electricPrice))}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        disabled={row.waterBillingType === 'fixed'}
                                                        value={row.waterOld}
                                                        onChange={event => updateRow(row.roomId, { waterOld: normalizeNumber(Number(event.target.value)), waterNew: Math.max(normalizeNumber(Number(event.target.value)), row.waterNew) })}
                                                        className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="number"
                                                        min={row.waterOld}
                                                        disabled={row.waterBillingType === 'fixed'}
                                                        value={row.waterNew}
                                                        onChange={event => updateRow(row.roomId, { waterNew: Math.max(row.waterOld, normalizeNumber(Number(event.target.value))) })}
                                                        className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold text-slate-900 dark:text-white">{row.waterBillingType === 'fixed' ? 'Khoán' : waterUsage}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{formatCurrency(row.waterBillingType === 'fixed' ? row.waterPrice : (waterUsage * row.waterPrice))}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={row.internetCost}
                                                        onChange={event => updateRow(row.roomId, { internetCost: normalizeNumber(Number(event.target.value)) })}
                                                        className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={row.otherCost}
                                                        onChange={event => updateRow(row.roomId, { otherCost: normalizeNumber(Number(event.target.value)) })}
                                                        className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="font-semibold text-slate-900 dark:text-white">{formatCurrency(total)}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        {row.electricBillingType === 'fixed' || row.waterBillingType === 'fixed' ? 'Bao gồm tiền khoán' : 'Tự tính theo chênh lệch'}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                    >
                        Đóng
                    </button>
                    <button
                        type="button"
                        onClick={() => persistRows(false)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-blue-700 shadow-sm dark:border-blue-900/40 dark:bg-slate-950 dark:text-blue-300"
                    >
                        <Save className="h-4 w-4" />
                        Lưu chỉ số theo lô
                    </button>
                    <button
                        type="button"
                        onClick={() => persistRows(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20"
                    >
                        <ReceiptText className="h-4 w-4" />
                        Lưu và tạo bill kỳ này
                    </button>
                </div>
            </div>
        </div>
    );
}
