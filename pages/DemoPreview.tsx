import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building, Users, FileText, CreditCard, Wrench, BarChart3,
    MapPin, Shield, ChevronRight, ArrowLeft, Sparkles, Lock
} from 'lucide-react';

const demoFeatures = [
    {
        icon: Building,
        title: 'Quản lý tòa nhà',
        desc: 'Theo dõi tất cả tòa nhà và chi nhánh, thông tin chi tiết từng tầng.',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10'
    },
    {
        icon: MapPin,
        title: 'Bản đồ phòng trực quan',
        desc: 'Xem tổng quan trạng thái phòng trên bản đồ tầng: trống, đang ở, đang sửa.',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10'
    },
    {
        icon: Users,
        title: 'Quản lý khách thuê',
        desc: 'Lưu thông tin CCCD, hình ảnh, SĐT, Zalo, email của mỗi khách thuê.',
        color: 'text-green-400',
        bg: 'bg-green-500/10'
    },
    {
        icon: FileText,
        title: 'Hợp đồng thông minh',
        desc: 'Tạo hợp đồng với dịch vụ tùy chỉnh, tự động tính ngày hết hạn.',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10'
    },
    {
        icon: CreditCard,
        title: 'Quản lý thanh toán',
        desc: 'Theo dõi công nợ, nhắc thanh toán qua Zalo/Email tự động, QR chuyển khoản.',
        color: 'text-red-400',
        bg: 'bg-red-500/10'
    },
    {
        icon: Wrench,
        title: 'Trang thiết bị',
        desc: 'Quản lý thiết bị từng phòng: điều hòa, nóng lạnh, camera, wifi...',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10'
    }
];

const demoStats = [
    { label: 'Tòa nhà', value: '2', sub: 'chi nhánh' },
    { label: 'Phòng', value: '48', sub: 'phòng quản lý' },
    { label: 'Khách thuê', value: '42', sub: 'đang ở' },
    { label: 'Doanh thu', value: '168tr', sub: 'VNĐ / tháng' }
];

export default function DemoPreview() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
            {/* Header */}
            <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Trang chủ</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        <span className="font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Smart Rental Demo</span>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        Đăng nhập
                    </button>
                </div>
            </nav>

            {/* Hero Stats */}
            <section className="py-12 px-6">
                <div className="max-w-5xl mx-auto text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Trải nghiệm giao diện quản lý</h1>
                    <p className="text-slate-400 text-lg">Xem qua các tính năng chính của Smart Rental Manager</p>
                </div>

                {/* Quick Stats */}
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {demoStats.map((stat, i) => (
                        <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 text-center">
                            <p className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{stat.value}</p>
                            <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                            <p className="text-xs text-slate-600">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-10 px-6 bg-slate-900/50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8 text-center">Tính năng nổi bật</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {demoFeatures.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div key={i} className="group relative bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 hover:border-slate-600/60 transition-all duration-300 cursor-default">
                                    {/* Lock overlay */}
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                        <div className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl text-sm font-medium shadow-lg">
                                            <Lock className="w-4 h-4" />
                                            Đăng ký để sử dụng
                                        </div>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                                        <Icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Sample Dashboard Preview (static image-like) */}
            <section className="py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8 text-center">Giao diện quản lý mẫu</h2>

                    {/* Mock Dashboard Card */}
                    <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold">Dashboard Tổng quan</h3>
                                <p className="text-xs text-slate-500">Dữ liệu minh họa</p>
                            </div>
                        </div>

                        {/* Mock room status grid */}
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-6">
                            {['Đang ở', 'Đang ở', 'Trống', 'Đang ở', 'Đang sửa', 'Đang ở', 'Trống', 'Đang ở',
                                'Đang ở', 'Trống', 'Đang ở', 'Đang ở', 'Đang ở', 'Trống', 'Đang ở', 'Đang sửa'].map((status, i) => (
                                    <div key={i} className={`p-2 rounded-lg text-center text-xs font-medium cursor-default
                                    ${status === 'Đang ở' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                            status === 'Trống' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}
                                    >
                                        P{(i + 101).toString()}
                                    </div>
                                ))}
                        </div>

                        {/* Mock chart bars */}
                        <div className="flex items-end gap-2 h-24 mb-4">
                            {[65, 80, 45, 90, 70, 85, 55, 95, 75, 60, 88, 72].map((h, i) => (
                                <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md opacity-70" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 text-center">Doanh thu 12 tháng gần nhất (dữ liệu minh họa)</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-10 rounded-3xl border border-blue-500/20">
                    <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-3">Bắt đầu quản lý nhà trọ ngay hôm nay</h2>
                    <p className="text-slate-400 mb-6">Đăng ký miễn phí, thiết lập trong 5 phút. Không cần thẻ tín dụng.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            Đăng nhập <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/pricing')}
                            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                        >
                            Xem bảng giá
                        </button>
                    </div>
                </div>
            </section>

            <footer className="py-6 text-center text-slate-600 text-xs border-t border-slate-800">
                © 2024 Smart Rental Manager. Dữ liệu trên trang này chỉ mang tính minh họa.
            </footer>
        </div>
    );
}
