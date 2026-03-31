import React from 'react';
import { useApp, formatCurrency } from '../AppContext';
import { Link } from 'react-router-dom';
import {
    Users, Building, TrendingUp, AlertTriangle,
    ArrowRight, UserPlus, ShieldCheck, CreditCard, Sparkles, AlertCircle
} from 'lucide-react';
import HostDetailModal from '../components/HostDetailModal';
import { formatDateVN } from '../utils/dateFormat';

export default function AdminDashboard() {
    const { allUsers, buildings, rooms, contracts, hostPayments, leads, proposals, pricingTiers, addUser, updateProposalStatus } = useApp();
    const [selectedHostId, setSelectedHostId] = React.useState<string | null>(null);

    const hosts = allUsers.filter(u => u.role === 'HOST');
    const salesUsers = allUsers.filter(u => u.role === 'SALES');
    const tenantUsers = allUsers.filter(u => u.role === 'TENANT');
    const pendingUsers = allUsers.filter(u => u.status === 'pending');

    const totalHostRevenue = hostPayments.filter(p => p.status === 'Đã đóng').reduce((sum, p) => sum + p.amount, 0);
    const totalHostDebt = hostPayments.filter(p => p.status !== 'Đã đóng').reduce((sum, p) => sum + p.amount, 0);
    const activeContracts = contracts.filter(c => c.isActive).length;
    const occupiedRooms = rooms.filter(r => r.status === 'Đang ở').length;

    // Calculate pending reminders (<= 7 days)
    const pendingReminders = hostPayments.filter(p => {
        if (p.status === 'Đã đóng') return false;
        const diffDays = (new Date(p.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const stats = [
        { label: 'Hosts', value: hosts.length, icon: Building, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600', iconColor: 'text-blue-500' },
        { label: 'Sales', value: salesUsers.length, icon: Users, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600', iconColor: 'text-amber-500' },
        { label: 'Người thuê', value: tenantUsers.length, icon: Users, color: 'bg-green-50 dark:bg-green-900/20 text-green-600', iconColor: 'text-green-500' },
        { label: 'Tòa nhà', value: buildings.length, icon: Building, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600', iconColor: 'text-purple-500' },
        { label: 'Phòng (đang ở)', value: `${occupiedRooms}/${rooms.length}`, icon: TrendingUp, color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600', iconColor: 'text-teal-500' },
        { label: 'Doanh thu PM', value: formatCurrency(totalHostRevenue), icon: CreditCard, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600', iconColor: 'text-emerald-500' },
    ];

    const handleApproveProposal = async (p: any) => {
        const defaultPassword = prompt(
            `Nhập mật khẩu khởi tạo cho Host "${p.hostName}" (tối thiểu 6 ký tự):`,
            ''
        );
        if (!defaultPassword || defaultPassword.length < 6) {
            alert('Mật khẩu phải có tối thiểu 6 ký tự. Vui lòng thử lại.');
            return;
        }
        const newUser = await addUser({
            name: p.hostName,
            email: `host_${p.id}@smart.vn`,
            phone: 'Chưa có',
            role: 'HOST',
            status: 'active',
            subscriptionPlanId: p.subscriptionPlanId || '',
            defaultPassword
        });
        if (newUser) {
            updateProposalStatus(p.id, 'approved');
            alert(`Đã tạo tài khoản Host thành công!\nEmail: host_${p.id}@smart.vn\nMật khẩu: ${defaultPassword}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="text-red-500" /> Tổng quan hệ thống</h1>
                {pendingUsers.length > 0 && (
                    <Link to="/admin/users" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm font-medium border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
                        <AlertTriangle size={14} /> {pendingUsers.length} user chờ duyệt
                    </Link>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className={`p-4 rounded-2xl ${s.color} border border-slate-100 dark:border-slate-800`}>
                            <Icon size={18} className={`${s.iconColor} mb-2`} />
                            <p className="text-2xl font-bold">{s.value}</p>
                            <p className="text-[11px] text-slate-500 uppercase font-medium">{s.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Hosts */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2"><Building size={16} className="text-blue-500" /> Hosts</h3>
                        <Link to="/admin/hosts" className="text-xs text-blue-500 hover:underline flex items-center gap-1">Xem tất cả <ArrowRight size={12} /></Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {hosts.slice(0, 5).map(h => {
                            const plan = pricingTiers.find(p => p.id === h.subscriptionPlanId);
                            return (
                                <div key={h.id} onClick={() => setSelectedHostId(h.id)} className="p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{h.avatar}</div>
                                    <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">{h.name}</p><p className="text-xs text-slate-500">{h.email}</p></div>
                                    {plan && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium whitespace-nowrap">{plan.name}</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leads */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold flex items-center gap-2"><UserPlus size={16} className="text-purple-500" /> Leads gần đây <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold px-2 py-0.5 rounded-full">{leads.length}</span></h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {leads.slice(0, 5).map(l => (
                            <div key={l.id} className="p-4">
                                <p className="font-medium text-sm">{l.customerName}</p>
                                <p className="text-xs text-slate-500">{l.phone} — {l.needs}</p>
                                        <p className="text-xs text-slate-400 mt-1">{formatDateVN(l.createdAt, l.createdAt)}</p>
                            </div>
                        ))}
                        {leads.length === 0 && <p className="p-6 text-center text-sm text-slate-400">Chưa có lead nào.</p>}
                    </div>
                </div>

                {/* Proposals & Debt */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 max-h-[300px] overflow-y-auto">
                        <h3 className="font-bold flex items-center gap-2 mb-3"><ShieldCheck size={16} className="text-green-500" /> Đề xuất từ Sales</h3>
                        {proposals.filter(p => p.status === 'pending').map(p => (
                            <div key={p.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-2 border border-slate-100 dark:border-slate-700">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{p.hostName}</p>
                                <p className="text-xs text-slate-500 mb-2">{p.buildingCount} tòa, {p.roomCount} phòng {p.subscriptionPlanId && `• Gói: ${pricingTiers.find(t => t.id === p.subscriptionPlanId)?.name || '?'}`}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => updateProposalStatus(p.id, 'rejected')} className="flex-1 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">Từ chối</button>
                                    <button onClick={() => handleApproveProposal(p)} className="flex-1 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-bold hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40">Duyệt & Tạo Host</button>
                                </div>
                            </div>
                        ))}
                        {proposals.filter(p => p.status === 'pending').length === 0 && <p className="text-sm text-slate-400 italic">Chưa có đề xuất chờ duyệt</p>}
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-5 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 text-red-700 dark:text-red-400 mb-2"><AlertTriangle size={16} /> Công nợ Host</h3>
                        <p className="text-3xl font-extrabold text-red-600 mb-4">{formatCurrency(totalHostDebt)}</p>

                        {/* 7-Day Payment Reminders (Dynamic UI section) */}
                        {pendingReminders.length > 0 ? (
                            <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-900/50">
                                <h4 className="font-bold text-xs uppercase tracking-wider text-red-700/80 dark:text-red-400 mb-3 flex items-center gap-1.5"><AlertCircle size={14} /> Cảnh báo quá hạn/sắp hạn</h4>
                                <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                                    {pendingReminders.map(p => {
                                        const h = hosts.find(host => host.id === p.hostId);
                                        if (!h) return null;
                                        const diffDays = Math.ceil((new Date(p.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                        const statusColor = diffDays < 0 ? 'text-rose-600 bg-rose-100 dark:bg-rose-900/30' : 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';

                                        return (
                                            <div key={p.id} onClick={() => setSelectedHostId(h.id)} className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all group border border-red-100 dark:border-red-900/30">
                                                <div className="min-w-0 pr-2">
                                                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm group-hover:text-red-600 transition-colors truncate">{h.name}</div>
                                                    <div className="text-[11px] text-slate-500 mt-1">{formatCurrency(p.amount)}</div>
                                                </div>
                                                <div className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${statusColor}`}>
                                                    {diffDays < 0 ? `Trễ ${Math.abs(diffDays)} ngày` : `Còn ${diffDays} ngày`}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-red-600/60 font-medium">Không có hóa đơn trễ/sắp tới hạn (7 ngày).</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals area */}
            {selectedHostId && <HostDetailModal hostId={selectedHostId} onClose={() => setSelectedHostId(null)} />}
        </div>
    );
}
