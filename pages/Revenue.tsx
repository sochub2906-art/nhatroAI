import React from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowLeft, Building2, Download, ExternalLink, ReceiptText, RefreshCw, TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency, useApp } from '../AppContext';
import { createHostFinancialSnapshot } from '../utils/hostAnalytics';

function monthKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(date: Date) {
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function parseDate(value?: string) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export default function Revenue() {
    const { payments, contracts, rooms, buildings, equipment, syncNow, isSyncing, currentUser } = useApp();

    const snapshot = React.useMemo(
        () => createHostFinancialSnapshot({ rooms, contracts, payments, buildings, equipment }),
        [rooms, contracts, payments, buildings, equipment],
    );

    const contractMap = React.useMemo(() => new Map(contracts.map(contract => [contract.id, contract])), [contracts]);
    const roomMap = React.useMemo(() => new Map(rooms.map(room => [room.id, room])), [rooms]);
    const buildingMap = React.useMemo(() => new Map(buildings.map(building => [building.id, building])), [buildings]);

    const monthlyData = React.useMemo(() => {
        const months = Array.from({ length: 12 }, (_, index) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (11 - index));
            return { key: monthKey(date), label: monthLabel(date), income: 0, debt: 0 };
        });
        const monthLookup = new Map(months.map(item => [item.key, item]));

        payments.forEach(payment => {
            const paidDate = parseDate(payment.paidDate || payment.sourceDate || payment.dueDate);
            const dueDate = parseDate(payment.dueDate);
            if (payment.status === 'Đã đóng' && paidDate) {
                const bucket = monthLookup.get(monthKey(paidDate));
                if (bucket) bucket.income += payment.amount;
            }
            if (payment.status !== 'Đã đóng' && dueDate) {
                const bucket = monthLookup.get(monthKey(dueDate));
                if (bucket) bucket.debt += payment.amount;
            }
        });

        return months;
    }, [payments]);

    const roomRevenueRows = React.useMemo(() => {
        const roomTotals = new Map<string, { roomLabel: string; income: number; debt: number; billCount: number }>();

        payments.forEach(payment => {
            const contract = contractMap.get(payment.contractId);
            const room = contract ? roomMap.get(contract.roomId) : undefined;
            const building = room ? buildingMap.get(room.buildingId) : undefined;
            const roomId = room?.id || contract?.roomId || payment.contractId;
            const roomLabel = room ? `${building?.name || 'Tòa nhà'} · ${room.name}` : roomId;

            if (!roomTotals.has(roomId)) {
                roomTotals.set(roomId, { roomLabel, income: 0, debt: 0, billCount: 0 });
            }

            const entry = roomTotals.get(roomId)!;
            entry.billCount += 1;
            if (payment.status === 'Đã đóng') entry.income += payment.amount;
            else entry.debt += payment.amount;
        });

        return Array.from(roomTotals.values()).sort((left, right) => right.income - left.income);
    }, [buildingMap, contractMap, payments, roomMap]);

    const handleDownloadCSV = () => {
        const BOM = '\uFEFF';
        let csvContent = BOM + 'LOẠI DỮ LIỆU,MÃ CỘT,TÊN/PHÒNG,DOANH THU ĐÃ THU,CÔNG NỢ,SỐ BILL\n';

        // Monthly data section
        csvContent += 'DOANH THU THÁNG,,,,,\n';
        monthlyData.forEach(month => {
            csvContent += `THÁNG,${month.key},${month.label},${month.income},${month.debt},\n`;
        });

        // Room revenue section
        csvContent += ',\nDOANH THU PHÒNG,,,,,\n';
        roomRevenueRows.forEach(row => {
            csvContent += `PHÒNG,,${row.roomLabel.replace(/,/g, ' ')},${row.income},${row.debt},${row.billCount}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `SmartRental_DoanhThu_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const summaryCards = [
        { label: 'Thu hôm nay', value: formatCurrency(snapshot.income.day), helper: 'Tiền đã ghi nhận trong ngày', icon: TrendingUp },
        { label: 'Thu tháng này', value: formatCurrency(snapshot.income.month), helper: 'So với công nợ đang mở', icon: ReceiptText },
        { label: 'Thu năm nay', value: formatCurrency(snapshot.income.year), helper: 'Dòng tiền đã thu theo năm', icon: Wallet },
        { label: 'Tổng doanh thu', value: formatCurrency(snapshot.income.total), helper: `${roomRevenueRows.length} phòng có phát sinh`, icon: Building2 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <Link to="/app/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại tổng quan
                    </Link>
                    <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">Doanh thu chi tiết</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Theo dõi doanh thu theo tháng, công nợ mở theo kỳ và hiệu quả từng phòng trên một màn hình riêng.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={() => syncNow()} disabled={isSyncing} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ Google Sheet'}
                    </button>
                    {currentUser?.googleSheetUrl && (
                        <a href={currentUser.googleSheetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                            <ExternalLink className="h-4 w-4" />
                            Mở Google Sheet
                        </a>
                    )}
                    <button type="button" onClick={() => handleDownloadCSV()} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                        <Download className="h-4 w-4" />
                        Tải xuống CSV
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map(card => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">{card.label}</div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{card.value}</div>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{card.helper}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Doanh thu 12 tháng gần nhất</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Hiển thị tiền đã thu và công nợ phát sinh theo từng tháng.</p>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                                <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}tr`} tickLine={false} axisLine={false} fontSize={12} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Bar dataKey="income" name="Đã thu" radius={[8, 8, 0, 0]} fill="#2563eb" />
                                <Bar dataKey="debt" name="Công nợ mở" radius={[8, 8, 0, 0]} fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Doanh thu theo loại</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Dựa trên các khoản thu đã chốt thanh toán.</p>
                    </div>
                    <div className="space-y-3">
                        {snapshot.income.byCategory.map(item => (
                            <div key={item.key} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(item.amount)}</div>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${snapshot.income.total === 0 ? 0 : Math.max(8, (item.amount / snapshot.income.total) * 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Phòng có doanh thu cao</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Tổng hợp theo toàn bộ khoản thu đã đóng của từng phòng.</p>
                    </div>
                    <div className="space-y-3">
                        {roomRevenueRows.slice(0, 10).map(entry => (
                            <div key={entry.roomLabel} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/80">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-medium text-slate-900 dark:text-white">{entry.roomLabel}</div>
                                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{entry.billCount} khoản thu phát sinh</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-slate-900 dark:text-white">{formatCurrency(entry.income)}</div>
                                        <div className="mt-1 text-xs text-amber-600 dark:text-amber-300">Nợ mở: {formatCurrency(entry.debt)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Chi phí theo loại</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Giữ lại cùng màn để so doanh thu với chi phí vận hành.</p>
                    </div>
                    <div className="space-y-3">
                        {snapshot.expense.byCategory.map(item => (
                            <div key={item.key} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(item.amount)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
