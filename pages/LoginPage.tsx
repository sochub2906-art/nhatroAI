import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ArrowLeft, Building, CheckCircle, ChevronRight, KeyRound, Mail, Shield, ShoppingBag, Sparkles, Users } from 'lucide-react';
import { useApp } from '../AppContext';
import { auth, isDevMode, TENANT_LOGIN_ENABLED } from '../firebase';
import { UserRole } from '../types';

type RoleOption = {
    role: UserRole;
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    gradient: string;
    mode: 'host' | 'admin' | 'all';
};

const allRoles: RoleOption[] = [
    {
        role: 'SUPER_ADMIN',
        label: 'Super Admin',
        desc: 'Quản trị toàn bộ hệ thống',
        icon: Shield,
        color: 'text-red-400',
        gradient: 'from-red-500/20 to-orange-500/20 border-red-500/30',
        mode: 'admin',
    },
    {
        role: 'SALES',
        label: 'Nhân viên Sales',
        desc: 'Quản lý host và lead bán hàng',
        icon: ShoppingBag,
        color: 'text-amber-400',
        gradient: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
        mode: 'admin',
    },
    {
        role: 'HOST',
        label: 'Chủ nhà (Host)',
        desc: 'Quản lý tòa nhà và phòng cho thuê',
        icon: Building,
        color: 'text-blue-400',
        gradient: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
        mode: 'host',
    },
    {
        role: 'TENANT',
        label: 'Người thuê',
        desc: 'Xem thông tin phòng và thanh toán',
        icon: Users,
        color: 'text-green-400',
        gradient: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
        mode: 'host',
    },
];

const roles = (isDevMode ? allRoles : allRoles.filter((role) => role.mode === 'host' || role.mode === 'all'))
    .filter((role) => TENANT_LOGIN_ENABLED || role.role !== 'TENANT');

export default function LoginPage() {
    const { login } = useApp();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [selected, setSelected] = useState<UserRole | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSent, setForgotSent] = useState(false);
    const [forgotError, setForgotError] = useState('');

    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (!roleParam) {
            return;
        }

        const normalizedRole = roleParam.toUpperCase() as UserRole;
        if (roles.some((role) => role.role === normalizedRole)) {
            setSelected(normalizedRole);
        }
    }, [searchParams]);

    const handleLogin = async () => {
        if (!selected || !email || !password) {
            setError('Vui lòng nhập email, mật khẩu và chọn vai trò.');
            return;
        }

        if (selected === 'TENANT' && !TENANT_LOGIN_ENABLED) {
            setError('Luồng đăng nhập người thuê đang tạm tắt.');
            return;
        }

        const user = await login(email, password);

        if (user && user.role === selected) {
            setError('');
            switch (selected) {
                case 'SUPER_ADMIN':
                    navigate('/admin/dashboard');
                    break;
                case 'SALES':
                    navigate('/sales/dashboard');
                    break;
                case 'HOST':
                    navigate('/app/dashboard');
                    break;
                case 'TENANT':
                    navigate('/tenant');
                    break;
            }
            return;
        }

        setError('Email, mật khẩu hoặc vai trò không chính xác.');
    };

    const handleForgotPassword = async () => {
        if (!forgotEmail) {
            setForgotError('Vui lòng nhập email.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, forgotEmail);
            setForgotSent(true);
            setForgotError('');
        } catch (err: any) {
            setForgotError(
                err.code === 'auth/user-not-found'
                    ? 'Email không tồn tại trong hệ thống.'
                    : `Lỗi: ${err.message}`,
            );
        }
    };

    if (showForgot) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <KeyRound className="w-8 h-8 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Quên mật khẩu</h2>
                        <p className="text-slate-400 text-sm">
                            Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.
                        </p>
                    </div>

                    {forgotSent ? (
                        <div className="text-center space-y-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Đã gửi email</h3>
                            <p className="text-slate-400 text-sm">
                                Kiểm tra hộp thư <span className="text-blue-400 font-medium">{forgotEmail}</span> để đặt lại mật khẩu.
                            </p>
                            <button
                                onClick={() => {
                                    setShowForgot(false);
                                    setForgotSent(false);
                                    setForgotEmail('');
                                }}
                                className="text-blue-400 text-sm hover:underline flex items-center gap-1 mx-auto"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại đăng nhập
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                            {forgotError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                    {forgotError}
                                </div>
                            )}
                            <div>
                                <label className="block text-xs text-slate-500 mb-1 font-medium">Email</label>
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                                />
                            </div>
                            <button
                                onClick={handleForgotPassword}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-500 hover:to-indigo-500 flex items-center justify-center gap-2"
                            >
                                <Mail className="w-4 h-4" />
                                Gửi email đặt lại mật khẩu
                            </button>
                            <button
                                onClick={() => {
                                    setShowForgot(false);
                                    setForgotError('');
                                }}
                                className="w-full text-slate-400 text-sm hover:text-white flex items-center justify-center gap-1"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại đăng nhập
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="w-8 h-8 text-blue-400" />
                        <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Smart Rental
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm">Chọn vai trò để truy cập hệ thống</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-3 mb-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                    <div>
                        <label className="block text-xs text-slate-500 mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1 font-medium">Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                        />
                    </div>
                    <div className="text-right">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForgot(true);
                                setForgotEmail(email);
                            }}
                            className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                        >
                            Quên mật khẩu?
                        </button>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        const isActive = selected === role.role;

                        return (
                            <button
                                key={role.role}
                                onClick={() => setSelected(role.role)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left group ${
                                    isActive
                                        ? `bg-gradient-to-r ${role.gradient} border-opacity-100 scale-[1.02] shadow-lg`
                                        : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/10' : 'bg-slate-800'} transition-colors`}>
                                    <Icon className={`w-6 h-6 ${isActive ? role.color : 'text-slate-500'} transition-colors`} />
                                </div>
                                <div className="flex-1">
                                    <p className={`font-bold ${isActive ? 'text-white' : 'text-slate-300'} transition-colors`}>{role.label}</p>
                                    <p className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-500'} transition-colors`}>{role.desc}</p>
                                </div>
                                <ChevronRight
                                    className={`w-5 h-5 ${isActive ? 'text-white/60 translate-x-0' : 'text-slate-700 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'} transition-all`}
                                />
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={handleLogin}
                    disabled={!selected || !email || !password}
                    className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                    Đăng nhập
                </button>

                <p className="text-center text-slate-600 text-xs mt-6">
                    Smart Rental Manager | Đăng nhập để quản lý nhà trọ
                </p>
            </div>
        </div>
    );
}
