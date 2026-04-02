import React, { useState } from 'react';
import { useApp, formatCurrency } from '../AppContext';
import { Building, Users, CreditCard, MapPin, ExternalLink, Search, Plus, X, Loader2, FileSpreadsheet } from 'lucide-react';
import HostDetailModal from '../components/HostDetailModal';
import { AppUser, UserRole, ALL_FEATURE_KEYS, DEFAULT_FEATURE_FLAGS, FeatureFlags } from '../types';

export default function AdminHosts() {
    const { allUsers, addUser, updatePricingTier, addPricingTier, createGoogleSheetForHost, buildings, rooms, contracts, payments, pricingTiers, adminSettings, updateAdminSettings } = useApp();
    const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    // Create Host Modal State
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', defaultPassword: '', subscriptionPlanId: '' });
    const [isCustomPlan, setIsCustomPlan] = useState(false);
    const [customPlan, setCustomPlan] = useState({ name: 'Gói tùy chỉnh', price: 0, maxBuildings: 1, maxRooms: 10, features: ['Core features'], featureFlags: { ...DEFAULT_FEATURE_FLAGS } });
    const [creatingSheetFor, setCreatingSheetFor] = useState<string | null>(null);

    const toggleCustomFlag = (key: keyof FeatureFlags) => {
        setCustomPlan(prev => ({ ...prev, featureFlags: { ...prev.featureFlags, [key]: !prev.featureFlags[key] } }));
    };

    const openCreate = () => {
        setForm({ name: '', email: '', phone: '', defaultPassword: '', subscriptionPlanId: '' });
        setIsCustomPlan(false);
        setCustomPlan({ name: 'Gói đặc thù', price: 0, maxBuildings: 1, maxRooms: 10, features: ['Các tính năng lõi cơ bản'], featureFlags: { ...DEFAULT_FEATURE_FLAGS } });
        setShowModal(true);
    };

    const handleCreateSheet = async (hostId: string) => {
        setCreatingSheetFor(hostId);
        const result = await createGoogleSheetForHost(hostId);
        setCreatingSheetFor(null);
        if (result.success) {
            if (result.url) {
                alert(`✅ Đã tạo Google Sheet thành công!\n${result.url}`);
            } else {
                alert(`✅ Đã xuất file Excel (.xlsx) cho Host thành công!\nFile đã được tải xuống máy.${result.error ? '\n⚠️ ' + result.error : ''}`);
            }
        } else {
            alert(`❌ Lỗi: ${result.error}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let planId = form.subscriptionPlanId;
        const newTierId = `tier_custom_${Date.now()}`;

        if (isCustomPlan) {
            planId = newTierId;
        }

        if (!form.defaultPassword) {
            alert("Vui lòng nhập mật khẩu khởi tạo cho Host mới.");
            return;
        }

        const newUserReq = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            role: 'HOST' as UserRole,
            status: 'active' as const,
            subscriptionPlanId: planId,
            defaultPassword: form.defaultPassword,
            avatar: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        };

        const newUser = await addUser(newUserReq);
        if (newUser && newUser.role === 'HOST' && newUser.status === 'active') {
            if (isCustomPlan) {
                // Must manually inject it into settings so we can preserve exactly `newTierId`
                // because addPricingTier ignores explicit ID.
                const newCustomTier = {
                     id: newTierId,
                     ...customPlan,
                     name: `${customPlan.name} (${form.name})`,
                     isCustom: true,
                     targetHostId: newUser.id
                };
                updateAdminSettings({ 
                    ...adminSettings!, 
                    pricingTiers: [...(adminSettings?.pricingTiers || []), newCustomTier] 
                });
            }
            handleCreateSheet(newUser.id);
        }
        setShowModal(false);
    };

    const salesUsers = allUsers.filter(u => u.role === 'SALES');

    // Filter hosts (and allow search)
    const hosts = allUsers
        .filter(u => u.role === 'HOST')
        .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2"><Building size={24} className="text-blue-500" /> Quản lý Host</h1>
                <div className="flex items-center gap-3 w-full sm:w-auto text-sm">
                    <div className="relative flex-1 sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            placeholder="Tìm kiếm host theo tên/email..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 whitespace-nowrap">
                        <Plus size={16} /> Tạo Host
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {hosts.map(host => {
                    const hostBuildings = buildings.filter(b => b.hostId === host.id || host.managedBuildingIds?.includes(b.id));
                    const hostRoomIds = rooms.filter(r => hostBuildings.find(b => b.id === r.buildingId)).map(r => r.id);
                    const hostContracts = contracts.filter(c => c.isActive && hostRoomIds.includes(c.roomId));
                    const hostPayments = payments.filter(p => { const c = contracts.find(c => c.id === p.contractId); return c && hostRoomIds.includes(c.roomId); });
                    const totalRevenue = hostPayments.filter(p => p.status === 'Đã đóng').reduce((s, p) => s + p.amount, 0);
                    const totalDebt = hostPayments.filter(p => p.status !== 'Đã đóng').reduce((s, p) => s + p.amount, 0);
                    const plan = pricingTiers.find(p => p.id === host.subscriptionPlanId);
                    const assignedSales = salesUsers.find(s => s.assignedHostIds?.includes(host.id));

                    return (
                        <div
                            key={host.id}
                            onClick={() => setSelectedHostId(host.id)}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-0.5"
                        >
                            <div className="p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold group-hover:scale-105 transition-transform">
                                        {host.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold truncate group-hover:text-blue-600 transition-colors">{host.name}</p>
                                        <p className="text-xs text-slate-500">{host.email}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${host.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : host.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {host.status === 'active' ? 'Hoạt động' : host.status === 'pending' ? 'Chờ duyệt' : 'Tạm khóa'}
                                    </span>
                                </div>

                                {/* Plan */}
                                <div className="flex items-center gap-2 mb-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <CreditCard size={14} className="text-purple-500" />
                                    <span className="text-sm font-medium">{plan ? plan.name : 'Chưa chọn gói'}</span>
                                    {plan && <span className="text-xs text-slate-500 ml-auto">{plan.price > 0 ? formatCurrency(plan.price) + '/th' : 'Miễn phí'}</span>}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                                        <p className="text-lg font-bold text-blue-600">{hostBuildings.length}</p>
                                        <p className="text-[10px] text-slate-500">Tòa nhà</p>
                                    </div>
                                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/10 rounded-xl">
                                        <p className="text-lg font-bold text-green-600">{hostContracts.length}</p>
                                        <p className="text-[10px] text-slate-500">HĐ active</p>
                                    </div>
                                    <div className="text-center p-2 bg-red-50 dark:bg-red-900/10 rounded-xl">
                                        <p className="text-lg font-bold text-red-600">{formatCurrency(totalDebt)}</p>
                                        <p className="text-[10px] text-slate-500">Công nợ</p>
                                    </div>
                                </div>

                                {/* Buildings list */}
                                {hostBuildings.length > 0 && (
                                    <div className="space-y-1.5">
                                        {hostBuildings.map(b => (
                                            <div key={b.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30 text-sm">
                                                <MapPin size={12} className="text-slate-400" />
                                                <span className="flex-1 truncate">{b.name}</span>
                                                <span className="text-xs text-slate-500">{rooms.filter(r => r.buildingId === b.id).length} phòng</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {assignedSales && (
                                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500">
                                        <Users size={12} /> Sales phụ trách: <span className="font-medium text-slate-700 dark:text-slate-300">{assignedSales.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {hosts.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                    Không tìm thấy Host nào.
                </div>
            )}

            {/* Modal Create Host */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Tạo Host mới</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div><label className="block text-sm font-medium mb-1">Họ tên</label><input required className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" required className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                                <div><label className="block text-sm font-medium mb-1">Số ĐT</label><input required className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                            </div>

                            <div><label className="block text-sm font-medium mb-1 text-red-500">Mật khẩu khởi tạo</label><input required type="text" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={form.defaultPassword} onChange={e => setForm({ ...form, defaultPassword: e.target.value })} placeholder="Pass tối thiểu 6 ký tự" /></div>

                            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Cấu hình Gói dịch vụ</label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" checked={isCustomPlan} onChange={e => setIsCustomPlan(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                                        <span>Tạo gói đặc thù riêng</span>
                                    </label>
                                </div>

                                {!isCustomPlan ? (
                                    <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" value={form.subscriptionPlanId} onChange={e => setForm({ ...form, subscriptionPlanId: e.target.value })}>
                                        <option value="">Chưa chọn</option>
                                        {pricingTiers.filter(t => !t.name.includes(' - ')).map(t => <option key={t.id} value={t.id}>{t.name} — {t.price > 0 ? `${t.price.toLocaleString()}đ/th` : 'Miễn phí'}</option>)}
                                    </select>
                                ) : (
                                    <div className="pt-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Giá gói (VNĐ/tháng)</label>
                                                <input type="number" className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-sm focus:ring-2 focus:ring-blue-500" value={customPlan.price} onChange={e => setCustomPlan({ ...customPlan, price: +e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Tối đa tòa nhà</label>
                                                <input type="number" min={1} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-sm focus:ring-2 focus:ring-blue-500" value={customPlan.maxBuildings} onChange={e => setCustomPlan({ ...customPlan, maxBuildings: +e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Tối đa phòng</label>
                                                <input type="number" min={1} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-sm focus:ring-2 focus:ring-blue-500" value={customPlan.maxRooms} onChange={e => setCustomPlan({ ...customPlan, maxRooms: +e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="mt-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Quyền truy cập tính năng cơ bản</label>
                                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                                {ALL_FEATURE_KEYS.map(({ key, label }) => (
                                                    <label key={key} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer">
                                                        <input type="checkbox" checked={customPlan.featureFlags[key]} onChange={() => toggleCustomFlag(key)} className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
                                                        <span className="truncate">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium">Hủy</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">Tạo mới</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Host Detail Modal */}
            {selectedHostId && <HostDetailModal hostId={selectedHostId} onClose={() => setSelectedHostId(null)} />}
        </div>
    );
}
