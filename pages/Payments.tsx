import React from 'react';
import { CheckCircle, Copy, FileText, HandCoins, LayoutGrid, Link2, List, Loader2, RefreshCw, Search, Send, Settings } from 'lucide-react';
import { formatCurrency, useApp } from '../AppContext';
import BillModal from '../components/BillModalPdf';
import { createHostFinancialSnapshot } from '../utils/hostAnalytics';
import { buildRoomBills, CATEGORY_LABELS } from '../utils/paymentBills';
import { buildHostPaymentWebhookUrl } from '../utils/paymentGateway';
import type { RoomBill } from '../utils/paymentBills';
import { getPaymentRemainingAmount, STATUS_OVERDUE, STATUS_PAID, STATUS_PARTIAL } from '../utils/paymentState';

function getStatusClass(status: string) {
    switch (status) {
        case STATUS_PAID:
            return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-800';
        case STATUS_OVERDUE:
            return 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-800';
        case STATUS_PARTIAL:
            return 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:ring-blue-800';
        default:
            return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-800';
    }
}

export default function Payments() {
    const {
        payments,
        rooms,
        contracts,
        customers,
        buildings,
        equipment,
        currentUser,
        adminSettings,
        markPaymentPaid,
        generateMonthlyPayments,
        sendBulkBills,
        bankInfo,
        updateBankInfo,
        getCurrentHostPaymentGatewayConfig,
        updateCurrentHostPaymentGatewayConfig,
        syncNow,
        isSyncing,
    } = useApp();

    const [viewMode, setViewMode] = React.useState<'card' | 'list'>('card');

    const [searchTerm, setSearchTerm] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [categoryFilter, setCategoryFilter] = React.useState('all');
    const [selectedBill, setSelectedBill] = React.useState<RoomBill | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [tempBankInfo, setTempBankInfo] = React.useState(bankInfo);
    const [tempGatewayConfig, setTempGatewayConfig] = React.useState(() => getCurrentHostPaymentGatewayConfig());
    const [isSavingGateway, setIsSavingGateway] = React.useState(false);
    const [gatewayFeedback, setGatewayFeedback] = React.useState<{ error: string; success: string }>({ error: '', success: '' });

    React.useEffect(() => {
        setTempBankInfo(bankInfo);
        setTempGatewayConfig(getCurrentHostPaymentGatewayConfig());
    }, [bankInfo, getCurrentHostPaymentGatewayConfig]);

    const currentPeriod = `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    const snapshot = React.useMemo(() => createHostFinancialSnapshot({ rooms, contracts, payments, buildings, equipment }), [rooms, contracts, payments, buildings, equipment]);
    const roomBills = React.useMemo(() => buildRoomBills({ payments, contracts, rooms, customers, buildings }), [payments, contracts, rooms, customers, buildings]);

    const filteredBills = React.useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return roomBills.filter(bill => {
            const matchesSearch = !query || bill.searchText.includes(query);
            const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || bill.items.some(item => item.categoryKey === categoryFilter);
            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [roomBills, searchTerm, statusFilter, categoryFilter]);

    const pendingAmount = filteredBills.reduce((sum, bill) => sum + bill.pendingAmount, 0);
    const paidCount = filteredBills.filter(bill => bill.status === STATUS_PAID).length;
    const partialCount = filteredBills.filter(bill => bill.status === STATUS_PARTIAL).length;
    const overdueCount = filteredBills.filter(bill => bill.status === STATUS_OVERDUE).length;

    const webhookUrl = buildHostPaymentWebhookUrl(adminSettings.googleSheetWebhookUrl || '', {
        hostId: currentUser?.id || tempGatewayConfig.hostId,
        provider: tempGatewayConfig.provider,
        webhookToken: tempGatewayConfig.webhookToken,
    });
    const hasRemoteSheet = Boolean(currentUser?.googleSheetId) && !currentUser?.googleSheetId?.startsWith('local_');
    const canUseWebhook = Boolean(adminSettings.googleSheetWebhookUrl?.trim()) && hasRemoteSheet;

    const handleMarkBillPaid = (bill: RoomBill) => {
        Array.from(new Set(bill.pendingPaymentIds)).forEach(paymentId => markPaymentPaid(paymentId));
    };

    const handleCollectPartialPrompt = (bill: RoomBill) => {
        const rawAmount = window.prompt('Nhập số tiền thu lần này', String(Math.max(0, Math.round(bill.pendingAmount))));
        if (!rawAmount) return;
        const requestedAmount = Math.max(0, Math.round(Number(rawAmount.replace(/[^\d.-]/g, ''))));
        if (!requestedAmount) {
            alert('Số tiền không hợp lệ.');
            return;
        }

        const paymentMap = new Map<string, (typeof payments)[number]>(payments.map(payment => [payment.id, payment]));
        let remainingToCollect = Math.min(requestedAmount, bill.pendingAmount);
        Array.from(new Set<string>(bill.pendingPaymentIds)).forEach(paymentId => {
            if (remainingToCollect <= 0) return;
            const payment = paymentMap.get(paymentId);
            if (!payment) return;
            const collectAmount = Math.min(remainingToCollect, getPaymentRemainingAmount(payment));
            if (collectAmount <= 0) return;
            markPaymentPaid(paymentId, collectAmount);
            remainingToCollect -= collectAmount;
        });
    };

    const handleSaveGateway = async (event: React.FormEvent) => {
        event.preventDefault();
        setGatewayFeedback({ error: '', success: '' });

        if (currentUser?.role !== 'HOST') {
            updateBankInfo(tempBankInfo);
            setIsSettingsOpen(false);
            return;
        }

        setIsSavingGateway(true);
        const result = await updateCurrentHostPaymentGatewayConfig({ ...tempGatewayConfig, hostId: currentUser.id, ...tempBankInfo });
        setIsSavingGateway(false);

        if (!result.success) {
            setGatewayFeedback({ error: result.error || 'Không lưu được cấu hình thanh toán.', success: '' });
            return;
        }

        updateBankInfo(tempBankInfo);
        setGatewayFeedback({ error: '', success: 'Đã lưu cấu hình thanh toán.' });
    };

    const handleCopyWebhook = async () => {
        if (!webhookUrl) return;
        try {
            await navigator.clipboard.writeText(webhookUrl);
            setGatewayFeedback({ error: '', success: 'Đã sao chép webhook URL.' });
        } catch (error) {
            console.error('Copy webhook URL failed', error);
            setGatewayFeedback({ error: 'Không sao chép được webhook URL.', success: '' });
        }
    };

    const summaryCards = [
        { label: 'Thu tháng này', value: formatCurrency(snapshot.income.month), helper: 'Doanh thu đã ghi nhận' },
        { label: 'Tổng doanh thu', value: formatCurrency(snapshot.income.total), helper: 'Toàn bộ tiền đã thu' },
        { label: 'Công nợ mở', value: formatCurrency(pendingAmount), helper: `${overdueCount} bill quá hạn` },
        { label: 'Đã thu / một phần', value: `${paidCount}/${partialCount}`, helper: 'Bill đủ và bill đang thu dở' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Thu chi & công nợ</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Bill được gộp theo phòng và hỗ trợ thu một phần.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={() => syncNow()} disabled={isSyncing} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ Google Sheet'}
                    </button>
                    <button type="button" onClick={() => setIsSettingsOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                        <Settings className="h-4 w-4" />
                        Tài khoản nhận tiền
                    </button>
                    <button type="button" onClick={() => sendBulkBills(currentPeriod)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300">
                        <Send className="h-4 w-4" />
                        Gửi bill loạt
                    </button>
                    <button type="button" onClick={() => generateMonthlyPayments()} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20">
                        Tạo phiếu thu tháng
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map(card => (
                    <div key={card.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{card.label}</div>
                        <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{card.value}</div>
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{card.helper}</div>
                    </div>
                ))}
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="grid gap-3 xl:grid-cols-[1.15fr_0.55fr_0.55fr]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input type="text" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Tìm theo mã bill, phòng, khách thuê, khoản thu..." className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                    </div>
                    <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="Chờ thanh toán">Chờ thanh toán</option>
                        <option value={STATUS_PARTIAL}>{STATUS_PARTIAL}</option>
                        <option value="Quá hạn">Quá hạn</option>
                        <option value="Đã đóng">Đã đóng</option>
                    </select>
                    <select value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                        <option value="all">Tất cả nhóm thu</option>
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2 lg:hidden">
                    <button type="button" onClick={() => setViewMode('card')} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${viewMode === 'card' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Dạng card">
                        <LayoutGrid className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={() => setViewMode('list')} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${viewMode === 'list' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`} title="Dạng danh sách">
                        <List className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className={`grid gap-4 lg:hidden ${viewMode !== 'card' ? 'hidden' : ''}`}>
                {filteredBills.map(bill => (
                    <article key={bill.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-start justify-between gap-3">
                            <div><div className="text-lg font-semibold text-slate-900 dark:text-white">{bill.roomLabel}</div><div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{bill.id}</div></div>
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(bill.status)}`}>{bill.status}</span>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                            <div className="font-medium text-slate-900 dark:text-white">Bill trọ tháng {bill.period}</div>
                            <div>Khách thuê: {bill.customers.map(customer => customer.name).join(', ') || 'Chưa có dữ liệu'}</div>
                            <div>Tổng: {formatCurrency(bill.totalAmount)} • {bill.items.length} khoản thu</div>
                            {bill.collectedAmount > 0 && <div>Đã thu: {formatCurrency(bill.collectedAmount)}</div>}
                            {bill.pendingAmount !== bill.totalAmount && <div>Còn thu: {formatCurrency(bill.pendingAmount)}</div>}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button type="button" onClick={() => setSelectedBill(bill)} className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><FileText className="h-4 w-4" />Xem phiếu</button>
                            {bill.pendingPaymentIds.length > 0 && <button type="button" onClick={() => handleCollectPartialPrompt(bill)} className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-blue-200 px-5 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50 dark:border-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-950/20"><HandCoins className="h-4 w-4" />Thu một phần</button>}
                            {bill.pendingPaymentIds.length > 0 && <button type="button" onClick={() => handleMarkBillPaid(bill)} className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white"><CheckCircle className="h-4 w-4" />Đã thu</button>}
                        </div>
                    </article>
                ))}
                {filteredBills.length === 0 && <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">Không có bill phòng nào khớp với bộ lọc hiện tại.</div>}
            </div>

            {/* Mobile List View */}
            <div className={`space-y-2 lg:hidden ${viewMode !== 'list' ? 'hidden' : ''}`}>
                {filteredBills.map(bill => (
                    <div key={bill.id} onClick={() => setSelectedBill(bill)} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:bg-slate-50 active:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">
                        <div className="min-w-0 flex-1">
                            <div className="truncate font-semibold text-slate-900 dark:text-white">Bill trọ tháng {bill.period}</div>
                            <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{bill.roomLabel} • {bill.customers.map(c => c.name).join(', ') || 'Chưa có dữ liệu'}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(bill.pendingAmount > 0 ? bill.pendingAmount : bill.totalAmount)}</div>
                            <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${getStatusClass(bill.status)}`}>{bill.status}</span>
                        </div>
                    </div>
                ))}
                {filteredBills.length === 0 && <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">Không có bill phòng nào khớp với bộ lọc hiện tại.</div>}
            </div>

            <div className="hidden overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                            <tr><th className="px-5 py-4">Mã phiếu</th><th className="px-5 py-4">Khoản thu</th><th className="px-5 py-4">Phòng</th><th className="px-5 py-4">Khách thuê</th><th className="px-5 py-4">Kỳ hạn</th><th className="px-5 py-4 text-right">Số tiền</th><th className="px-5 py-4">Trạng thái</th><th className="px-5 py-4 text-right">Thao tác</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredBills.length === 0 ? <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">Không có bill phòng nào khớp với bộ lọc hiện tại.</td></tr> : filteredBills.map(bill => (
                                <tr key={bill.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                    <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">{bill.id}</td>
                                    <td className="px-5 py-4"><div className="font-semibold text-slate-900 dark:text-white">Bill trọ tháng {bill.period}</div><div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{bill.items.length} khoản thu</div></td>
                                    <td className="px-5 py-4 text-slate-700 dark:text-slate-200"><div>{bill.roomLabel}</div><div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{bill.buildingAddress || ''}</div></td>
                                    <td className="px-5 py-4 text-slate-700 dark:text-slate-200"><div>{bill.customers.map(customer => customer.name).join(', ') || 'Chưa có dữ liệu'}</div><div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{bill.customers.length} khách trong phòng</div></td>
                                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300"><div>{bill.period}</div><div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Hạn: {bill.dueDate}</div></td>
                                    <td className="px-5 py-4 text-right"><div className="font-semibold text-slate-900 dark:text-white">{formatCurrency(bill.totalAmount)}</div>{bill.collectedAmount > 0 && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Đã thu {formatCurrency(bill.collectedAmount)}</div>}{bill.pendingAmount !== bill.totalAmount && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Còn thu {formatCurrency(bill.pendingAmount)}</div>}</td>
                                    <td className="px-5 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(bill.status)}`}>{bill.status}</span></td>
                                    <td className="px-5 py-4"><div className="flex items-center justify-end gap-2"><button type="button" onClick={() => setSelectedBill(bill)} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" title="Xem bill"><FileText className="h-4 w-4" /></button>{bill.pendingPaymentIds.length > 0 && <button type="button" onClick={() => handleCollectPartialPrompt(bill)} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-200 text-blue-600 transition hover:bg-blue-50 dark:border-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-950/20" title="Thu một phần"><HandCoins className="h-4 w-4" /></button>}{bill.pendingPaymentIds.length > 0 && <button type="button" onClick={() => handleMarkBillPaid(bill)} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-950/20" title="Đánh dấu đã thu"><CheckCircle className="h-4 w-4" /></button>}</div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedBill && <BillModal bill={selectedBill} onClose={() => setSelectedBill(null)} />}

            {isSettingsOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Tài khoản nhận tiền & webhook</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Cấu hình tài khoản nhận tiền và webhook đối soát tự động.</p>
                        </div>
                        <form onSubmit={handleSaveGateway} className="space-y-5 p-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-3">
                                    <select value={tempGatewayConfig.provider} onChange={event => setTempGatewayConfig(prev => ({ ...prev, provider: event.target.value as typeof prev.provider, providerLabel: event.target.value === 'sepay' ? 'SePay' : event.target.value === 'custom' ? 'Webhook custom' : 'Thu công' }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"><option value="manual">Chỉ nhận tiền thủ công</option><option value="sepay">SePay webhook</option><option value="custom">Webhook trung gian khác</option></select>
                                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700"><span className="text-slate-900 dark:text-white">Bật đối soát tự động</span><input type="checkbox" checked={tempGatewayConfig.enabled} onChange={event => setTempGatewayConfig(prev => ({ ...prev, enabled: event.target.checked }))} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></label>
                                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700"><span className="text-slate-900 dark:text-white">Tự đánh dấu đã thanh toán</span><input type="checkbox" checked={tempGatewayConfig.autoMarkPaid} onChange={event => setTempGatewayConfig(prev => ({ ...prev, autoMarkPaid: event.target.checked }))} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></label>
                                    <input required value={tempBankInfo.bankName} onChange={event => setTempBankInfo(prev => ({ ...prev, bankName: event.target.value }))} placeholder="Ngân hàng" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                    <input required value={tempBankInfo.accountNumber} onChange={event => setTempBankInfo(prev => ({ ...prev, accountNumber: event.target.value }))} placeholder="Số tài khoản" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                    <input required value={tempBankInfo.accountName} onChange={event => setTempBankInfo(prev => ({ ...prev, accountName: event.target.value }))} placeholder="Tên chủ tài khoản" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                </div>
                                <div className="space-y-3">
                                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"><Link2 className="h-4 w-4 text-blue-500" />Webhook URL</div>
                                        <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-300">{tempGatewayConfig.enabled && tempGatewayConfig.provider !== 'manual' ? webhookUrl || 'Hệ thống sẽ tạo URL sau khi lưu cấu hình.' : 'Bật đối soát tự động để hệ thống tạo webhook URL.'}</div>
                                        <div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={handleCopyWebhook} disabled={!webhookUrl} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><Copy className="h-4 w-4" />Sao chép URL</button><div className="rounded-2xl bg-slate-100 px-4 py-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{canUseWebhook ? 'Host đã có Google Sheet thật.' : 'Cần host có Google Sheet thật và admin đã cấu hình Apps Script.'}</div></div>
                                    </div>
                                    {gatewayFeedback.error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">{gatewayFeedback.error}</div>}
                                    {gatewayFeedback.success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">{gatewayFeedback.success}</div>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button type="button" onClick={() => setIsSettingsOpen(false)} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">Hủy</button>
                                <button type="submit" disabled={isSavingGateway} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60">{isSavingGateway && <Loader2 className="h-4 w-4 animate-spin" />}Lưu cài đặt</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
