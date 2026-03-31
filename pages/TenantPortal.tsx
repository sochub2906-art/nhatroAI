import React from 'react';
import { useApp, formatCurrency } from '../AppContext';
import { Home, CreditCard, FileText, AlertCircle, CheckCircle, Clock, LogOut, Moon, Sun, Sparkles, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDateVN } from '../utils/dateFormat';

export default function TenantPortal() {
    const { currentUser, rooms, contracts, payments, buildings, equipment, theme, toggleTheme, logout } = useApp();
    const navigate = useNavigate();

    if (!currentUser || currentUser.role !== 'TENANT') {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Không có quyền truy cập.</div>;
    }

    const myRoom = rooms.find(r => r.id === currentUser.linkedRoomId);
    const myContract = contracts.find(c => c.id === currentUser.linkedContractId);
    const myBuilding = myRoom ? buildings.find(b => b.id === myRoom.buildingId) : null;
    const myEquipment = equipment.filter(e => e.roomId === currentUser.linkedRoomId);
    const myPayments = payments.filter(p => p.contractId === currentUser.linkedContractId).sort((a, b) => b.dueDate.localeCompare(a.dueDate));
    const totalDebt = myPayments.filter(p => p.status !== 'Đã đóng').reduce((s, p) => s + p.amount, 0);
    const overdueCount = myPayments.filter(p => p.status === 'Quá hạn').length;

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Smart Rental</span>
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

            <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                {/* Welcome */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-600/10">
                    <p className="text-sm text-blue-200 mb-1">Xin chào,</p>
                    <h1 className="text-2xl font-bold mb-4">{currentUser.name}</h1>
                    <div className="flex items-center gap-6 text-sm">
                        <div>
                            <p className="text-blue-200">Phòng</p>
                            <p className="font-bold text-lg">{myRoom?.name || '—'}</p>
                        </div>
                        <div className="w-px h-10 bg-white/20"></div>
                        <div>
                            <p className="text-blue-200">Tòa nhà</p>
                            <p className="font-bold text-lg">{myBuilding?.name || '—'}</p>
                        </div>
                        <div className="w-px h-10 bg-white/20"></div>
                        <div>
                            <p className="text-blue-200">Giá thuê</p>
                            <p className="font-bold text-lg">{myRoom ? formatCurrency(myRoom.price) : '—'}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className={`rounded-2xl p-5 border shadow-sm ${totalDebt > 0 ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className={`w-5 h-5 ${totalDebt > 0 ? 'text-red-500' : 'text-green-500'}`} />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Tổng nợ</span>
                        </div>
                        <p className={`text-2xl font-bold ${totalDebt > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                            {formatCurrency(totalDebt)}
                        </p>
                    </div>
                    <div className={`rounded-2xl p-5 border shadow-sm ${overdueCount > 0 ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            {overdueCount > 0 ? <AlertCircle className="w-5 h-5 text-amber-500" /> : <CheckCircle className="w-5 h-5 text-green-500" />}
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Quá hạn</span>
                        </div>
                        <p className={`text-2xl font-bold ${overdueCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>
                            {overdueCount} khoản
                        </p>
                    </div>
                </div>

                {/* Contract Info */}
                {myContract && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h2 className="font-bold text-lg flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
                            <FileText className="w-5 h-5 text-blue-500" /> Hợp đồng
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-slate-500">Mã HĐ:</span> <span className="font-medium text-slate-900 dark:text-white">{myContract.id}</span></div>
                            <div><span className="text-slate-500">Trạng thái:</span> <span className={`font-medium ${myContract.isActive ? 'text-green-600' : 'text-red-500'}`}>{myContract.isActive ? 'Đang hiệu lực' : 'Đã kết thúc'}</span></div>
                                        <div><span className="text-slate-500">Bắt đầu:</span> <span className="font-medium text-slate-900 dark:text-white">{formatDateVN(myContract.startDate, myContract.startDate)}</span></div>
                                        <div><span className="text-slate-500">Kết thúc:</span> <span className="font-medium text-slate-900 dark:text-white">{formatDateVN(myContract.endDate, myContract.endDate)}</span></div>
                            <div><span className="text-slate-500">Điện:</span> <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(myContract.electricPrice)}/kWh</span></div>
                            <div><span className="text-slate-500">Nước:</span> <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(myContract.waterPrice)}/m³</span></div>
                        </div>
                        {/* Extra Services */}
                        {myContract.extraServices && myContract.extraServices.filter(s => s.enabled).length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm font-medium text-slate-500 mb-2">Dịch vụ phụ</h3>
                                <div className="flex flex-wrap gap-2">
                                    {myContract.extraServices.filter(s => s.enabled).map(s => (
                                        <span key={s.id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-800">
                                            {s.name} — {formatCurrency(s.unitPrice)}/{s.unit}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Equipment */}
                {myEquipment.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h2 className="font-bold text-lg flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
                            <Building className="w-5 h-5 text-purple-500" /> Trang thiết bị phòng
                        </h2>
                        <div className="space-y-2">
                            {myEquipment.map(eq => (
                                <div key={eq.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm">
                                    <span className="font-medium text-slate-800 dark:text-slate-200">{eq.name}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${eq.status === 'Tốt' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                        {eq.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Payment History */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h2 className="font-bold text-lg flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
                        <CreditCard className="w-5 h-5 text-emerald-500" /> Lịch sử thanh toán
                    </h2>
                    {myPayments.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-8">Chưa có phiếu thu nào.</p>
                    ) : (
                        <div className="space-y-3">
                            {myPayments.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{p.type} — Kỳ {p.period}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        <p className="text-xs text-slate-500">{formatDateVN(p.dueDate, p.dueDate)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-slate-900 dark:text-white">{formatCurrency(p.amount)}</p>
                                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold
                                            ${p.status === 'Đã đóng' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                p.status === 'Quá hạn' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                            {p.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
