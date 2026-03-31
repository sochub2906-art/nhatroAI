import React, { useState } from 'react';
import { useApp, formatCurrency } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingBag, Plus, Users, Building, FileText, CheckCircle, Clock, XCircle,
    ChevronRight, LogOut, Moon, Sun, Sparkles, Phone, MessageSquare, AlertCircle
} from 'lucide-react';
import HostDetailModal from '../components/HostDetailModal';

export default function SalesDashboard() {
    const { currentUser, leads, proposals, allUsers, buildings, rooms, contracts, addUser, updateUser, updateLeadStatus, theme, toggleTheme, logout, hostPayments, pricingTiers } = useApp();
    const navigate = useNavigate();
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
    const [hostForm, setHostForm] = useState({ name: '', email: '', phone: '', defaultPassword: '', subscriptionPlanId: '' });

    if (!currentUser || currentUser.role !== 'SALES') {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Không có quyền truy cập.</div>;
    }

    // Hosts managed by this sales user
    const myHostIds = currentUser.assignedHostIds || [];
    const myHosts = allUsers.filter(u => u.role === 'HOST' && myHostIds.includes(u.id));
    const myBuildings = buildings.filter(b => myHostIds.some(hid => {
        const host = allUsers.find(u => u.id === hid);
        return host?.managedBuildingIds?.includes(b.id);
    }));
    const myLeads = leads.filter(l => !l.assignedSalesId || l.assignedSalesId === currentUser.id);

    const totalRooms = myBuildings.reduce((s, b) => s + rooms.filter(r => r.buildingId === b.id).length, 0);
    const activeContracts = contracts.filter(c => c.isActive && rooms.some(r => r.id === c.roomId && myBuildings.some(b => b.id === r.buildingId)));

    const myHostPayments = hostPayments.filter(hp => myHostIds.includes(hp.hostId));
    const hostRevenue = myHostPayments.filter(hp => hp.status === 'Đã đóng').reduce((sum, hp) => sum + hp.amount, 0);
    const hostDebt = myHostPayments.filter(hp => hp.status !== 'Đã đóng').reduce((sum, hp) => sum + hp.amount, 0);

    // Calculate pending reminders (<= 7 days)
    const pendingReminders = myHostPayments.filter(p => {
        if (p.status === 'Đã đóng') return false;
        const diffDays = (new Date(p.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const handleSubmitHost = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!hostForm.defaultPassword) {
            alert("Vui lòng nhập mật khẩu khởi tạo cho Host mới.");
            return;
        }

        const newUserReq = {
            name: hostForm.name,
            email: hostForm.email,
            phone: hostForm.phone,
            role: 'HOST' as const,
            status: 'active' as const,
            subscriptionPlanId: hostForm.subscriptionPlanId,
            defaultPassword: hostForm.defaultPassword,
            avatar: hostForm.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        };

        const newUser = await addUser(newUserReq);
        if (newUser) {
            // Auto-assign to this sales person
            updateUser({
                ...currentUser,
                assignedHostIds: [...myHostIds, newUser.id]
            });
            alert("Tạo Host thành công!");
        }
        setShowProposalModal(false);
        setHostForm({ name: '', email: '', phone: '', defaultPassword: '', subscriptionPlanId: '' });
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const statusIcon = (s: string) => {
        if (s === 'new') return <Clock className="w-4 h-4 text-blue-500" />;
        if (s === 'contacted') return <Phone className="w-4 h-4 text-amber-500" />;
        if (s === 'converted') return <CheckCircle className="w-4 h-4 text-green-500" />;
        return <XCircle className="w-4 h-4 text-red-500" />;
    };

    const statusLabel: Record<string, string> = { new: 'Mới', contacted: 'Đã liên hệ', converted: 'Đã chuyển đổi', lost: 'Đã mất' };
    const statusStyle: Record<string, string> = {
        new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        converted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        lost: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <span className="font-bold text-lg">Sales Dashboard</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium">{currentUser.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                    {[
                        { label: 'Host quản lý', value: myHosts.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                        { label: 'Tòa nhà', value: myBuildings.length, icon: Building, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' },
                        { label: 'Tổng phòng', value: totalRooms, icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
                        { label: 'HĐ hiệu lực', value: activeContracts.length, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
                        { label: 'Thu phí Host', value: formatCurrency(hostRevenue), icon: CheckCircle, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/10' },
                        { label: 'Công nợ Host', value: formatCurrency(hostDebt), icon: Clock, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/10' }
                    ].map((s, i) => (
                        <div key={i} className={`${s.bg} rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm`}>
                            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                            <p className="text-xl font-bold text-slate-900 dark:text-white truncate" title={s.value.toString()}>{s.value}</p>
                            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* 7-Day Payment Reminders (Dynamic UI section) */}
                {pendingReminders.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-900/10 dark:to-rose-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-900 dark:text-amber-500">Host Sắp / Quá Hạn Phí Phần Mềm</h3>
                                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">Phải nhắc thanh toán ({pendingReminders.length} hóa đơn)</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {pendingReminders.map(p => {
                                const h = myHosts.find(host => host.id === p.hostId);
                                if (!h) return null;
                                const diffDays = Math.ceil((new Date(p.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                const statusColor = diffDays < 0 ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';

                                return (
                                    <div key={p.id} onClick={() => setSelectedHostId(h.id)} className="bg-white dark:bg-slate-800 border border-amber-100 dark:border-amber-800/30 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:shadow-md transition-all group">
                                        <div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm group-hover:text-amber-600 transition-colors">{h.name}</div>
                                            <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">Kỳ: {p.period} - {formatCurrency(p.amount)}</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${statusColor}`}>
                                            {diffDays < 0 ? `Trễ ${Math.abs(diffDays)} ngày` : `Còn ${diffDays} ngày`}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Leads */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-blue-500" /> Leads đăng ký
                            </h2>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">{myLeads.length}</span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-auto">
                            {myLeads.map(lead => (
                                <div key={lead.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{lead.customerName}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{lead.phone} — {lead.needs}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {statusIcon(lead.status)}
                                            <select
                                                value={lead.status}
                                                onChange={e => updateLeadStatus(lead.id, e.target.value as any)}
                                                className={`text-xs font-bold rounded-full px-2 py-0.5 border-none outline-none cursor-pointer ${statusStyle[lead.status]}`}
                                            >
                                                <option value="new">Mới</option>
                                                <option value="contacted">Đã liên hệ</option>
                                                <option value="converted">Đã chuyển đổi</option>
                                                <option value="lost">Đã mất</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {myLeads.length === 0 && <p className="p-8 text-center text-slate-500 text-sm">Chưa có lead nào.</p>}
                        </div>
                    </div>

                    {/* Hosts & Proposals */}
                    <div className="space-y-6">
                        {/* My Hosts */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-500" /> Host đang quản lý
                                </h2>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {myHosts.map(host => {
                                    const hostBuildings = buildings.filter(b => host.managedBuildingIds?.includes(b.id));
                                    return (
                                        <div key={host.id} onClick={() => setSelectedHostId(host.id)} className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">{host.avatar}</div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2 group-hover:text-purple-600 transition-colors">
                                                        {host.name}
                                                        {host.subscriptionPlanId && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold uppercase">{pricingTiers.find(t => t.id === host.subscriptionPlanId)?.name}</span>}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{hostBuildings.length} tòa nhà</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                                        </div>
                                    );
                                })}
                                {myHosts.length === 0 && <p className="p-6 text-center text-slate-500 text-sm">Chưa có host nào.</p>}
                            </div>
                        </div>

                        {/* Create Host */}
                        <button
                            onClick={() => setShowProposalModal(true)}
                            className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                        >
                            <Plus className="w-5 h-5" /> Tạo Host mới
                        </button>
                    </div>
                </div>
            </main>

            {/* Modals */}
            {selectedHostId && <HostDetailModal hostId={selectedHostId} onClose={() => setSelectedHostId(null)} />}

            {/* Create Host Modal */}
            {showProposalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tạo Host mới</h3>
                            <p className="text-xs text-slate-500 mt-1">Host sẽ được tạo ngay và gán vào danh sách của bạn</p>
                        </div>
                        <form onSubmit={handleSubmitHost} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên Host</label>
                                <input required className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={hostForm.name} onChange={e => setHostForm({ ...hostForm, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                    <input type="email" required className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={hostForm.email} onChange={e => setHostForm({ ...hostForm, email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Số ĐT</label>
                                    <input required className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={hostForm.phone} onChange={e => setHostForm({ ...hostForm, phone: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 text-red-500">Mật khẩu khởi tạo</label>
                                <input required type="text" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={hostForm.defaultPassword} onChange={e => setHostForm({ ...hostForm, defaultPassword: e.target.value })} placeholder="Pass tối thiểu 6 ký tự" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gói dịch vụ</label>
                                <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" value={hostForm.subscriptionPlanId} onChange={e => setHostForm({ ...hostForm, subscriptionPlanId: e.target.value })}>
                                    <option value="">Chưa xác định</option>
                                    {pricingTiers.map(t => <option key={t.id} value={t.id}>{t.name} - {t.price ? formatCurrency(t.price) : 'Miễn phí'}/tháng</option>)}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowProposalModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Hủy</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">Tạo mới</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
