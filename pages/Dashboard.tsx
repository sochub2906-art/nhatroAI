import React from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, FileText, Gauge, Home, TrendingDown, TrendingUp, Users, Wallet, Wrench } from 'lucide-react';
import BulkServiceReadingModal from '../components/BulkServiceReadingModal';
import QuickContractWizard from '../components/QuickContractWizardEnhanced';
import { formatCurrency, useApp } from '../AppContext';
import { createHostFinancialSnapshot } from '../utils/hostAnalytics';

const ROOM_COLORS = ['#16a34a', '#94a3b8', '#f59e0b'];

export default function Dashboard() {
    const { rooms, customers, payments, buildings, equipment, contracts, generateMonthlyPayments } = useApp();
    const [isWizardOpen, setIsWizardOpen] = React.useState(false);
    const [isBulkReadingOpen, setIsBulkReadingOpen] = React.useState(false);

    const snapshot = React.useMemo(
        () => createHostFinancialSnapshot({ rooms, contracts, payments, buildings, equipment }),
        [rooms, contracts, payments, buildings, equipment],
    );

    const roomChartData = React.useMemo(() => {
        const occupied = rooms.filter(room => room.status === 'Đang ở').length;
        const empty = rooms.filter(room => room.status === 'Trống').length;
        const repairing = Math.max(0, rooms.length - occupied - empty);
        return [
            { name: 'Đang ở', value: occupied },
            { name: 'Trống', value: empty },
            { name: 'Đang sửa', value: repairing },
        ];
    }, [rooms]);

    const revenueData = snapshot.income.byCategory.slice(0, 6);
    const expenseData = snapshot.expense.byCategory.slice(0, 6);

    const overviewCards = [
        { label: 'Tỷ lệ lấp đầy', value: `${Math.round(snapshot.occupancyRate * 100)}%`, helper: `${snapshot.occupiedRooms}/${snapshot.totalRooms} phòng`, icon: Home, tone: 'blue' },
        { label: 'Doanh thu tháng', value: formatCurrency(snapshot.income.month), helper: `Hôm nay ${formatCurrency(snapshot.income.day)}`, icon: TrendingUp, tone: 'emerald' },
        { label: 'Chi phí tháng', value: formatCurrency(snapshot.expense.month), helper: `Năm nay ${formatCurrency(snapshot.expense.year)}`, icon: TrendingDown, tone: 'rose' },
        { label: 'Công nợ hiện tại', value: formatCurrency(snapshot.totalDebt), helper: `${customers.length} khách đang quản lý`, icon: Wallet, tone: 'amber' },
        { label: 'Giá trị tài sản', value: formatCurrency(snapshot.assets.currentValue), helper: `Mua vào ${formatCurrency(snapshot.assets.purchaseValue)}`, icon: Wrench, tone: 'violet' },
        { label: 'Khấu hao tháng', value: formatCurrency(snapshot.assets.monthlyDepreciation), helper: `Sửa chữa ${formatCurrency(snapshot.assets.maintenanceCost)}`, icon: Users, tone: 'slate' },
    ] as const;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tổng quan host</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Theo dõi doanh thu ngày, tháng, năm, chi phí vận hành và trạng thái lấp đầy ngay trên một màn hình.
                </p>
            </div>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tác vụ nhanh</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Đưa các thao tác hay dùng lên đầu để thao tác ngay khi vào dashboard.</p>
                </div>
                <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-5">
                    <button
                        onClick={() => setIsBulkReadingOpen(true)}
                        className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-left transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
                    >
                        <div>
                            <div className="font-medium text-amber-700 dark:text-amber-300">Ghi số điện nước theo lô</div>
                            <div className="text-sm text-amber-700/80 dark:text-amber-300/80">Nhập chỉ số cũ, mới và lưu toàn bộ phòng trong một lần</div>
                        </div>
                        <Gauge className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                    </button>

                    <button
                        onClick={() => setIsWizardOpen(true)}
                        className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-left transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:hover:bg-blue-950/50"
                    >
                        <div>
                            <div className="font-medium text-blue-700 dark:text-blue-300">Tạo khách & hợp đồng</div>
                            <div className="text-sm text-blue-600/80 dark:text-blue-300/80">Thêm người thuê mới bằng QR CCCD</div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </button>

                    <button
                        onClick={generateMonthlyPayments}
                        className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-left transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50"
                    >
                        <div>
                            <div className="font-medium text-emerald-700 dark:text-emerald-300">Tạo phiếu thu tháng</div>
                            <div className="text-sm text-emerald-600/80 dark:text-emerald-300/80">Sinh công nợ kỳ tiếp theo</div>
                        </div>
                        <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                    </button>

                    <Link
                        to="/app/customers"
                        className="flex items-center justify-between rounded-2xl border border-violet-200 bg-violet-50 px-4 py-4 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/30 dark:hover:bg-violet-950/50"
                    >
                        <div>
                            <div className="font-medium text-violet-700 dark:text-violet-300">CT01 cư trú PDF</div>
                            <div className="text-sm text-violet-600/80 dark:text-violet-300/80">Mở danh sách khách để in hoặc lưu PDF mẫu công an</div>
                        </div>
                        <FileText className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                    </Link>

                    <Link
                        to="/app/equipment"
                        className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                        <div>
                            <div className="font-medium text-slate-900 dark:text-white">Quản lý tài sản</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Theo dõi sửa chữa, định giá lại và khấu hao</div>
                        </div>
                        <Wrench className="h-5 w-5 text-slate-500" />
                    </Link>
                </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {overviewCards.map(card => {
                    const toneMap = {
                        blue: 'from-blue-600/15 to-blue-500/5 text-blue-600 dark:text-blue-300',
                        emerald: 'from-emerald-600/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-300',
                        rose: 'from-rose-600/15 to-rose-500/5 text-rose-600 dark:text-rose-300',
                        amber: 'from-amber-500/20 to-amber-400/5 text-amber-600 dark:text-amber-300',
                        violet: 'from-violet-600/15 to-violet-500/5 text-violet-600 dark:text-violet-300',
                        slate: 'from-slate-700/10 to-slate-500/5 text-slate-700 dark:text-slate-200',
                    } as const;
                    const Icon = card.icon;

                    return (
                        <div key={card.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br p-3 ${toneMap[card.tone]}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{card.label}</div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{card.value}</div>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{card.helper}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Doanh thu theo sản phẩm</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Tổng doanh thu đã ghi nhận theo từng nhóm dịch vụ.</p>
                        </div>
                        <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                            Tổng {formatCurrency(snapshot.income.total)}
                        </div>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                                <YAxis tickFormatter={value => `${Math.round(Number(value) / 1000000)}tr`} tickLine={false} axisLine={false} fontSize={12} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Bar dataKey="amount" radius={[10, 10, 0, 0]} fill="#2563eb" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Trạng thái phòng</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Hiển thị nhanh tỷ lệ phòng đang ở, trống và đang sửa.</p>
                    </div>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={roomChartData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={4}>
                                    {roomChartData.map((entry, index) => (
                                        <Cell key={entry.name} fill={ROOM_COLORS[index % ROOM_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [`${value} phòng`, 'Số lượng']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {roomChartData.map((item, index) => (
                            <div key={item.name} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/80">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ROOM_COLORS[index % ROOM_COLORS.length] }} />
                                    <span className="text-sm text-slate-600 dark:text-slate-300">{item.name}</span>
                                </div>
                                <div className="text-lg font-semibold text-slate-900 dark:text-white">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Chi phí theo loại</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Bao gồm thuê tòa nhà, mua sắm, sửa chữa và khấu hao.</p>
                        </div>
                        <span className="rounded-2xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
                            {formatCurrency(snapshot.expense.total)}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {expenseData.map(item => (
                            <div key={item.key} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                                <div className="mb-2 flex items-center justify-between gap-4">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(item.amount)}</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-400"
                                        style={{ width: `${snapshot.expense.total === 0 ? 0 : Math.max(8, (item.amount / snapshot.expense.total) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Doanh thu nhanh</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            { label: 'Hôm nay', value: snapshot.income.day },
                            { label: 'Tháng này', value: snapshot.income.month },
                            { label: 'Năm nay', value: snapshot.income.year },
                            { label: 'Tổng cộng', value: snapshot.income.total },
                        ].map(item => (
                            <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800/80">
                                <div className="text-sm text-slate-500 dark:text-slate-400">{item.label}</div>
                                <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{formatCurrency(item.value)}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {isWizardOpen && <QuickContractWizard onClose={() => setIsWizardOpen(false)} />}
            {isBulkReadingOpen && <BulkServiceReadingModal onClose={() => setIsBulkReadingOpen(false)} />}
        </div>
    );
}
