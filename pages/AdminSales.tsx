import React, { useState } from 'react';
import { useApp, formatCurrency } from '../AppContext';
import { Users, TrendingUp, ArrowRight, ShieldCheck, CheckCircle, Clock, XCircle, ChevronRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateVN } from '../utils/dateFormat';

export default function AdminSales() {
    const { allUsers, leads, proposals, hostPayments, pricingTiers } = useApp();
    const salesUsers = allUsers.filter(u => u.role === 'SALES');

    const [selectedSalesId, setSelectedSalesId] = useState<string | null>(salesUsers.length > 0 ? salesUsers[0].id : null);

    // Calculate overall stats for Sales
    const totalLeads = leads.length;
    const totalConvertedLeads = leads.filter(l => l.status === 'converted').length;
    const totalProposals = proposals.length;
    const totalApprovedProposals = proposals.filter(p => p.status === 'approved').length;

    const selectedSales = salesUsers.find(s => s.id === selectedSalesId);

    // Stats for selected sales
    const salesLeads = selectedSales ? leads.filter(l => l.assignedSalesId === selectedSales.id) : [];
    const salesProposals = selectedSales ? proposals.filter(p => p.salesUserId === selectedSales.id) : [];

    const salesHosts = selectedSales?.assignedHostIds?.map(id => allUsers.find(u => u.id === id)).filter(Boolean) || [];

    // Revenue handled by this sales
    const salesHostPayments = hostPayments.filter(p => salesHosts.some(h => h?.id === p.hostId));
    const salesRevenue = salesHostPayments.filter(p => p.status === 'Đã đóng').reduce((s, p) => s + p.amount, 0);

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <h1 className="text-2xl font-bold flex items-center gap-2"><Briefcase size={24} className="text-amber-500" /> Quản lý Đội Sales</h1>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center"><Users size={20} /></div>
                    <div><p className="text-2xl font-bold">{salesUsers.length}</p><p className="text-xs text-slate-500 font-medium">Nhân sự Sales</p></div>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center"><TrendingUp size={20} /></div>
                    <div><p className="text-2xl font-bold">{totalLeads}</p><p className="text-xs text-slate-500 font-medium">Tổng số Leads</p></div>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center"><CheckCircle size={20} /></div>
                    <div><p className="text-2xl font-bold">{totalConvertedLeads}</p><p className="text-xs text-slate-500 font-medium">Leads chốt thành công</p></div>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center"><ShieldCheck size={20} /></div>
                    <div><p className="text-2xl font-bold">{totalApprovedProposals}/{totalProposals}</p><p className="text-xs text-slate-500 font-medium">Đề xuất được duyệt</p></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sales List Sidebar */}
                <div className="lg:col-span-1 space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Danh sách Nhân Viên</h2>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                        {salesUsers.map(s => (
                            <div
                                key={s.id}
                                onClick={() => setSelectedSalesId(s.id)}
                                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${selectedSalesId === s.id ? 'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-l-amber-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-l-transparent'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">{s.avatar}</div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium text-sm truncate ${selectedSalesId === s.id ? 'text-amber-700 dark:text-amber-400' : ''}`}>{s.name}</p>
                                    <p className="text-xs text-slate-500">{s.phone}</p>
                                </div>
                            </div>
                        ))}
                        {salesUsers.length === 0 && <p className="p-4 text-center text-sm text-slate-500">Chưa có Sales</p>}
                    </div>
                </div>

                {/* Sales Detail View */}
                {selectedSales ? (
                    <div className="lg:col-span-3 space-y-6">
                        {/* Profile Header */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold">{selectedSales.avatar}</div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedSales.name}</h2>
                                    <p className="text-sm text-slate-500">{selectedSales.email} • {selectedSales.phone}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-center border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Leads Quản Lý</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{salesLeads.length}</p>
                                </div>
                                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-center border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Hosts Chăm Sóc</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{salesHosts.length}</p>
                                </div>
                                <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center border border-amber-200 dark:border-amber-800/50">
                                    <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold">Doanh Thu Kéo Về</p>
                                    <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{formatCurrency(salesRevenue)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Leads & Proposals Grids */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Performance: Leads */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="font-bold flex items-center gap-2"><Users size={16} className="text-blue-500" /> Tình trạng Cài đặt Leads</h3>
                                </div>
                                <div className="p-4 flex-1 overflow-y-auto max-h-[350px] custom-scrollbar space-y-3">
                                    {salesLeads.length > 0 ? salesLeads.map(l => (
                                        <div key={l.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="font-medium text-sm text-slate-900 dark:text-white">{l.customerName}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${l.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                                        l.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                                                            l.status === 'converted' ? 'bg-green-100 text-green-700' :
                                                                'bg-red-100 text-red-700'
                                                    }`}>
                                                    {l.status === 'new' ? 'Mới' : l.status === 'contacted' ? 'Đã liên hệ' : l.status === 'converted' ? 'Thành công' : 'Đã mất'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">{l.needs}</p>
                                        <p className="text-[10px] text-slate-400 mt-2 font-mono">{formatDateVN(l.createdAt, l.createdAt)}</p>
                                        </div>
                                    )) : <p className="text-sm text-slate-500 text-center mt-6">Chưa có Lead nào được chia.</p>}
                                </div>
                            </div>

                            {/* Performance: Proposals */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="font-bold flex items-center gap-2"><ShieldCheck size={16} className="text-purple-500" /> Đề xuất Host (Proposals)</h3>
                                </div>
                                <div className="p-4 flex-1 overflow-y-auto max-h-[350px] custom-scrollbar space-y-3">
                                    {salesProposals.length > 0 ? salesProposals.map(p => (
                                        <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="font-medium text-sm text-slate-900 dark:text-white">{p.hostName}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        p.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {p.status === 'pending' ? 'Chờ duyệt' : p.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">{p.buildingCount} tòa - {p.roomCount} phòng</p>
                                            {p.subscriptionPlanId && <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">Gói: {pricingTiers.find(t => t.id === p.subscriptionPlanId)?.name}</p>}
                                            {p.notes && <p className="text-[11px] text-slate-500 mt-2 italic bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">" {p.notes} "</p>}
                                        </div>
                                    )) : <p className="text-sm text-slate-500 text-center mt-6">Sales này chưa gửi đề xuất nào.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-3 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 p-12">
                        Vui lòng chọn một nhân sự Sales ở danh sách bên trái để xem chi tiết.
                    </div>
                )}
            </div>
        </div>
    );
}
