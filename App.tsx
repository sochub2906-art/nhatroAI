import React, { Suspense } from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { isHostMode, isAdminMode, isDevMode } from './firebase';

const Layout = React.lazy(() => import('./components/Layout'));
const AdminLayout = React.lazy(() => import('./components/AdminLayout'));

const Landing = React.lazy(() => import('./pages/Landing'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const AdminLoginPage = React.lazy(() => import('./pages/AdminLogin'));
const DemoPreview = React.lazy(() => import('./pages/DemoPreview'));

const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminUsers = React.lazy(() => import('./pages/AdminUsers'));
const AdminHosts = React.lazy(() => import('./pages/AdminHosts'));
const AdminPlans = React.lazy(() => import('./pages/AdminPlans'));
const AdminSettingsPage = React.lazy(() => import('./pages/AdminSettings'));
const AdminSales = React.lazy(() => import('./pages/AdminSales'));
const AdminCMS = React.lazy(() => import('./pages/AdminCMS'));
const AdminRoles = React.lazy(() => import('./pages/AdminRoles'));

const SalesDashboard = React.lazy(() => import('./pages/SalesDashboard'));
const DynamicPage = React.lazy(() => import('./pages/DynamicPage'));

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Revenue = React.lazy(() => import('./pages/Revenue'));
const Buildings = React.lazy(() => import('./pages/Buildings'));
const BuildingDetail = React.lazy(() => import('./pages/BuildingDetail'));
const RoomMap = React.lazy(() => import('./pages/RoomMap'));
const Rooms = React.lazy(() => import('./pages/Rooms'));
const RoomDetail = React.lazy(() => import('./pages/RoomDetail'));
const Customers = React.lazy(() => import('./pages/Customers'));
const CustomerDetail = React.lazy(() => import('./pages/CustomerDetail'));
const Contracts = React.lazy(() => import('./pages/Contracts'));
const Payments = React.lazy(() => import('./pages/Payments'));
const Equipment = React.lazy(() => import('./pages/EquipmentManager'));
const Settings = React.lazy(() => import('./pages/Settings'));

/** Detect PWA standalone mode (installed on home screen) */
const isPWA = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as any).standalone === true;

/** On PWA, skip landing and go straight to login */
function PWALandingRedirect() {
    if (isPWA) {
        return <Navigate to="/login" replace />;
    }
    return <LazyScreen><Landing /></LazyScreen>;
}

function RouteLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="h-3 w-3 animate-pulse rounded-full bg-blue-600" />
                <span className="text-sm font-medium">Đang tải giao diện...</span>
            </div>
        </div>
    );
}

function LazyScreen({ children }: { children: React.ReactNode }) {
    return <Suspense fallback={<RouteLoader />}>{children}</Suspense>;
}

export default function App() {
    const showHost = isHostMode || isDevMode;
    const showAdmin = isAdminMode || isDevMode;

    return (
        <AppProvider>
            <HashRouter>
                <Routes>
                    {showHost && (
                        <>
                            <Route path="/" element={<PWALandingRedirect />} />
                            <Route path="/p/:slug" element={<LazyScreen><DynamicPage /></LazyScreen>} />
                            
                            {/* SEO Money Pages (Managed via CMS) */}
                            <Route path="/phan-mem-quan-ly-nha-tro" element={<LazyScreen><DynamicPage slugOverride="phan-mem-quan-ly-nha-tro" /></LazyScreen>} />
                            <Route path="/app-quan-ly-phong-tro" element={<LazyScreen><DynamicPage slugOverride="app-quan-ly-phong-tro" /></LazyScreen>} />
                            <Route path="/quan-ly-nha-tro-bang-excel" element={<LazyScreen><DynamicPage slugOverride="quan-ly-nha-tro-bang-excel" /></LazyScreen>} />
                            <Route path="/phan-mem-tinh-tien-dien-nuoc" element={<LazyScreen><DynamicPage slugOverride="phan-mem-tinh-tien-dien-nuoc" /></LazyScreen>} />
                            
                            <Route path="/pricing" element={<LazyScreen><Pricing /></LazyScreen>} />
                            <Route path="/login" element={<LazyScreen><LoginPage /></LazyScreen>} />
                            <Route path="/demo" element={<LazyScreen><DemoPreview /></LazyScreen>} />
                            <Route path="/tenant" element={<Navigate to="/login" replace />} />

                            <Route path="/app" element={<LazyScreen><Layout /></LazyScreen>}>
                                <Route path="dashboard" element={<LazyScreen><Dashboard /></LazyScreen>} />
                                <Route path="revenue" element={<LazyScreen><Revenue /></LazyScreen>} />
                                <Route path="buildings" element={<LazyScreen><Buildings /></LazyScreen>} />
                                <Route path="buildings/:id" element={<LazyScreen><BuildingDetail /></LazyScreen>} />
                                <Route path="map" element={<LazyScreen><RoomMap /></LazyScreen>} />
                                <Route path="rooms" element={<LazyScreen><Rooms /></LazyScreen>} />
                                <Route path="rooms/:id" element={<LazyScreen><RoomDetail /></LazyScreen>} />
                                <Route path="customers" element={<LazyScreen><Customers /></LazyScreen>} />
                                <Route path="customers/:customerId" element={<LazyScreen><CustomerDetail /></LazyScreen>} />
                                <Route path="contracts" element={<LazyScreen><Contracts /></LazyScreen>} />
                                <Route path="payments" element={<LazyScreen><Payments /></LazyScreen>} />
                                <Route path="equipment" element={<LazyScreen><Equipment /></LazyScreen>} />
                                <Route path="settings" element={<LazyScreen><Settings /></LazyScreen>} />
                                <Route index element={<Navigate to="dashboard" replace />} />
                            </Route>
                        </>
                    )}

                    {showAdmin && (
                        <>
                            <Route path={isAdminMode ? "/" : "/admin-login"} element={<LazyScreen><AdminLoginPage /></LazyScreen>} />

                            <Route path="/admin" element={<LazyScreen><AdminLayout /></LazyScreen>}>
                                <Route path="dashboard" element={<LazyScreen><AdminDashboard /></LazyScreen>} />
                                <Route path="users" element={<LazyScreen><AdminUsers /></LazyScreen>} />
                                <Route path="hosts" element={<LazyScreen><AdminHosts /></LazyScreen>} />
                                <Route path="sales" element={<LazyScreen><AdminSales /></LazyScreen>} />
                                <Route path="plans" element={<LazyScreen><AdminPlans /></LazyScreen>} />
                                <Route path="settings" element={<LazyScreen><AdminSettingsPage /></LazyScreen>} />
                                <Route path="cms" element={<LazyScreen><AdminCMS /></LazyScreen>} />
                                <Route path="roles" element={<LazyScreen><AdminRoles /></LazyScreen>} />
                                <Route index element={<Navigate to="dashboard" replace />} />
                            </Route>

                            <Route path="/sales/dashboard" element={<LazyScreen><SalesDashboard /></LazyScreen>} />
                        </>
                    )}

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </HashRouter>
        </AppProvider>
    );
}
