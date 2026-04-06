import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    Building,
    CreditCard,
    Home,
    LayoutDashboard,
    LogOut,
    Map,
    Menu,
    Moon,
    QrCode,
    Settings,
    Sparkles,
    Sun,
    TrendingUp,
    Users,
    Wrench,
    X,
    FileText,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency, useApp } from '../AppContext';
import NotificationBell from './NotificationBell';

function SidebarLink({
    to,
    icon: Icon,
    children,
}: {
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
}) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`
            }
        >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{children}</span>
        </NavLink>
    );
}

const PAGE_TITLES: Array<{ match: string; title: string }> = [
    { match: '/app/revenue', title: 'Doanh thu chi tiết' },
    { match: '/app/dashboard', title: 'Tổng quan host' },
    { match: '/app/buildings', title: 'Tòa nhà' },
    { match: '/app/map', title: 'Sơ đồ nhà' },
    { match: '/app/rooms', title: 'Phòng trọ' },
    { match: '/app/customers', title: 'Khách thuê' },
    { match: '/app/contracts', title: 'Hợp đồng' },
    { match: '/app/payments', title: 'Thu chi & Công nợ' },
    { match: '/app/equipment', title: 'Trang thiết bị' },
    { match: '/app/settings', title: 'Cài đặt' },
];

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [showQR, setShowQR] = React.useState(false);
    const { currentUser, theme, toggleTheme, logout, hostPayments, adminSettings, updateHostPaymentStatus, hostFeatureFlags } = useApp();
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    if (location.pathname === '/') return <Outlet />;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const pageTitle = PAGE_TITLES.find(item => location.pathname.startsWith(item.match))?.title || 'Smart Rental';
    const isHost = currentUser?.role === 'HOST';
    const paymentConfig = adminSettings?.paymentConfig;
    const graceDays = paymentConfig?.gracePeriodDays ?? 5;

    let isBlocked = false;
    let blockReason = '';
    let dueAmount = 0;
    let overduePaymentIds: string[] = [];

    if (isHost) {
        const overduePayments = hostPayments.filter(payment => {
            if (payment.hostId !== currentUser.id || payment.status === 'Đã đóng') return false;
            const due = new Date(payment.dueDate);
            const limit = new Date(due.getTime() + graceDays * 24 * 60 * 60 * 1000);
            return new Date() > limit;
        });

        if (overduePayments.length > 0) {
            isBlocked = true;
            overduePaymentIds = overduePayments.map(payment => payment.id);
            dueAmount = overduePayments.reduce((sum, payment) => sum + payment.amount, 0);
            blockReason = `Tài khoản đã quá hạn thanh toán ${graceDays} ngày phí dịch vụ phần mềm.`;
        }
    }

    const handleConfirmPayment = () => {
        overduePaymentIds.forEach(id => updateHostPaymentStatus(id, 'Đã đóng'));
        alert('Đã xác nhận thanh toán. Hóa đơn điện tử sẽ được gửi về email của bạn.');
    };

    const ff = hostFeatureFlags;

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Đóng menu"
                    className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`mobile-safe-top mobile-safe-bottom fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-base font-semibold text-slate-900 dark:text-white">Smart Rental</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Host workspace</div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {currentUser && (
                    <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-800/70">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white">
                                {currentUser.avatar || currentUser.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <div className="truncate font-semibold text-slate-900 dark:text-white">{currentUser.name}</div>
                                <div className="truncate text-xs font-medium text-blue-600 dark:text-blue-400">
                                    {currentUser.role === 'HOST' ? 'Chủ nhà' : currentUser.role}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
                    {ff.dashboard && <SidebarLink to="/app/dashboard" icon={LayoutDashboard}>Tổng quan</SidebarLink>}
                    {ff.buildings && <SidebarLink to="/app/buildings" icon={Building}>Tòa nhà</SidebarLink>}
                    {ff.roomMap && <SidebarLink to="/app/map" icon={Map}>Sơ đồ nhà</SidebarLink>}
                    {ff.rooms && <SidebarLink to="/app/rooms" icon={Home}>Phòng trọ</SidebarLink>}
                    {ff.customers && <SidebarLink to="/app/customers" icon={Users}>Khách thuê</SidebarLink>}
                    {ff.contracts && <SidebarLink to="/app/contracts" icon={FileText}>Hợp đồng</SidebarLink>}
                    {ff.payments && <SidebarLink to="/app/payments" icon={CreditCard}>Thu chi & Công nợ</SidebarLink>}
                    {ff.payments && <SidebarLink to="/app/revenue" icon={TrendingUp}>Doanh thu</SidebarLink>}
                    {ff.equipment ? (
                        <SidebarLink to="/app/equipment" icon={Wrench}>Trang thiết bị</SidebarLink>
                    ) : (
                        <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-400 dark:text-slate-600">
                            <Wrench className="h-5 w-5 shrink-0" />
                            <span>Trang thiết bị</span>
                            <span className="ml-auto rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                                Pro
                            </span>
                        </div>
                    )}

                    <div className="pt-2">
                        <SidebarLink to="/app/settings" icon={Settings}>Cài đặt</SidebarLink>
                    </div>
                </nav>

                <div className="border-t border-slate-100 p-4 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            <main className="flex min-w-0 flex-1 flex-col">
                <header className="mobile-safe-top glass-panel sticky top-0 z-30 border-b border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/85">
                    <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
                        <button
                            type="button"
                            className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className="min-w-0 flex-1">
                            <h1 className="truncate text-lg font-semibold text-slate-900 dark:text-white">{pageTitle}</h1>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">Quản lý nhanh trên mobile và desktop</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                title="Chuyển sáng tối"
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                            <NotificationBell />
                        </div>
                    </div>
                </header>

                <div className="relative flex-1 min-w-0 overflow-hidden">
                    <div className="mobile-safe-bottom h-full min-w-0 overflow-y-auto p-3 sm:p-6">
                        {isBlocked && (
                            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-md">
                                <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-red-100 bg-white p-6 text-center shadow-2xl dark:border-red-900/30 dark:bg-slate-900 sm:p-8">
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 to-rose-500" />
                                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                                    </div>
                                    <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Mở khóa dịch vụ</h2>
                                    <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
                                        {blockReason} Vui lòng gia hạn để tiếp tục dùng đầy đủ tính năng.
                                    </p>

                                    <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-700 dark:bg-slate-800">
                                        <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
                                            <span className="text-sm text-slate-500">Số tiền cần đóng</span>
                                            <span className="text-xl font-semibold text-rose-600 dark:text-rose-400">{formatCurrency(dueAmount)}</span>
                                        </div>

                                        {showQR ? (
                                            <div className="rounded-2xl bg-white p-4">
                                                <QRCodeSVG
                                                    value={`vietqr://${paymentConfig?.bankName || 'vietcombank'}?account=${paymentConfig?.accountNumber || '0901234567'}&amount=${dueAmount}&desc=GIAHAN ${currentUser?.id}`}
                                                    size={220}
                                                    className="mx-auto"
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                                                <div className="flex justify-between gap-3">
                                                    <span className="text-slate-500">Ngân hàng</span>
                                                    <span className="text-right font-medium">{paymentConfig?.bankName || 'Vietcombank'}</span>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <span className="text-slate-500">Số tài khoản</span>
                                                    <span className="text-right font-medium">{paymentConfig?.accountNumber || '0901234567'}</span>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <span className="text-slate-500">Chủ tài khoản</span>
                                                    <span className="text-right font-medium">{paymentConfig?.accountName || 'SMART RENTAL'}</span>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <span className="text-slate-500">Nội dung</span>
                                                    <span className="text-right font-medium text-blue-600 dark:text-blue-400">GIAHAN {currentUser?.id}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {!showQR ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowQR(true)}
                                            className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-medium text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700"
                                        >
                                            <QrCode className="h-5 w-5" />
                                            Tải mã QR thanh toán
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleConfirmPayment}
                                            className="mb-3 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-green-700"
                                        >
                                            Xác nhận đã thanh toán
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={`min-w-0 ${isBlocked ? 'pointer-events-none opacity-30 blur-sm' : ''}`}>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
