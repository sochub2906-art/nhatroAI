import React, { useEffect, useState } from 'react';
import { useApp } from '../AppContext';
import { Settings, Mail, Save, CheckCircle, Users, Plus, X, Send, FileText, Database, Download, Upload, Loader2, AlertTriangle } from 'lucide-react';
import { buildSystemBackup } from '../services/systemBackupService';
import AdminSubscriptionControlPanel from '../components/AdminSubscriptionControlPanel';

export default function AdminSettingsPage() {
    const { adminSettings, updateAdminSettings, importData, allUsers, pricingTiers, leads, proposals, hostPayments, crmNotes } = useApp();
    const [form, setForm] = useState(adminSettings);
    const [newEmail, setNewEmail] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<'email' | 'templates' | 'payment' | 'subscription' | 'data'>('email');
    const [isExportingBackup, setIsExportingBackup] = useState(false);
    const [backupNotice, setBackupNotice] = useState('');

    const hostUsers = allUsers.filter(user => user.role === 'HOST');
    const configuredHostCount = hostUsers.filter(user => Boolean(adminSettings.googleSheetWebhookUrl?.trim()) && Boolean(user.googleSheetId) && !user.googleSheetId?.startsWith('local_')).length;
    const localOnlyHostCount = hostUsers.filter(user => (user.googleSheetId || '').startsWith('local_')).length;
    const unprotectedHostCount = hostUsers.length - configuredHostCount - localOnlyHostCount;

    useEffect(() => {
        setForm(adminSettings);
    }, [adminSettings]);

    const persistSettings = (next: typeof form) => {
        setForm(next);
        updateAdminSettings(next);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleExport = async () => {
        setIsExportingBackup(true);
        setBackupNotice('');
        try {
            const backup = await buildSystemBackup({
                adminSettings,
                users: allUsers,
                pricingTiers,
                leads,
                proposals,
                hostPayments,
                crmNotes,
            });
            const dataStr = JSON.stringify(backup, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const date = new Date().toISOString().split('T')[0];
            a.download = `smart-rental-system-backup-${date}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            const riskyHosts = backup.hosts.filter(item => item.status !== 'ok').length;
            setBackupNotice(`Đã tạo backup tổng hệ thống. ${backup.summary.totalHosts} host, ${riskyHosts} host cần kiểm tra lưu trữ.`);
        } catch (error: any) {
            setBackupNotice(`Không thể tạo backup tổng hệ thống: ${error?.message || String(error)}`);
        } finally {
            setIsExportingBackup(false);
        }
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content && importData) {
                if (window.confirm("Cảnh báo: Việc này sẽ ghi đè và merge dữ liệu vào hệ thống. Bạn có chắc chắn?")) {
                    const success = importData(content);
                    if (success) {
                        alert("Đã phục hồi dữ liệu thành công!");
                    } else {
                        alert("Lỗi khi đọc file phục hồi dữ liệu.");
                    }
                }
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateAdminSettings(form);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const addSalesEmail = () => {
        if (!newEmail.trim()) return;
        setForm(prev => ({ ...prev, salesTeamEmails: [...(prev.salesTeamEmails || []), newEmail.trim()] }));
        setNewEmail('');
    };

    const removeSalesEmail = (email: string) => {
        setForm(prev => ({ ...prev, salesTeamEmails: prev.salesTeamEmails?.filter(e => e !== email) || [] }));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2"><Settings size={24} className="text-slate-500" /> Cài đặt hệ thống</h1>
                {showSuccess && <div className="flex items-center gap-2 text-green-500 font-medium animate-bounce"><CheckCircle size={20} /> Đã lưu!</div>}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit overflow-x-auto">
                <button onClick={() => setActiveTab('email')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'email' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}><Mail size={16} /> Cấu hình Email</button>
                <button onClick={() => setActiveTab('templates')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'templates' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}><FileText size={16} /> Mẫu Email</button>
                <button onClick={() => setActiveTab('payment')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'payment' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}><Settings size={16} /> Thanh toán hệ thống</button>
                <button onClick={() => setActiveTab('subscription')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'subscription' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}><CheckCircle size={16} /> Subscription</button>
                <button onClick={() => setActiveTab('data')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'data' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}><Database size={16} /> Dữ liệu</button>
            </div>

            <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">

                {activeTab === 'email' && (
                    <div className="p-6 space-y-6">
                        {/* Admin & Sales email */}
                        <div>
                            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-300"><Mail size={16} className="text-blue-500" /> Email Quản trị</h3>
                            <div className="hidden grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10">
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Host có Google Sheet</p>
                                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{configuredHostCount}</p>
                                </div>
                                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10">
                                    <p className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wide">Host local-only</p>
                                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">{localOnlyHostCount}</p>
                                </div>
                                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-900/10">
                                    <p className="text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wide">Host chưa được bảo vệ</p>
                                    <p className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">{unprotectedHostCount}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-500 mb-1">Email Admin</label>
                                    <input type="email" required className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={form.adminEmail} onChange={e => setForm({ ...form, adminEmail: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-500 mb-1">Email Sales chính</label>
                                    <input type="email" required className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500" value={form.salesEmail} onChange={e => setForm({ ...form, salesEmail: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Sales team emails */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-700 dark:text-slate-300"><Users size={16} className="text-purple-500" /> Danh sách email đội Sales</h3>
                            <div className="space-y-2 mb-3">
                                {form.salesTeamEmails?.map(email => (
                                    <div key={email} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                        <Mail size={14} className="text-slate-400" />
                                        <span className="flex-1 text-sm">{email}</span>
                                        <button type="button" onClick={() => removeSalesEmail(email)} className="p-1 text-red-400 hover:text-red-600"><X size={14} /></button>
                                    </div>
                                ))}
                                {(!form.salesTeamEmails || form.salesTeamEmails.length === 0) && (
                                    <p className="text-sm text-slate-400 italic">Chưa có email nào.</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <input type="email" placeholder="sales@example.com" className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-purple-500" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                                <button type="button" onClick={addSalesEmail} className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 flex items-center gap-1.5 shadow-lg shadow-purple-600/20"><Plus size={14} /> Thêm</button>
                            </div>
                        </div>

                        {/* Push email test */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-700 dark:text-slate-300"><Send size={16} className="text-green-500" /> Gửi email đẩy</h3>
                            <p className="text-sm text-slate-500 mb-3">Gửi test email đến đội Sales để kiểm tra cấu hình.</p>
                            <button type="button" onClick={() => alert('Email test đã được gửi đến tất cả email Sales!')} className="px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 flex items-center gap-1.5">
                                <Send size={14} /> Gửi email test
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="p-6 space-y-6">
                        <p className="text-sm text-slate-500">Dùng <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{'{{biến}}'}</code> để chèn dữ liệu tự động.</p>
                        {[
                            { key: 'billReminder', label: 'Nhắc nợ', desc: 'Biến: tenant, period, amount, dueDate', icon: '💰' },
                            { key: 'welcomeTenant', label: 'Chào mừng người thuê', desc: 'Biến: tenant, building, room', icon: '🏠' },
                            { key: 'contractExpiry', label: 'Hết hạn hợp đồng', desc: 'Biến: contractId, endDate', icon: '📋' }
                        ].map(t => (
                            <div key={t.key}>
                                <label className="block text-sm font-medium mb-1">{t.icon} {t.label}</label>
                                <p className="text-xs text-slate-400 mb-1">{t.desc}</p>
                                <textarea className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                                    value={(form.emailTemplates as any)?.[t.key] || ''}
                                    onChange={e => setForm({ ...form, emailTemplates: { ...form.emailTemplates, [t.key]: e.target.value } })} />
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'payment' && (
                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-300"><Settings size={16} className="text-blue-500" /> Thanh toán Host & Khóa dịch vụ</h3>
                            <p className="text-sm text-slate-500 mb-4">Cấu hình thông tin nhận tiền phí phần mềm từ Host và số ngày cho phép trễ hạn.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-slate-500 mb-1">Ngân hàng</label>
                                        <input type="text" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.paymentConfig?.bankName || ''}
                                            onChange={e => setForm({ ...form, paymentConfig: { ...form.paymentConfig, bankName: e.target.value } as any })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-500 mb-1">Số tài khoản</label>
                                        <input type="text" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.paymentConfig?.accountNumber || ''}
                                            onChange={e => setForm({ ...form, paymentConfig: { ...form.paymentConfig, accountNumber: e.target.value } as any })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-500 mb-1">Tên chủ tài khoản</label>
                                        <input type="text" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.paymentConfig?.accountName || ''}
                                            onChange={e => setForm({ ...form, paymentConfig: { ...form.paymentConfig, accountName: e.target.value } as any })} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-slate-500 mb-1">Số ngày ân hạn (Grace Period)</label>
                                        <div className="relative">
                                            <input type="number" min="0" className="w-full p-2.5 pr-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-red-500"
                                                value={form.paymentConfig?.gracePeriodDays || 0}
                                                onChange={e => setForm({ ...form, paymentConfig: { ...form.paymentConfig, gracePeriodDays: parseInt(e.target.value) || 0 } as any })} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">ngày</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">Host quá hạn số ngày này sẽ bị khóa tính năng.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-500 mb-1">Webhook URL Tạo QR (Tùy chọn)</label>
                                        <input type="url" placeholder="https://api.vietqr.io/..." className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.paymentConfig?.webhookUrl || ''}
                                            onChange={e => setForm({ ...form, paymentConfig: { ...form.paymentConfig, webhookUrl: e.target.value } as any })} />
                                        <p className="text-xs text-slate-400 mt-1">Sử dụng dịch vụ tạo QR động nếu thanh toán tích hợp tự động.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Sheet Integration */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-300">📊 Google Sheet Integration</h3>
                            <p className="text-sm text-slate-500 mb-4">Nhập URL webhook của Google Apps Script (masterscript.gs) đã deploy. Hệ thống sẽ tự tạo Google Sheet cho mỗi Host khi duyệt tài khoản.</p>
                            <div>
                                <label className="block text-sm text-slate-500 mb-1">Google Sheet Webhook URL</label>
                                <input type="url" placeholder="https://script.google.com/macros/s/xxxxx/exec" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={form.googleSheetWebhookUrl || ''}
                                    onChange={e => setForm({ ...form, googleSheetWebhookUrl: e.target.value })} />
                                <p className="text-xs text-slate-400 mt-1">Để trống nếu muốn dùng chế độ Demo (tạo link giả lập).</p>
                            </div>
                        </div>

                        {/* Landing Page Background Image */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-300">🖼️ Hình nền Landing Page</h3>
                            <p className="text-sm text-slate-500 mb-4">Cấu hình hình nền mờ phía sau cho trang chủ giới thiệu sản phẩm (business, estate, apartment,...).</p>
                            <div>
                                <label className="block text-sm text-slate-500 mb-1">URL ảnh nền</label>
                                <input type="url" placeholder="https://images.unsplash.com/..." className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={form.landingBackgroundUrl || ''}
                                    onChange={e => setForm({ ...form, landingBackgroundUrl: e.target.value })} />
                                <p className="text-xs text-slate-400 mt-1">Để trống sẽ dùng ảnh mặc định. Nên dùng ảnh ngang (landscape), kích thước lớn (1920px+).</p>
                            </div>
                            {form.landingBackgroundUrl && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-32 bg-gray-950">
                                    <img src={form.landingBackgroundUrl} alt="Preview" className="w-full h-full object-cover opacity-30 blur-sm" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'data' && (
                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-300"><Database size={16} className="text-blue-500" /> Quản lý Dữ liệu</h3>
                            <p className="text-sm text-slate-500 mb-6">Bạn có thể tạo bản sao lưu toàn bộ dữ liệu ứng dụng về máy cá nhân dưới dạng JSON để đề phòng rủi ro, hoặc phục hồi hệ thống từ bản sao lưu cũ.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Download size={16} className="text-emerald-500" /> Tải về máy (Backup)</h4>
                                    <p className="text-xs text-slate-500 mb-4 h-10">Sao lưu toàn bộ phòng, người dùng, cơ sở vật chất, hợp đồng, hóa đơn,...</p>
                                    <button type="button" onClick={handleExport} disabled={isExportingBackup} className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                                        {isExportingBackup ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                        Tạo và Tải File Backup
                                    </button>
                                </div>
                                <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Upload size={16} className="text-amber-500" /> Phục hồi dữ liệu (Restore)</h4>
                                    <p className="text-xs text-slate-500 mb-4 h-10">Khôi phục từ file JSON. Dữ liệu sẽ được tự động đồng bộ lên máy chủ đám mây.</p>
                                    <label className="w-full px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-amber-500 dark:hover:border-amber-500 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                                        <Upload size={16} className="text-slate-400 group-hover:text-amber-500" />
                                        <span>Chọn File JSON...</span>
                                        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                                    </label>
                                </div>
                            </div>

                            {backupNotice && (
                                <div className={`mt-4 p-4 rounded-xl border text-sm flex items-start gap-2 ${backupNotice.startsWith('Kh') ? 'border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-300' : 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300'}`}>
                                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                    <span>{backupNotice}</span>
                                </div>
                            )}

                            <div className="mt-6 space-y-3">
                                <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Trạng thái lưu trữ theo host</h4>
                                {hostUsers.length === 0 ? (
                                    <p className="text-sm text-slate-500 italic">Chưa có host nào trong hệ thống.</p>
                                ) : (
                                    hostUsers.map(host => {
                                        const hasRemoteSheet = Boolean(adminSettings.googleSheetWebhookUrl?.trim()) && Boolean(host.googleSheetId) && !host.googleSheetId?.startsWith('local_');
                                        const isLocalOnly = (host.googleSheetId || '').startsWith('local_');
                                        const statusLabel = hasRemoteSheet ? 'Google Sheet' : isLocalOnly ? 'Local-only' : 'Chưa bảo vệ';
                                        const statusClass = hasRemoteSheet
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                                            : isLocalOnly
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300';

                                        return (
                                            <div key={host.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{host.name}</p>
                                                    <p className="text-xs text-slate-500">{host.email}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{host.googleSheetId || 'Chưa có googleSheetId'}</p>
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass}`}>{statusLabel}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'subscription' && (
                    <div className="p-6">
                        <AdminSubscriptionControlPanel
                            value={form}
                            onChange={setForm}
                            onPersist={persistSettings}
                        />
                    </div>
                )}

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-600/20"><Save size={16} /> Lưu cài đặt</button>
                </div>
            </form>
        </div>
    );
}
