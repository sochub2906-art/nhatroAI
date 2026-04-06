import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UserRole } from '../types';
import { Shield, ShoppingBag, ChevronRight, KeyRound, ArrowLeft, CheckCircle, Mail, UserCog, Calculator, Megaphone } from 'lucide-react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const adminRoles: { role: UserRole; label: string; desc: string; icon: any; color: string; gradient: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Quản trị toàn bộ hệ thống', icon: Shield, color: 'text-red-400', gradient: 'from-red-500/20 to-orange-500/20 border-red-500/30' },
  { role: 'ADMIN_L2', label: 'Admin cấp 2', desc: 'Quản trị viên hỗ trợ, quyền hạn giới hạn', icon: UserCog, color: 'text-sky-400', gradient: 'from-sky-500/20 to-blue-500/20 border-sky-500/30' },
  { role: 'SALES', label: 'Nhân viên Sales', desc: 'Quản lý Host & Lead bán hàng', icon: ShoppingBag, color: 'text-amber-400', gradient: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30' },
  { role: 'ACCOUNTANT', label: 'Kế toán', desc: 'Theo dõi doanh thu và thanh toán', icon: Calculator, color: 'text-violet-400', gradient: 'from-violet-500/20 to-purple-500/20 border-violet-500/30' },
  { role: 'MARKETING', label: 'Marketing', desc: 'Quản lý nội dung CMS và chiến dịch SEO', icon: Megaphone, color: 'text-rose-400', gradient: 'from-rose-500/20 to-pink-500/20 border-rose-500/30' },
];

export default function AdminLoginPage() {
  const { login, logout } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!selected || !email || !password) {
      setError('Vui lòng nhập email, mật khẩu và chọn vai trò.');
      return;
    }
    
    setError('');
    const user = await login(email, password);
    
    if (user) {
      const adminishRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN_L2', 'SALES', 'ACCOUNTANT', 'MARKETING'];
      if (user.role === selected || (adminishRoles.includes(user.role) && user.role === selected)) {
        switch (selected) {
          case 'SUPER_ADMIN':
          case 'ADMIN_L2': navigate('/admin/dashboard'); break;
          case 'SALES': navigate('/sales/dashboard'); break;
          case 'ACCOUNTANT': navigate('/admin/dashboard'); break;
          case 'MARKETING': navigate('/admin/cms'); break;
          default: navigate('/admin/dashboard'); break;
        }
      } else {
        setError('Tài khoản của bạn không có quyền truy cập vai trò này.');
        logout();
      }
    } else {
      setError('Thông tin đăng nhập không chính xác.');
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) { setForgotError('Vui lòng nhập email.'); return; }
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotSent(true);
      setForgotError('');
    } catch (err: any) {
      setForgotError(err.code === 'auth/user-not-found' ? 'Email không tồn tại.' : `Lỗi: ${err.message}`);
    }
  };

  if (showForgot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Quên mật khẩu</h2>
            <p className="text-slate-400 text-sm">Nhập email để nhận link đặt lại mật khẩu.</p>
          </div>
          {forgotSent ? (
            <div className="text-center space-y-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto"><CheckCircle className="w-8 h-8 text-green-400" /></div>
              <h3 className="text-lg font-bold text-white">Đã gửi email!</h3>
              <p className="text-slate-400 text-sm">Kiểm tra hộp thư <span className="text-red-400 font-medium">{forgotEmail}</span>.</p>
              <button onClick={() => { setShowForgot(false); setForgotSent(false); }} className="text-red-400 text-sm hover:underline flex items-center gap-1 mx-auto"><ArrowLeft className="w-4 h-4" /> Quay lại</button>
            </div>
          ) : (
            <div className="space-y-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              {forgotError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{forgotError}</div>}
              <div>
                <label className="block text-xs text-slate-500 mb-1 font-medium">Email</label>
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="admin@smartrental.vn"
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-red-500/50 text-sm" />
              </div>
              <button onClick={handleForgotPassword} className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Gửi email đặt lại mật khẩu
              </button>
              <button onClick={() => { setShowForgot(false); setForgotError(''); }} className="w-full text-slate-400 text-sm hover:text-white flex items-center justify-center gap-1"><ArrowLeft className="w-4 h-4" /> Quay lại</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <Shield className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">NhatroAI</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">Hệ thống quản trị nội bộ</p>
          <p className="text-slate-600 text-xs mt-1">nhatrobe.web.app</p>
        </div>

        <div className="space-y-3 mb-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-2 text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@smartrental.vn"
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-red-500/50 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Mật khẩu</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-red-500/50 text-sm" />
          </div>
          <div className="text-right">
            <button type="button" onClick={() => { setShowForgot(true); setForgotEmail(email); }} className="text-xs text-red-400 hover:text-red-300 hover:underline">Quên mật khẩu?</button>
          </div>
        </div>

        <p className="text-slate-500 text-xs mb-3 font-medium uppercase tracking-wider">Chọn vai trò</p>
        <div className="space-y-3 mb-8">
          {adminRoles.map(r => {
            const Icon = r.icon;
            const isActive = selected === r.role;
            return (
              <button key={r.role} onClick={() => setSelected(r.role)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left group ${isActive ? `bg-gradient-to-r ${r.gradient} border-opacity-100 scale-[1.02] shadow-lg` : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/10' : 'bg-slate-800'} transition-colors`}>
                  <Icon className={`w-6 h-6 ${isActive ? r.color : 'text-slate-500'} transition-colors`} />
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${isActive ? 'text-white' : 'text-slate-300'} transition-colors`}>{r.label}</p>
                  <p className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-500'} transition-colors`}>{r.desc}</p>
                </div>
                <ChevronRight className={`w-5 h-5 ${isActive ? 'text-white/60 translate-x-0' : 'text-slate-700 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'} transition-all`} />
              </button>
            );
          })}
        </div>

        <button onClick={handleLogin} disabled={!selected}
          className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-lg shadow-red-600/20 active:scale-[0.98]">
          Đăng nhập
        </button>

        <p className="text-center text-slate-600 text-xs mt-6">Chỉ dành cho nhân viên nội bộ NhatroAI</p>
      </div>
    </div>
  );
}
