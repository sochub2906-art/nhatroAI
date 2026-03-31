import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    Crown,
    CreditCard,
    Database,
    Download,
    ExternalLink,
    FileSpreadsheet,
    KeyRound,
    Loader2,
    Lock,
    LogOut,
    Mail,
    Moon,
    Plus,
    RefreshCw,
    Save,
    Settings as SettingsIcon,
    Sun,
    Upload,
    User,
    Users,
    X,
    BadgeCheck,
} from 'lucide-react';
import { EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { useApp } from '../AppContext';
import { exportHostDataToExcel } from '../services/excelExport';
import { auth, TENANT_LOGIN_ENABLED } from '../firebase';
import HostSubscriptionPanel from '../components/HostSubscriptionPanel';
import { formatDateTimeVN } from '../utils/dateFormat';

type TabKey = 'profile' | 'subscription' | 'data' | 'system' | 'leads' | 'tenants';

export default function Settings() {
    const {
        currentUser,
        allUsers,
        userProfile,
        updateUserProfile,
        adminSettings,
        updateAdminSettings,
        leads,
        exportData,
        importData,
        toggleTheme,
        theme,
        logout,
        addUser,
        rooms,
        contracts,
        customers,
        buildings,
        payments,
        equipment,
        createGoogleSheetForHost,
        syncNow,
        lastSyncTime,
        isSyncing,
    } = useApp();

    const navigate = useNavigate();
    const location = useLocation();

    const initialTab = useMemo<TabKey>(() => {
        const search = new URLSearchParams(location.search);
        const queryTab = search.get('tab');
        const stateTab = (location.state as { tab?: TabKey } | null)?.tab;
        const requestedTab = stateTab || (queryTab as TabKey | null);
        if (requestedTab && ['profile', 'subscription', 'data', 'system', 'leads', 'tenants'].includes(requestedTab)) {
            return requestedTab;
        }
        return currentUser?.role === 'HOST' ? 'subscription' : 'profile';
    }, [currentUser?.role, location.search, location.state]);

    const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
    const [profileForm, setProfileForm] = useState(userProfile);
    const [settingsForm, setSettingsForm] = useState(adminSettings);
    const [importJson, setImportJson] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showTenantModal, setShowTenantModal] = useState(false);
    const [tenantForm, setTenantForm] = useState({ name: '', email: '', phone: '', linkedContractId: '' });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState('');
    const [syncing, setSyncing] = useState(false);

    const hasRemoteSheet = Boolean(currentUser?.googleSheetId) && !currentUser?.googleSheetId?.startsWith('local_');
    const hasLocalOnlyStorage = (currentUser?.googleSheetId || '').startsWith('local_');
    const hasWebhookConfigured = Boolean(adminSettings.googleSheetWebhookUrl?.trim());

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        setProfileForm(userProfile);
    }, [userProfile]);

    useEffect(() => {
        setSettingsForm(adminSettings);
    }, [adminSettings]);

    const triggerSuccess = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleSaveProfile = (event: React.FormEvent) => {
        event.preventDefault();
        updateUserProfile(profileForm);
        triggerSuccess();
    };

    const handleSaveSettings = (event: React.FormEvent) => {
        event.preventDefault();
        updateAdminSettings(settingsForm);
        triggerSuccess();
    };

    const handleExport = () => {
        const data = exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `smart-rental-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        if (!window.confirm('Dữ liệu hiện tại sẽ bị ghi đè. Tiếp tục?')) {
            return;
        }
        const success = importData(importJson);
        alert(success ? 'Nhập dữ liệu thành công.' : 'Dữ liệu không hợp lệ.');
        if (success) setImportJson('');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleChangePassword = async () => {
        setPwError('');
        setPwSuccess('');
        if (!currentPassword || !newPassword) {
            setPwError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        if (newPassword.length < 6) {
            setPwError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwError('Xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user || !user.email) {
                setPwError('Chưa đăng nhập Firebase Auth.');
                return;
            }
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setPwSuccess('Đổi mật khẩu thành công.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                setPwError('Mật khẩu hiện tại không đúng.');
            } else {
                setPwError(`Lỗi: ${error.message}`);
            }
        }
    };

    const handleSendResetEmail = async () => {
        const email = currentUser?.email || userProfile.email;
        if (!email) {
            alert('Không tìm thấy email.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert(`Đã gửi email đặt lại mật khẩu đến ${email}.`);
        } catch (error: any) {
            alert(`Lỗi: ${error.message}`);
        }
    };

    const tenantUsers = allUsers.filter((user) => user.role === 'TENANT');
    const activeContracts = contracts.filter((contract) => contract.isActive);

    const handleAddTenant = (event: React.FormEvent) => {
        event.preventDefault();
        const contract = contracts.find((item) => item.id === tenantForm.linkedContractId);
        addUser({
            name: tenantForm.name,
            email: tenantForm.email,
            phone: tenantForm.phone,
            role: 'TENANT',
            status: 'active',
            linkedContractId: tenantForm.linkedContractId,
            linkedRoomId: contract?.roomId || '',
        });
        setShowTenantModal(false);
        setTenantForm({ name: '', email: '', phone: '', linkedContractId: '' });
        triggerSuccess();
    };

    const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
        { key: 'profile', label: 'Hồ sơ & Thanh toán', icon: User },
        ...(currentUser?.role === 'HOST' ? [{ key: 'subscription' as TabKey, label: 'Gói đăng ký', icon: Crown }] : []),
        { key: 'tenants', label: 'Khách đăng ký', icon: Users },
        { key: 'data', label: 'Dữ liệu', icon: Database },
        { key: 'system', label: 'Hệ thống', icon: SettingsIcon },
        { key: 'leads', label: 'Khách đăng ký mới', icon: Users },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <SettingsIcon size={24} className="text-blue-500" />
                    Cài đặt hệ thống
                </h1>
                {showSuccess && (
                    <div className="flex items-center gap-2 text-green-500 font-medium animate-bounce">
                        <CheckCircle size={20} />
                        Lưu thành công
                    </div>
                )}
            </div>

            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit flex-wrap">
                {tabs.filter((tab) => TENANT_LOGIN_ENABLED || tab.key !== 'tenants').map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all ${
                                activeTab === tab.key
                                    ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400 font-medium'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                {activeTab === 'profile' && (
                    <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                    <User size={20} className="text-blue-500" />
                                    Thông tin cá nhân
                                </h2>
                                {[
                                    { label: 'Họ và tên', key: 'name', type: 'text' },
                                    { label: 'Email', key: 'email', type: 'email' },
                                    { label: 'Số điện thoại', key: 'phone', type: 'tel' },
                                ].map((field) => (
                                    <div key={field.key}>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">{field.label}</label>
                                        <input
                                            type={field.type}
                                            required
                                            value={(profileForm as any)[field.key] || ''}
                                            onChange={(e) => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                                            className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                    <CreditCard size={20} className="text-blue-500" />
                                    Thông tin thanh toán
                                </h2>
                                {[
                                    { label: 'Ngân hàng', key: 'bankName' },
                                    { label: 'Số tài khoản', key: 'accountNumber' },
                                    { label: 'Chủ tài khoản', key: 'accountName' },
                                ].map((field) => (
                                    <div key={field.key}>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">{field.label}</label>
                                        <input
                                            type="text"
                                            value={(profileForm as any)[field.key] || ''}
                                            onChange={(e) => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                                            className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                <BadgeCheck size={20} className="text-blue-500" />
                                Xác minh danh tính (KYC)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: 'Số thẻ CCCD/CMND', key: 'idNumber' },
                                    { label: 'Ngày cấp', key: 'idIssueDate', type: 'date' },
                                    { label: 'Nơi cấp', key: 'idIssuePlace' },
                                ].map((field) => (
                                    <div key={field.key}>
                                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">{field.label}</label>
                                        <input
                                            type={field.type || 'text'}
                                            lang={field.type === 'date' ? 'vi-VN' : undefined}
                                            value={(profileForm as any)[field.key] || ''}
                                            onChange={(e) => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                                            className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                <Lock size={20} className="text-amber-500" />
                                Đổi mật khẩu
                            </h2>
                            {pwError && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">{pwError}</div>}
                            {pwSuccess && <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-center gap-2"><CheckCircle size={16} /> {pwSuccess}</div>}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Mật khẩu hiện tại</label>
                                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Nhập mật khẩu hiện tại" className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Mật khẩu mới</label>
                                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Xác nhận mật khẩu mới</label>
                                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu mới" className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button type="button" onClick={handleChangePassword} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-amber-600/20"><KeyRound size={18} /> Đổi mật khẩu</button>
                                <button type="button" onClick={handleSendResetEmail} className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"><Mail size={14} /> Quên mật khẩu? Gửi email reset</button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-600/20"><Save size={18} /> Lưu</button>
                        </div>
                    </form>
                )}

                {activeTab === 'subscription' && currentUser?.role === 'HOST' && (
                    <div className="p-6">
                        <HostSubscriptionPanel />
                    </div>
                )}

                {activeTab === 'tenants' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg flex items-center gap-2"><Users size={20} className="text-green-500" /> Người thuê ({tenantUsers.length})</h2>
                            <button onClick={() => setShowTenantModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium shadow-lg shadow-green-600/20"><Plus size={16} /> Thêm người thuê</button>
                        </div>
                        {tenantUsers.length > 0 ? (
                            <div className="space-y-3">
                                {tenantUsers.map((tenant) => {
                                    const contract = contracts.find((item) => item.id === tenant.linkedContractId);
                                    const room = rooms.find((item) => item.id === tenant.linkedRoomId);
                                    return (
                                        <div key={tenant.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">{tenant.avatar}</div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{tenant.name}</p>
                                                    <p className="text-xs text-slate-500">{tenant.email} | {tenant.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                {room && <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium">{room.name}</span>}
                                                {contract && <span className="text-xs text-slate-500">HĐ: {contract.id}</span>}
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tenant.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>{tenant.status === 'active' ? 'Hoạt động' : 'Chờ duyệt'}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500 italic">Chưa có người thuê nào. Nhấn "Thêm người thuê" để tạo tài khoản gắn với hợp đồng.</div>
                        )}
                    </div>
                )}

                {activeTab === 'data' && (
                    <div className="p-6 space-y-8">
                        <div>
                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><FileSpreadsheet size={20} className="text-green-500" /> Google Sheet</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className={`p-4 rounded-xl border ${hasRemoteSheet ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Google Sheet</p>
                                    <p className={`mt-1 text-sm font-semibold ${hasRemoteSheet ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>{hasRemoteSheet ? 'Đã liên kết sheet thật' : 'Chưa có sheet thật'}</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${hasLocalOnlyStorage ? 'border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Local backup</p>
                                    <p className={`mt-1 text-sm font-semibold ${hasLocalOnlyStorage ? 'text-amber-700 dark:text-amber-300' : 'text-slate-700 dark:text-slate-300'}`}>{hasLocalOnlyStorage ? 'Đang lưu local-only' : 'Không ở chế độ local-only'}</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${hasWebhookConfigured ? 'border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                                    <p className="text-xs uppercase tracking-wide text-slate-500">Webhook</p>
                                    <p className={`mt-1 text-sm font-semibold ${hasWebhookConfigured ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>{hasWebhookConfigured ? 'Admin đã cấu hình' : 'Admin chưa cấu hình'}</p>
                                </div>
                            </div>

                            {hasRemoteSheet ? (
                                <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl space-y-3">
                                    <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2"><CheckCircle size={16} /> Google Sheet đã được liên kết.</p>
                                    {lastSyncTime && <p className="text-xs text-green-700/80 dark:text-green-300/80">Lần sync gần nhất: {formatDateTimeVN(lastSyncTime, lastSyncTime)}</p>}
                                    <div className="flex flex-wrap gap-3">
                                        {(currentUser as any)?.googleSheetUrl && (
                                            <a href={(currentUser as any).googleSheetUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium shadow-lg shadow-green-600/20 transition-all">
                                                <ExternalLink size={16} /> Mở Google Sheet
                                            </a>
                                        )}
                                        <button type="button" disabled={syncing || isSyncing} onClick={async () => { await syncNow(); alert('Đã chạy đồng bộ ngay lên Google Sheet.'); }} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium shadow-lg shadow-blue-600/20 transition-all">
                                            {syncing || isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} {syncing || isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ lên Google Sheet'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    {hasLocalOnlyStorage && <p className="mb-2 text-xs text-amber-600 dark:text-amber-300">Tài khoản này đang ở chế độ local-only. Nếu đổi máy hoặc xóa cache mà chưa backup thì dữ liệu có thể mất.</p>}
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Chưa có Google Sheet. Liên hệ admin để tạo.</p>
                                </div>
                            )}

                            {!hasRemoteSheet && hasWebhookConfigured && currentUser && (
                                <button
                                    type="button"
                                    disabled={syncing}
                                    onClick={async () => {
                                        setSyncing(true);
                                        const result = await createGoogleSheetForHost(currentUser.id);
                                        setSyncing(false);
                                        if (result.success) {
                                            alert(`Đã tạo/kết nối Google Sheet${result.url ? `\n${result.url}` : ''}`);
                                        } else {
                                            alert(`Không thể tạo Google Sheet: ${result.error}`);
                                        }
                                    }}
                                    className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium shadow-lg shadow-blue-600/20 transition-all"
                                >
                                    {syncing ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />} Tạo / kết nối Google Sheet
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Download size={20} className="text-green-500" /> Sao lưu JSON</h2>
                                <button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium"><Download size={18} /> Tải backup (.json)</button>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><FileSpreadsheet size={20} className="text-emerald-500" /> Xuất Excel</h2>
                                <p className="text-xs text-slate-500 mb-2">Xuất toàn bộ dữ liệu tài sản, khách thuê, thiết bị, hợp đồng và thanh toán ra file Excel.</p>
                                <button
                                    onClick={() => {
                                        const hostId = currentUser?.id || '';
                                        const hostBuildings = buildings.filter((building) => building.hostId === hostId || !building.hostId);
                                        const buildingIds = hostBuildings.map((building) => building.id);
                                        const hostRooms = rooms.filter((room) => buildingIds.includes(room.buildingId));
                                        const roomIds = hostRooms.map((room) => room.id);
                                        const hostContracts = contracts.filter((contract) => roomIds.includes(contract.roomId));
                                        const customerIds = [...new Set(hostContracts.map((contract) => contract.customerId))];
                                        const hostCustomers = customers.filter((customer) => customerIds.includes(customer.id));
                                        const contractIds = hostContracts.map((contract) => contract.id);
                                        const hostPayments = payments.filter((payment) => contractIds.includes(payment.contractId));
                                        const hostEquipment = equipment.filter((item) => buildingIds.includes(item.buildingId));
                                        exportHostDataToExcel({ hostName: currentUser?.name || 'Host', buildings: hostBuildings, rooms: hostRooms, customers: hostCustomers, contracts: hostContracts, payments: hostPayments, equipment: hostEquipment });
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-emerald-600/20"
                                >
                                    <FileSpreadsheet size={18} /> Tải xuống (.xlsx)
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Upload size={20} className="text-blue-500" /> Nhập dữ liệu</h2>
                            <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} className="w-full h-32 p-3 font-mono text-xs border rounded-xl mb-4 dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" placeholder='{"buildings": [...]}' />
                            <button onClick={handleImport} disabled={!importJson.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium"><Upload size={18} /> Phục hồi</button>
                        </div>
                    </div>
                )}

                {activeTab === 'system' && (
                    <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                <SettingsIcon size={20} className="text-blue-500" />
                                Tùy chỉnh hệ thống
                            </h2>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Tên ứng dụng</label>
                                <input
                                    type="text"
                                    value={settingsForm.appName || ''}
                                    onChange={(e) => setSettingsForm({ ...settingsForm, appName: e.target.value })}
                                    className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">Giao diện (Theme)</p>
                                        <p className="text-xs text-slate-500">Chuyển đổi sáng / tối</p>
                                    </div>
                                </div>
                                <button type="button" onClick={toggleTheme} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
                                    Đổi giao diện
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-600/20">
                                <Save size={18} /> Lưu cài đặt
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'leads' && (
                    <div className="p-6">
                        <h2 className="font-bold text-lg flex items-center gap-2 mb-4"><Users size={20} className="text-indigo-500" /> Khách hàng quan tâm (Leads)</h2>
                        {leads && leads.length > 0 ? (
                            <div className="space-y-3">
                                {leads.map((lead: any) => (
                                    <div key={lead.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{lead.name}</p>
                                            <p className="text-sm text-slate-500">{lead.phone} • {lead.demand}</p>
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {formatDateTimeVN(lead.createdAt, lead.createdAt)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500 italic">Chưa có dữ liệu.</div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-center mt-8">
                <button onClick={handleLogout} className="text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-2 font-medium px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                    <LogOut size={20} /> Đăng xuất khỏi hệ thống
                </button>
            </div>

            {showTenantModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h2 className="font-bold text-lg flex items-center gap-2"><User size={20} className="text-green-500" /> Thêm tài khoản người thuê</h2>
                            <button onClick={() => setShowTenantModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddTenant} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Họ và tên</label>
                                <input type="text" required value={tenantForm.name} onChange={(e) => setTenantForm({...tenantForm, name: e.target.value})} className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-green-500" placeholder="Nguyễn Văn A" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email quản lý (để đăng nhập)</label>
                                <input type="email" required value={tenantForm.email} onChange={(e) => setTenantForm({...tenantForm, email: e.target.value})} className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-green-500" placeholder="nguyenvana@gmail.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Số điện thoại</label>
                                <input type="tel" required value={tenantForm.phone} onChange={(e) => setTenantForm({...tenantForm, phone: e.target.value})} className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-green-500" placeholder="0901234567" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Gắn với hợp đồng đang thuê</label>
                                <select required value={tenantForm.linkedContractId} onChange={(e) => setTenantForm({...tenantForm, linkedContractId: e.target.value})} className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="">-- Chọn hợp đồng --</option>
                                    {activeContracts.map(c => {
                                        const r = rooms.find(room => room.id === c.roomId);
                                        const cus = customers.find(cu => cu.id === c.customerId);
                                        return <option key={c.id} value={c.id}>{r?.name || c.roomId} - {cus?.name || 'Khách'}</option>
                                    })}
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowTenantModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Hủy</button>
                                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-green-600/20">Tạo tài khoản</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
