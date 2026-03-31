import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Building, Edit, ExternalLink, FileSpreadsheet, KeyRound, Loader2, Plus, Search, Shield, ShoppingBag, Trash2, Users as UsersIcon, X } from 'lucide-react';
import { useApp } from '../AppContext';
import HostDetailModal from '../components/HostDetailModal';
import { auth, secondaryAuth } from '../firebase';
import type { AppUser, UserRole } from '../types';

const ROLE_LABELS: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Admin',
    SALES: 'Nhân viên Sales',
    HOST: 'Chủ nhà (Host)',
    TENANT: 'Người thuê',
};

const ROLE_COLORS: Record<UserRole, string> = {
    SUPER_ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    SALES: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    HOST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    TENANT: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    role: 'HOST' as UserRole,
    status: 'active' as 'active' | 'pending' | 'suspended',
    subscriptionPlanId: '',
    defaultPassword: '',
    subscriptionStartDate: '',
    subscriptionEndDate: '',
};

export default function AdminUsers() {
    const { allUsers, addUser, updateUser, deleteUser, pricingTiers, addPricingTier, updatePricingTier, createGoogleSheetForHost } = useApp();
    const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
    const [editing, setEditing] = useState<AppUser | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [creatingSheetFor, setCreatingSheetFor] = useState<string | null>(null);
    const [isCustomPlan, setIsCustomPlan] = useState(false);
    const [customPlan, setCustomPlan] = useState({
        name: 'Gói tùy chỉnh',
        price: 0,
        maxBuildings: 1,
        maxRooms: 10,
        features: ['Core features'],
    });

    const filtered = allUsers
        .filter(user => filterRole === 'ALL' || user.role === filterRole)
        .filter(user => user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()));

    const resetCustomPlan = () => {
        setIsCustomPlan(false);
        setCustomPlan({
            name: 'Gói tùy chỉnh',
            price: 0,
            maxBuildings: 1,
            maxRooms: 10,
            features: ['Core features'],
        });
    };

    const openCreate = (role?: UserRole) => {
        setEditing(null);
        setForm({
            ...EMPTY_FORM,
            role: role || 'HOST',
            subscriptionStartDate: new Date().toISOString().split('T')[0],
        });
        resetCustomPlan();
        setShowModal(true);
    };

    const openEdit = (user: AppUser) => {
        setEditing(user);
        setForm({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status || 'active',
            subscriptionPlanId: user.subscriptionPlanId || '',
            defaultPassword: '',
            subscriptionStartDate: user.subscriptionStartDate || '',
            subscriptionEndDate: user.subscriptionEndDate || '',
        });

        resetCustomPlan();
        const userPlan = pricingTiers.find(tier => tier.id === user.subscriptionPlanId);
        if (userPlan && userPlan.name.toLowerCase().includes('tùy chỉnh')) {
            setIsCustomPlan(true);
            setCustomPlan({
                name: userPlan.name,
                price: userPlan.price,
                maxBuildings: userPlan.maxBuildings,
                maxRooms: userPlan.maxRooms,
                features: userPlan.features,
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let planId = form.subscriptionPlanId;

        if (form.role === 'HOST' && isCustomPlan) {
            const currentPlan = pricingTiers.find(tier => tier.id === form.subscriptionPlanId);
            if (editing && currentPlan?.name.toLowerCase().includes('tùy chỉnh')) {
                updatePricingTier({ id: form.subscriptionPlanId, ...customPlan });
            } else {
                planId = `tier_custom_${Date.now()}`;
                addPricingTier({ ...customPlan, name: `${customPlan.name} - ${form.name}` });
            }
        }

        if (editing) {
            const wasNotActive = editing.status !== 'active';
            const isNowActive = form.status === 'active';
            const updatePayload = { ...editing, ...form, subscriptionPlanId: planId };
            delete (updatePayload as any).defaultPassword;
            updateUser(updatePayload);
            if (wasNotActive && isNowActive && form.role === 'HOST') {
                void handleCreateSheet(editing.id);
            }
        } else {
            if (!form.defaultPassword) {
                alert('Vui lòng nhập mật khẩu khởi tạo cho người dùng mới.');
                return;
            }
            const newUserReq = {
                ...form,
                subscriptionPlanId: planId,
                avatar: form.name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase(),
            };
            const newUser = await addUser(newUserReq);
            if (newUser) {
                alert(`Đã tạo user "${newUser.name}" thành công!\nEmail: ${newUser.email}\nVai trò: ${ROLE_LABELS[newUser.role]}`);
            }
        }

        setShowModal(false);
    };

    const handleCreateSheet = async (hostId: string) => {
        setCreatingSheetFor(hostId);
        const result = await createGoogleSheetForHost(hostId);
        setCreatingSheetFor(null);

        if (result.success) {
            if (result.url) {
                alert(`Đã tạo Google Sheet thành công!\n${result.url}`);
            } else {
                alert(`Đã xuất file Excel (.xlsx) cho host thành công!\nFile đã được tải xuống máy.${result.error ? `\nLưu ý: ${result.error}` : ''}`);
            }
            return;
        }

        alert(`Lỗi: ${result.error}`);
    };

    const handleDelete = (user: AppUser) => {
        if (user.role === 'SUPER_ADMIN') {
            alert('Không thể xóa Super Admin.');
            return;
        }
        if (window.confirm(`Xóa user "${user.name}"?`)) {
            deleteUser(user.id);
        }
    };

    const handleResetPassword = async (user: AppUser) => {
        if (!user.email) {
            alert('User chưa có email.');
            return;
        }
        if (!window.confirm(`Gửi email đặt lại mật khẩu cho "${user.name}" (${user.email})?`)) return;

        try {
            await sendPasswordResetEmail(auth, user.email);
            alert(`Đã gửi email đặt lại mật khẩu đến ${user.email}`);
        } catch (err: any) {
            alert(`Lỗi: ${err.message}`);
        }
    };

    const handleRestoreAuth = async (user: AppUser) => {
        if (!user.email) {
            alert('User chưa có email.');
            return;
        }
        if (!window.confirm(`Khôi phục tài khoản đăng nhập cho "${user.name}" (${user.email})?\nHệ thống sẽ tạo lại user trên Firebase Auth và gửi email đặt lại mật khẩu.`)) return;

        try {
            const { createUserWithEmailAndPassword, signOut } = await import('firebase/auth');
            const tempPassword = `Temp@${Date.now()}`;

            try {
                await createUserWithEmailAndPassword(secondaryAuth, user.email, tempPassword);
                await signOut(secondaryAuth);
            } catch (createErr: any) {
                if (createErr.code !== 'auth/email-already-in-use') {
                    throw createErr;
                }
            }

            await sendPasswordResetEmail(auth, user.email);
            alert(`Đã khôi phục thành công. Email đặt lại mật khẩu đã được gửi đến ${user.email}`);
        } catch (err: any) {
            console.error(err);
            alert(`Lỗi: ${err.message}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <UsersIcon size={24} className="text-blue-500" />
                    Quản lý User
                </h1>
                <div className="flex gap-2">
                    <button onClick={() => openCreate('SALES')} className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-sm font-medium flex items-center gap-1.5 border border-amber-200 dark:border-amber-800">
                        <ShoppingBag size={14} />
                        Tạo Sales
                    </button>
                    <button onClick={() => openCreate('HOST')} className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-sm font-medium flex items-center gap-1.5 border border-blue-200 dark:border-blue-800">
                        <Building size={14} />
                        Tạo Host
                    </button>
                    <button onClick={() => openCreate()} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium flex items-center gap-1.5 shadow-lg shadow-blue-600/20">
                        <Plus size={16} />
                        Tạo user
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                    {(['ALL', 'SUPER_ADMIN', 'SALES', 'HOST', 'TENANT'] as const).map(role => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterRole === role ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}
                        >
                            {role === 'ALL' ? 'Tất cả' : ROLE_LABELS[role]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs uppercase">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Vai trò</th>
                                <th className="p-4">Trạng thái</th>
                                <th className="p-4">Gói dịch vụ</th>
                                <th className="p-4">Ngày tạo</th>
                                <th className="p-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filtered.map(user => (
                                <tr
                                    key={user.id}
                                    onClick={() => {
                                        if (user.role === 'HOST') setSelectedHostId(user.id);
                                    }}
                                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${user.role === 'HOST' ? 'cursor-pointer group' : ''}`}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${user.role === 'SUPER_ADMIN' ? 'bg-gradient-to-br from-red-500 to-rose-600' : user.role === 'SALES' ? 'bg-gradient-to-br from-amber-500 to-orange-600' : user.role === 'HOST' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
                                                {user.avatar || user.name[0]}
                                            </div>
                                            <div>
                                                <p className={`font-medium text-sm ${user.role === 'HOST' ? 'group-hover:text-blue-600 transition-colors' : ''}`}>{user.name}</p>
                                                <p className="text-xs text-slate-500">{user.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[user.role]}`}>{ROLE_LABELS[user.role]}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[user.status || 'active']}`}>
                                            {user.status === 'pending' ? 'Chờ duyệt' : user.status === 'suspended' ? 'Tạm khóa' : 'Hoạt động'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm">{user.role === 'HOST' ? (pricingTiers.find(plan => plan.id === user.subscriptionPlanId)?.name || '—') : '—'}</td>
                                    <td className="p-4 text-sm text-slate-500">{user.createdAt || '—'}</td>
                                    <td className="p-4">
                                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => openEdit(user)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                                                <Edit size={14} />
                                            </button>
                                            {user.role === 'HOST' && (
                                                <>
                                                    {user.googleSheetUrl ? (
                                                        <a
                                                            href={user.googleSheetUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
                                                            title="Mở Google Sheet"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </a>
                                                    ) : null}
                                                    <button
                                                        onClick={() => void handleCreateSheet(user.id)}
                                                        disabled={creatingSheetFor === user.id}
                                                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg disabled:opacity-50"
                                                        title={user.googleSheetUrl ? 'Tạo lại Google Sheet' : 'Tạo Google Sheet'}
                                                    >
                                                        {creatingSheetFor === user.id ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
                                                    </button>
                                                </>
                                            )}
                                            {user.role !== 'SUPER_ADMIN' && (
                                                <button onClick={() => void handleResetPassword(user)} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg" title="Gửi email reset mật khẩu">
                                                    <KeyRound size={14} />
                                                </button>
                                            )}
                                            {user.role !== 'SUPER_ADMIN' && (
                                                <button onClick={() => void handleRestoreAuth(user)} className="p-1.5 text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg" title="Khôi phục tài khoản đăng nhập (Firebase Auth)">
                                                    <Shield size={14} />
                                                </button>
                                            )}
                                            {user.role !== 'SUPER_ADMIN' && (
                                                <button onClick={() => handleDelete(user)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold">{editing ? `Sửa: ${editing.name}` : 'Tạo user mới'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Họ tên</label>
                                <input required className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input type="email" required className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Số ĐT</label>
                                    <input required className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                </div>
                            </div>

                            {!editing && (
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-red-500">Mật khẩu khởi tạo</label>
                                    <input required type="text" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={form.defaultPassword} onChange={e => setForm({ ...form, defaultPassword: e.target.value })} placeholder="Pass tối thiểu 6 ký tự" />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Vai trò</label>
                                    <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as UserRole })}>
                                        <option value="SALES">Nhân viên Sales</option>
                                        <option value="HOST">Chủ nhà (Host)</option>
                                        <option value="TENANT">Người thuê</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Trạng thái</label>
                                    <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'active' | 'pending' | 'suspended' })}>
                                        <option value="active">Hoạt động</option>
                                        <option value="pending">Chờ duyệt</option>
                                        <option value="suspended">Tạm khóa</option>
                                    </select>
                                </div>
                            </div>

                            {form.role === 'HOST' && (
                                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Cấu hình gói dịch vụ</label>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" checked={isCustomPlan} onChange={e => setIsCustomPlan(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                                            <span>Tạo gói đặc thù riêng</span>
                                        </label>
                                    </div>

                                    {!isCustomPlan ? (
                                        <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none" value={form.subscriptionPlanId} onChange={e => setForm({ ...form, subscriptionPlanId: e.target.value })}>
                                            <option value="">Chưa chọn</option>
                                            {pricingTiers.filter(tier => !tier.name.includes(' - ')).map(tier => (
                                                <option key={tier.id} value={tier.id}>
                                                    {tier.name} — {tier.price > 0 ? `${tier.price.toLocaleString()}đ/th` : 'Miễn phí'}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Giá gói (VNĐ/tháng)</label>
                                                <input type="number" className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-sm" value={customPlan.price} onChange={e => setCustomPlan({ ...customPlan, price: +e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Tối đa số tòa nhà</label>
                                                <input type="number" className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-sm" value={customPlan.maxBuildings} onChange={e => setCustomPlan({ ...customPlan, maxBuildings: +e.target.value })} />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs text-slate-500 mb-1">Tối đa số phòng</label>
                                                <input type="number" className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-sm" value={customPlan.maxRooms} onChange={e => setCustomPlan({ ...customPlan, maxRooms: +e.target.value })} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày bắt đầu</label>
                                            <input type="date" lang="vi-VN" className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-sm" value={form.subscriptionStartDate} onChange={e => setForm({ ...form, subscriptionStartDate: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày hết hạn</label>
                                            <input type="date" lang="vi-VN" className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-sm" value={form.subscriptionEndDate} onChange={e => setForm({ ...form, subscriptionEndDate: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium">Hủy</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                                    {editing ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedHostId && <HostDetailModal hostId={selectedHostId} onClose={() => setSelectedHostId(null)} />}
        </div>
    );
}
