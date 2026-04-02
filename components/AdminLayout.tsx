import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { Shield, LayoutDashboard, Users, Building, Settings, LogOut, Moon, Sun, Sparkles, CreditCard, Briefcase, Menu, X, Bell, Globe, ShieldCheck } from 'lucide-react';

const AdminSideLink = ({ to, icon: Icon, children, onClick }: { to: string; icon: any; children: React.ReactNode; onClick?: () => void }) => (
    <NavLink to={to} end onClick={onClick} className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${isActive
            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/20 font-medium'
            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white'}`
    }>
        <Icon className="w-[18px] h-[18px]" />
        <span>{children}</span>
    </NavLink>
);

export default function AdminLayout() {
    const { currentUser, theme, toggleTheme, logout } = useApp();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const adminRoles = ['SUPER_ADMIN', 'ADMIN_L2', 'ACCOUNTANT'] as const;
    if (!currentUser || !adminRoles.includes(currentUser.role as any)) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Không có quyền truy cập.</div>;
    }

    const handleLogout = () => { logout(); navigate('/login'); };
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm" onClick={closeSidebar} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:relative z-50 w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-out shadow-xl lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Logo */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-500" />
                        <h1 className="text-lg font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">Admin Panel</h1>
                    </div>
                    <button className="lg:hidden p-1 text-slate-400 hover:text-slate-600" onClick={closeSidebar}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Badge */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold">{currentUser.avatar}</div>
                        <div>
                            <p className="text-sm font-medium truncate">{currentUser.name}</p>
                            <p className="text-xs text-red-500 font-medium">Super Admin</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1 overflow-auto">
                    <AdminSideLink to="/admin/dashboard" icon={LayoutDashboard} onClick={closeSidebar}>Tổng quan</AdminSideLink>
                    <AdminSideLink to="/admin/users" icon={Users} onClick={closeSidebar}>Quản lý User</AdminSideLink>
                    <AdminSideLink to="/admin/sales" icon={Briefcase} onClick={closeSidebar}>Quản lý Sales</AdminSideLink>
                    <AdminSideLink to="/admin/hosts" icon={Building} onClick={closeSidebar}>Quản lý Host</AdminSideLink>
                    <AdminSideLink to="/admin/plans" icon={CreditCard} onClick={closeSidebar}>Gói dịch vụ</AdminSideLink>
                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                        <AdminSideLink to="/admin/cms" icon={Globe} onClick={closeSidebar}>Quản lý CMS</AdminSideLink>
                        <AdminSideLink to="/admin/roles" icon={ShieldCheck} onClick={closeSidebar}>Phân quyền</AdminSideLink>
                        <AdminSideLink to="/admin/settings" icon={Settings} onClick={closeSidebar}>Cài đặt hệ thống</AdminSideLink>
                    </div>
                </nav>

                {/* Bottom actions */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <button onClick={toggleTheme} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full">
                        {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                        <span>{theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}</span>
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full">
                        <LogOut className="w-[18px] h-[18px]" /><span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Topbar */}
                <header className="h-14 flex items-center justify-between px-4 lg:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
                    <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="lg:hidden flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-bold text-red-500">Admin</span>
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                        <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors lg:hidden" title="Chuyển chế độ sáng/tối">
                            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                        </button>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full relative transition-colors">
                            <Bell className="w-[18px] h-[18px]" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 lg:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
