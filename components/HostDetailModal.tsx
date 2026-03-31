import React, { useState, useEffect } from 'react';
import { useApp, formatCurrency } from '../AppContext';
import { X, Mail, Phone, MapPin, Building, Home, CheckCircle, AlertCircle, Send, Plus, Search, Calendar, CreditCard, QrCode, Settings, PieChart, BadgeCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDateTimeVN } from '../utils/dateFormat';

interface HostDetailModalProps {
    hostId: string;
    onClose: () => void;
}

export default function HostDetailModal({ hostId, onClose }: HostDetailModalProps) {
    const { allUsers, buildings, rooms, hostPayments, crmNotes, addCrmNote, sendHostPaymentReminder, pricingTiers, currentUser, adminSettings } = useApp();
    const [activeTab, setActiveTab] = useState<'info' | 'crm' | 'payment'>('info');
    const [noteContent, setNoteContent] = useState('');
    const [showReminderForm, setShowReminderForm] = useState(false);

    const host = allUsers.find(u => u.id === hostId);
    if (!host) return null;

    const hostBuildings = buildings.filter(b => b.hostId === hostId);
    const hostRooms = rooms.filter(r => hostBuildings.map(b => b.id).includes(r.buildingId));
    const hPayments = hostPayments.filter(p => p.hostId === hostId);
    const hNotes = crmNotes.filter(n => n.hostId === hostId);
    const currentPlan = pricingTiers.find(p => p.id === host.subscriptionPlanId);

    const paymentConfig = adminSettings?.paymentConfig;

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteContent.trim() || !currentUser) return;
        addCrmNote({
            hostId,
            authorId: currentUser.id,
            content: noteContent
        });
        setNoteContent('');
        setActiveTab('crm');
    };

    const handleSendReminder = (paymentId: string, amount: number) => {
        sendHostPaymentReminder(hostId, amount);
        if (currentUser) {
            addCrmNote({
                hostId,
                authorId: currentUser.id,
                content: `Hệ thống đã gửi nhắc nợ số tiền ${formatCurrency(amount)}.`
            });
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors = {
            'Đã đóng': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
            'Chờ thanh toán': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
            'Quá hạn': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
            'active': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col relative shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-slide-up">

                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold uppercase shadow-inner">
                            {host.avatar || host.name.substring(0, 2)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold">{host.name}</h2>
                                {host.status && <StatusBadge status={host.status} />}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-4">
                                <span className="flex items-center gap-1.5"><Mail size={14} />{host.email}</span>
                                <span className="flex items-center gap-1.5"><Phone size={14} />{host.phone}</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white rounded-full transition-colors shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs Config */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 mt-2 overflow-x-auto custom-scrollbar">
                    <button onClick={() => setActiveTab('info')} className={`pb-3 px-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'info' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                        Tổng quan Host
                    </button>
                    <button onClick={() => setActiveTab('crm')} className={`pb-3 px-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'crm' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                        Lịch sử CRM ({hNotes.length})
                    </button>
                    <button onClick={() => setActiveTab('payment')} className={`pb-3 px-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'payment' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                        Hóa đơn & Nhắc nợ ({hPayments.filter(p => p.status !== 'Đã đóng').length})
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-6 bg-slate-50/20 dark:bg-slate-900">

                    {/* TAB: INFO */}
                    {activeTab === 'info' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2"><Building size={16} className="text-blue-500" /> Tài sản quản lý</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{hostBuildings.length}</p>
                                            <p className="text-sm text-slate-500 mt-1">Tòa nhà</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{hostRooms.length}</p>
                                            <p className="text-sm text-slate-500 mt-1">Phòng trọ</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2"><Settings size={16} className="text-amber-500" /> Gói phần mềm</h3>
                                    {currentPlan ? (
                                        <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                                            <div>
                                                <div className="font-bold text-amber-700 dark:text-amber-500">{currentPlan.name}</div>
                                                <div className="text-sm text-amber-600 dark:text-amber-400/80 mt-1">{formatCurrency(currentPlan.price)}/tháng</div>
                                            </div>
                                            <div className="text-right text-xs text-amber-700/70 dark:text-amber-500/70 space-y-1">
                                                <p>Max: {currentPlan.maxBuildings} Tòa</p>
                                                <p>Max: {currentPlan.maxRooms} Phòng</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500 italic">Chưa đăng ký gói cước.</p>
                                    )}
                                </div>
                            </div>

                            {/* KYC Info Section */}
                            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm mt-6">
                                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2"><BadgeCheck size={16} className="text-blue-500" /> Xác minh danh tính (KYC)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                        <p className="text-sm text-slate-500 mb-1">Số CCCD/CMND</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">{host.idNumber || <span className="text-slate-400 italic">Chưa cập nhật</span>}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                        <p className="text-sm text-slate-500 mb-1">Ngày cấp</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">{host.idIssueDate || <span className="text-slate-400 italic">Chưa cập nhật</span>}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                        <p className="text-sm text-slate-500 mb-1">Nơi cấp</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">{host.idIssuePlace || <span className="text-slate-400 italic">Chưa cập nhật</span>}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm mt-6">
                                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2"><PieChart size={16} className="text-purple-500" /> Tóm tắt doanh thu kỳ</h3>
                                {/* Lấy tổng tiền dịch vụ phần mềm đã trả và chưa trả */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle size={16} /></div>
                                            <div>
                                                <p className="text-sm font-medium">Đã thanh toán khoản phí</p>
                                                <p className="text-xs text-slate-500">{hPayments.filter(p => p.status === 'Đã đóng').length} kỳ</p>
                                            </div>
                                        </div>
                                        <div className="font-bold text-emerald-600">
                                            {formatCurrency(hPayments.filter(p => p.status === 'Đã đóng').reduce((a, b) => a + b.amount, 0))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center"><AlertCircle size={16} /></div>
                                            <div>
                                                <p className="text-sm font-medium">Đang nợ phần mềm</p>
                                                <p className="text-xs text-slate-500">{hPayments.filter(p => p.status !== 'Đã đóng').length} kỳ</p>
                                            </div>
                                        </div>
                                        <div className="font-bold text-rose-600">
                                            {formatCurrency(hPayments.filter(p => p.status !== 'Đã đóng').reduce((a, b) => a + b.amount, 0))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: PAYMENT & REMINDER */}
                    {activeTab === 'payment' && (
                        <div className="space-y-4">
                            {hPayments.length === 0 ? (
                                <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 mb-4">Host này chưa có lịch sử hóa đơn phần mềm nào.</p>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-medium">
                                                <th className="p-4">Kỳ</th>
                                                <th className="p-4">Hạn đóng</th>
                                                <th className="p-4">Trạng thái</th>
                                                <th className="p-4 text-right">Số tiền</th>
                                                <th className="p-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {hPayments.map((p, idx) => {
                                                const isOverdue = p.dueDate && new Date(p.dueDate) < new Date() && p.status !== 'Đã đóng';
                                                const actualStatus = isOverdue ? 'Quá hạn' : p.status;

                                                return (
                                                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="p-4 font-medium text-slate-900 dark:text-white uppercase">{p.period}</td>
                                                        <td className="p-4 text-slate-500">{p.dueDate}</td>
                                                        <td className="p-4"><StatusBadge status={actualStatus} /></td>
                                                        <td className="p-4 text-right font-medium">{formatCurrency(p.amount)}</td>
                                                        <td className="p-4 text-right">
                                                            {actualStatus !== 'Đã đóng' && (
                                                                <button
                                                                    onClick={() => { setShowReminderForm(true); setNoteContent(`Nhắc nhở hóa đơn kỳ ${p.period} (${formatCurrency(p.amount)})`); }}
                                                                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg font-medium transition-colors text-xs flex items-center justify-center gap-1.5 ml-auto">
                                                                    <Send size={14} /> Nhắc nợ
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {showReminderForm && (
                                <div className="bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-2xl p-6 mt-6 animate-fade-in relative z-10" id="reminder-box">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <QrCode className="text-blue-500" /> Nhắc nợ thanh toán (Email / Zalo)
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                        <div className="space-y-4">
                                            <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                                <p className="text-slate-500 mb-2 uppercase font-bold text-xs tracking-wider">Thông tin chuyển khoản Admin</p>
                                                <div className="flex justify-between"><span>Ngân hàng:</span> <span className="font-semibold">{paymentConfig?.bankName || 'Vietcombank'}</span></div>
                                                <div className="flex justify-between"><span>Số TK:</span> <span className="font-semibold">{paymentConfig?.accountNumber || '0123456789'}</span></div>
                                                <div className="flex justify-between"><span>Chủ TK:</span> <span className="font-semibold">{paymentConfig?.accountName || 'SMART RENTAL'}</span></div>
                                                <div className="flex justify-between"><span>Nội dung:</span> <strong className="text-blue-600 dark:text-blue-400 font-bold">GIAHAN {hostId}</strong></div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1">Nội dung gửi</label>
                                                <textarea
                                                    value={noteContent}
                                                    onChange={e => setNoteContent(e.target.value)}
                                                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none text-sm"
                                                    placeholder="Nội dung nhắc nợ sẽ được gửi đi hoặc copy qua Zalo..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                            {paymentConfig?.webhookUrl ? (
                                                <img src={paymentConfig.webhookUrl} alt="QR Code" className="w-40 h-40 object-cover rounded-lg shadow-sm border border-slate-100" />
                                            ) : (
                                                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                                                    <QRCodeSVG value={`Bank: ${paymentConfig?.bankName}|Account: ${paymentConfig?.accountNumber}|Name: ${paymentConfig?.accountName}|Msg: GIAHAN ${hostId}`} size={160} />
                                                </div>
                                            )}
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-4">Mã QR Thanh Toán</p>
                                            <p className="text-xs text-slate-500 mt-1">Host có thể quét mã này bằng ứng dụng ngân hàng.</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-4">
                                        <button onClick={() => setShowReminderForm(false)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors text-sm">Hủy</button>
                                        <button onClick={() => { handleSendReminder('', 0); setShowReminderForm(false); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 font-medium transition-colors text-sm">
                                            <Send size={16} /> Gửi Email & Lưu CRM
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: CRM NOTES */}
                    {activeTab === 'crm' && (
                        <div>
                            <form onSubmit={handleAddNote} className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <Plus size={16} className="text-emerald-500" /> Thêm ghi chú mới (Cuộc gọi, Meeting, Nhắc nợ...)
                                </label>
                                <textarea
                                    value={noteContent}
                                    onChange={e => setNoteContent(e.target.value)}
                                    placeholder="Mô tả nội dung trao đổi, kết quả cuộc điện thoại, trạng thái gia hạn..."
                                    className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none mb-3 shadow-sm transition-all"
                                ></textarea>
                                <button type="submit" disabled={!noteContent.trim()} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 flex items-center gap-2 text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                    <CheckCircle size={16} /> Lưu Ghi Chú
                                </button>
                            </form>

                            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                                {hNotes.length === 0 ? (
                                    <div className="text-center p-8 relative z-10 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-slate-500">Chưa có lịch sử chăm sóc trên ứng dụng.</p>
                                    </div>
                                ) : (
                                    hNotes.map((note, idx) => {
                                        const author = allUsers.find(u => u.id === note.authorId);
                                        const isLatest = idx === 0;

                                        return (
                                            <div key={note.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                {/* Icon */}
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isLatest ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                                    <CheckCircle size={16} />
                                                </div>
                                                {/* Card */}
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                                                {author?.name.substring(0, 1)}
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{author?.name || 'Sales'}</span>
                                                        </div>
                                                        <time className="text-[11px] font-medium text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800">
                                        {formatDateTimeVN(note.createdAt, note.createdAt)}
                                                        </time>
                                                    </div>
                                                    <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                                        {note.content}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
