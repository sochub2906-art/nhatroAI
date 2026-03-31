import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle, ChevronRight, Menu, Smartphone, X, Zap } from 'lucide-react';
import { useApp } from '../AppContext';

const DEFAULT_BG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80';

const features = [
  {
    icon: BarChart3,
    iconClassName: 'text-blue-300',
    iconWrapClassName: 'bg-blue-500/10 ring-1 ring-blue-400/20',
    title: 'Quản lý toàn diện',
    description: 'Theo dõi trạng thái phòng, thông tin khách thuê, hợp đồng và lịch sử ra vào chi tiết.'
  },
  {
    icon: Zap,
    iconClassName: 'text-cyan-300',
    iconWrapClassName: 'bg-cyan-500/10 ring-1 ring-cyan-400/20',
    title: 'Tự động hóa',
    description: 'Tự động chốt công nợ hàng tháng, tính toán điện nước và cập nhật trạng thái hợp đồng.'
  },
  {
    icon: Smartphone,
    iconClassName: 'text-emerald-300',
    iconWrapClassName: 'bg-emerald-500/10 ring-1 ring-emerald-400/20',
    title: 'Nhắc nợ thông minh',
    description: 'Gửi tin nhắn nhắc đóng tiền qua Zalo và Email tự động đến khách thuê khi đến hạn.'
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const { addLead, adminSettings } = useApp();
  const [showRegForm, setShowRegForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', needs: '' });
  const [submitted, setSubmitted] = useState(false);
  const bgUrl = adminSettings?.landingBackgroundUrl || DEFAULT_BG;

  const openHostLogin = () => {
    setShowMobileMenu(false);
    navigate('/login?role=HOST');
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      customerName: formData.name,
      phone: formData.phone,
      needs: formData.needs || 'Tư vấn giải pháp quản lý'
    });
    setSubmitted(true);
    window.setTimeout(() => {
      setShowRegForm(false);
      setSubmitted(false);
      setFormData({ name: '', phone: '', needs: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#060b17] text-slate-100 selection:bg-blue-500 selection:text-white">
      {showRegForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-slate-950/95 p-8 shadow-[0_32px_120px_rgba(15,23,42,0.65)]">
            <button
              type="button"
              onClick={() => setShowRegForm(false)}
              className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-white/20 hover:text-white"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div className="space-y-4 py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/20">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Gửi yêu cầu thành công!</h3>
                <p className="text-sm leading-6 text-slate-400">
                  Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ tới.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white">Đăng ký tư vấn</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Để lại thông tin, chúng tôi sẽ demo và hỗ trợ bạn thiết lập hệ thống nhanh chóng.
                </p>

                <form onSubmit={handleLeadSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-200">Họ và tên</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-200">Số điện thoại</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="09xx xxx xxx"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-200">Nhu cầu cụ thể</label>
                    <textarea
                      value={formData.needs}
                      onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                      placeholder="VD: Quản lý 20 phòng tại Cầu Giấy..."
                      className="h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-5 py-4 font-semibold text-white shadow-[0_20px_60px_rgba(37,99,235,0.35)] transition hover:translate-y-[-1px] hover:shadow-[0_24px_70px_rgba(37,99,235,0.45)]"
                  >
                    Gửi thông tin đăng ký
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8%] h-[32rem] w-[32rem] rounded-full bg-blue-500/18 blur-3xl" />
        <div className="absolute right-[-14%] top-[10%] h-[28rem] w-[28rem] rounded-full bg-cyan-400/14 blur-3xl" />
        <div className="absolute bottom-[-18%] left-[22%] h-[26rem] w-[26rem] rounded-full bg-indigo-500/14 blur-3xl" />
      </div>

      <header className="relative isolate">
        <div className="absolute inset-0">
          <img
            src={bgUrl}
            alt=""
            className="h-full w-full object-cover opacity-20"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_BG;
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.24),transparent_28%),linear-gradient(180deg,rgba(6,11,23,0.6)_0%,rgba(6,11,23,0.9)_55%,#060b17_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#060b17]" />
        </div>

        <nav className="relative z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-left text-3xl font-black tracking-tight text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text"
            >
              Smart Rental
            </button>

            <div className="hidden items-center gap-8 lg:flex">
              <button
                type="button"
                onClick={() => navigate('/pricing')}
                className="text-sm font-semibold text-slate-200 transition hover:text-white"
              >
                Bảng giá
              </button>
              <button
                type="button"
                onClick={() => navigate('/demo')}
                className="text-sm font-semibold text-slate-200 transition hover:text-white"
              >
                Xem Demo
              </button>
              <button
                type="button"
                onClick={openHostLogin}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-blue-300/40 hover:bg-white/10"
              >
                Đăng nhập Host
              </button>
              <button
                type="button"
                onClick={() => setShowRegForm(true)}
                className="rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.28)] transition hover:translate-y-[-1px]"
              >
                Đăng ký ngay
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowMobileMenu((prev) => !prev)}
              className="inline-flex rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 lg:hidden"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {showMobileMenu && (
            <div className="border-t border-white/10 bg-slate-950/95 px-5 pb-5 pt-4 lg:hidden">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    navigate('/pricing');
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Bảng giá
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    navigate('/demo');
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Xem Demo
                </button>
                <button
                  type="button"
                  onClick={openHostLogin}
                  className="rounded-2xl border border-blue-400/25 bg-blue-500/10 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-blue-500/15"
                >
                  Đăng nhập Host
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowRegForm(true);
                  }}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-4 py-3 text-left text-sm font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.28)]"
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>
          )}
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:px-8 lg:pb-28 lg:pt-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 backdrop-blur-sm">
              Giải pháp quản lý số 1 Việt Nam
            </div>

            <h1 className="mt-8 text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-[5.5rem]">
              Nền tảng quản lý nhà trọ thông minh & hiệu quả
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Tự động hóa quy trình quản lý, kiểm soát công nợ, hợp đồng và khách thuê. Tiết kiệm 90% thời gian vận hành hàng tháng.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-7 py-4 text-base font-semibold text-white shadow-[0_22px_60px_rgba(37,99,235,0.35)] transition hover:translate-y-[-1px]"
              >
                Bắt đầu miễn phí
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={openHostLogin}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:border-blue-300/40 hover:bg-white/10"
              >
                Đăng nhập Host
              </button>
              <button
                type="button"
                onClick={() => setShowRegForm(true)}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-900/70 px-7 py-4 text-base font-semibold text-white transition hover:border-white/20 hover:bg-slate-800/80"
              >
                Nhận tư vấn ngay
              </button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">Tiết kiệm</p>
                <p className="mt-3 text-3xl font-black text-white">90%</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">Tiết kiệm 90% thời gian vận hành hàng tháng.</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">Đang sử dụng</p>
                <p className="mt-3 text-3xl font-black text-white">5000+</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Tham gia cùng hơn 5000+ chủ nhà trọ đang sử dụng Smart Rental Manager.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 hidden h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl lg:block" />
            <div className="absolute -right-6 bottom-10 hidden h-32 w-32 rounded-full bg-blue-500/20 blur-3xl lg:block" />

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 p-5 shadow-[0_32px_90px_rgba(2,6,23,0.6)] backdrop-blur-xl sm:p-6">
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Smart Rental</p>
                  <p className="mt-2 text-2xl font-bold text-white">Nền tảng quản lý nhà trọ thông minh & hiệu quả</p>
                </div>
                <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 sm:inline-flex">
                  Giải pháp quản lý số 1 Việt Nam
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/15 hover:bg-white/[0.06]"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${feature.iconWrapClassName}`}>
                          <Icon className={`h-6 w-6 ${feature.iconClassName}`} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">{feature.title}</h2>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-[26px] border border-blue-400/15 bg-gradient-to-br from-blue-500/12 via-cyan-400/10 to-transparent p-5">
                <p className="text-sm leading-7 text-slate-200">
                  Tự động hóa quy trình quản lý, kiểm soát công nợ, hợp đồng và khách thuê. Tiết kiệm 90% thời gian vận hành hàng tháng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="relative z-10 px-5 pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-[32px] border border-white/10 bg-slate-950/70 p-8 shadow-[0_18px_70px_rgba(2,6,23,0.28)] backdrop-blur-xl transition hover:border-white/15 hover:bg-slate-900/80"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconWrapClassName}`}>
                    <Icon className={`h-7 w-7 ${feature.iconClassName}`} />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-white">{feature.title}</h2>
                  <p className="mt-3 text-base leading-7 text-slate-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(37,99,235,0.22),rgba(12,18,36,0.92)_50%,rgba(34,211,238,0.14))] p-8 shadow-[0_30px_100px_rgba(15,23,42,0.45)] lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-black text-white sm:text-4xl">Sẵn sàng tối ưu hóa việc quản lý?</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
                Tham gia cùng hơn 5000+ chủ nhà trọ đang sử dụng Smart Rental Manager.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Tạo tài khoản ngay
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={openHostLogin}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Đăng nhập Host
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-slate-500 lg:px-8">
        © 2024 Smart Rental Manager. All rights reserved.
      </footer>
    </div>
  );
}
