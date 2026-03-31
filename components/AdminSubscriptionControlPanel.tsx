import React from 'react';
import {
    Banknote,
    CheckCircle2,
    Crown,
    ExternalLink,
    Plus,
    Radio,
    Settings2,
    ShieldCheck,
    Sparkles,
    XCircle,
} from 'lucide-react';
import { formatCurrency, useApp } from '../AppContext';
import type {
    AdminSettings,
    HostPaymentGatewayConfig,
    PaymentChannelConfig,
    SubscriptionRequest,
    SubscriptionRequestStatus,
} from '../types';
import {
    buildPlanFeatureList,
    normalizeSubscriptionChannels,
} from '../utils/subscriptionPayments';
import {
    buildHostPaymentWebhookUrl,
    normalizeHostPaymentGatewayConfig,
} from '../utils/paymentGateway';
import { formatDateTimeVN } from '../utils/dateFormat';

type Props = {
    value: AdminSettings;
    onChange: React.Dispatch<React.SetStateAction<AdminSettings>>;
    onPersist: (next: AdminSettings) => void;
};

const REQUEST_TONE: Record<SubscriptionRequestStatus, string> = {
    draft: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
    pending_payment: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300',
    pending_review: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300',
    approved: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300',
    rejected: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300',
    cancelled: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
};

const REQUEST_LABEL: Record<SubscriptionRequestStatus, string> = {
    draft: 'Nháp',
    pending_payment: 'Chờ thanh toán',
    pending_review: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    cancelled: 'Đã hủy',
};

function getProviderLabel(provider: PaymentChannelConfig['provider']): string {
    switch (provider) {
        case 'sepay':
            return 'SePay';
        case 'custom':
            return 'Webhook custom';
        default:
            return 'Thủ công';
    }
}

function addDays(base: string, days: number): string {
    const date = new Date(base);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

export default function AdminSubscriptionControlPanel({ value, onChange, onPersist }: Props) {
    const { allUsers, pricingTiers, currentUser, updateUser } = useApp();
    const hostUsers = allUsers.filter(user => user.role === 'HOST');
    const channels = normalizeSubscriptionChannels(value.paymentConfig?.subscriptionChannels);
    const requests = [...(value.subscriptionRequests || [])].sort(
        (left, right) => new Date(right.requestedAt).getTime() - new Date(left.requestedAt).getTime(),
    );
    const pendingCount = requests.filter(
        request => request.status === 'pending_payment' || request.status === 'pending_review',
    ).length;
    const hostGatewayConfigs = value.paymentConfig?.hostGatewayConfigs || {};

    const updateDraft = (updater: (draft: AdminSettings) => AdminSettings) => {
        onChange(prev => updater(prev));
    };

    const persistDraft = (updater: (draft: AdminSettings) => AdminSettings) => {
        const next = updater(value);
        onChange(next);
        onPersist(next);
    };

    const updateChannel = (channelId: string, patch: Partial<PaymentChannelConfig>) => {
        updateDraft(prev => {
            const normalized = normalizeSubscriptionChannels(prev.paymentConfig?.subscriptionChannels);
            const nextChannels = normalized.map(channel => channel.id === channelId ? { ...channel, ...patch } : channel);
            return {
                ...prev,
                paymentConfig: {
                    ...prev.paymentConfig!,
                    subscriptionChannels: nextChannels,
                },
            };
        });
    };

    const addChannel = () => {
        updateDraft(prev => {
            const normalized = normalizeSubscriptionChannels(prev.paymentConfig?.subscriptionChannels);
            const id = `custom_${Date.now()}`;
            return {
                ...prev,
                paymentConfig: {
                    ...prev.paymentConfig!,
                    subscriptionChannels: [
                        ...normalized,
                        {
                            id,
                            name: 'Kênh mới',
                            provider: 'custom',
                            enabled: false,
                            note: '',
                            checkoutUrlTemplate: '',
                            qrImageTemplate: '',
                            webhookUrl: '',
                        },
                    ],
                },
            };
        });
    };

    const removeChannel = (channelId: string) => {
        updateDraft(prev => ({
            ...prev,
            paymentConfig: {
                ...prev.paymentConfig!,
                subscriptionChannels: normalizeSubscriptionChannels(prev.paymentConfig?.subscriptionChannels)
                    .filter(channel => channel.id !== channelId),
            },
        }));
    };

    const applyRequestDecision = (
        request: SubscriptionRequest,
        status: SubscriptionRequestStatus,
        adminNote = '',
    ) => {
        const nowIso = new Date().toISOString();
        const today = nowIso.split('T')[0];
        const host = hostUsers.find(item => item.id === request.hostId);

        if (status === 'approved' && host) {
            const nextPlanId = request.requestedPlanId || host.subscriptionPlanId;
            const nextAddonIds = request.requestedAddonIds && request.requestedAddonIds.length > 0
                ? request.requestedAddonIds
                : request.removedAddonIds && request.removedAddonIds.length > 0
                    ? (host.activeAddons || []).filter(id => !request.removedAddonIds?.includes(id))
                    : host.activeAddons || [];

            updateUser({
                ...host,
                subscriptionPlanId: nextPlanId,
                activeAddons: nextAddonIds,
                subscriptionStartDate: request.requestedPlanId && request.requestedPlanId !== host.subscriptionPlanId
                    ? today
                    : host.subscriptionStartDate || today,
                subscriptionEndDate: request.requestedPlanId && request.requestedPlanId !== host.subscriptionPlanId
                    ? host.subscriptionEndDate || addDays(today, 30)
                    : host.subscriptionEndDate,
            });
        }

        persistDraft(prev => ({
            ...prev,
            subscriptionRequests: (prev.subscriptionRequests || []).map(item => item.id === request.id
                ? {
                    ...item,
                    status,
                    reviewedAt: nowIso,
                    reviewedBy: currentUser?.id || 'admin',
                    adminNote: adminNote || item.adminNote || '',
                }
                : item),
        }));
    };

    const updateGatewayConfig = (hostId: string, patch: Partial<HostPaymentGatewayConfig>) => {
        updateDraft(prev => {
            const current = normalizeHostPaymentGatewayConfig(
                hostId,
                prev.paymentConfig?.hostGatewayConfigs?.[hostId],
            );

            return {
                ...prev,
                paymentConfig: {
                    ...prev.paymentConfig!,
                    hostGatewayConfigs: {
                        ...(prev.paymentConfig?.hostGatewayConfigs || {}),
                        [hostId]: {
                            ...current,
                            ...patch,
                            updatedAt: new Date().toISOString(),
                        },
                    },
                },
            };
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-4">
                <div className="rounded-[1.75rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 dark:border-blue-900/40 dark:from-blue-950/20 dark:to-slate-950">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                        <Crown className="h-4 w-4" />
                        Request đổi gói
                    </div>
                    <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{pendingCount}</div>
                    <div className="mt-1 text-xs text-slate-500">đang chờ thanh toán hoặc chờ admin duyệt</div>
                </div>
                <div className="rounded-[1.75rem] border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 dark:border-violet-900/40 dark:from-violet-950/20 dark:to-slate-950">
                    <div className="flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
                        <Sparkles className="h-4 w-4" />
                        Kênh subscription
                    </div>
                    <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                        {channels.filter(channel => channel.enabled).length}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">kênh đang bật để host tạo QR thanh toán</div>
                </div>
                <div className="rounded-[1.75rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-slate-950">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                        <Radio className="h-4 w-4" />
                        Webhook host
                    </div>
                    <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                        {Object.values(hostGatewayConfigs).filter(config => config.enabled).length}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">host đã bật đối soát tự động</div>
                </div>
                <div className="rounded-[1.75rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-slate-950">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
                        <Banknote className="h-4 w-4" />
                        Doanh thu chờ duyệt
                    </div>
                    <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(
                            requests
                                .filter(request => request.status === 'pending_payment' || request.status === 'pending_review')
                                .reduce((sum, request) => sum + (request.amount || 0), 0),
                        )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">tổng giá trị yêu cầu đang treo</div>
                </div>
            </div>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Kênh thanh toán subscription</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Host bấm mua gói hoặc add-on sẽ lấy cấu hình tại đây để tạo link thanh toán, QR SePay hoặc webhook custom.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={addChannel}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <Plus className="h-4 w-4" />
                        Thêm kênh mới
                    </button>
                </div>

                <div className="mt-5 grid gap-4">
                    {channels.map(channel => (
                        <div key={channel.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                            <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr]">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <input
                                            value={channel.name}
                                            onChange={event => updateChannel(channel.id, { name: event.target.value })}
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeChannel(channel.id)}
                                            className="rounded-2xl border border-rose-200 px-3 py-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-950/20"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                    <select
                                        value={channel.provider}
                                        onChange={event => updateChannel(channel.id, { provider: event.target.value as PaymentChannelConfig['provider'] })}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    >
                                        <option value="manual">Thủ công</option>
                                        <option value="sepay">SePay</option>
                                        <option value="custom">Webhook custom</option>
                                    </select>
                                    <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                                        <span>Bật cho host sử dụng</span>
                                        <input
                                            type="checkbox"
                                            checked={channel.enabled}
                                            onChange={event => updateChannel(channel.id, { enabled: event.target.checked })}
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </label>
                                </div>
                                <div className="space-y-3">
                                    <input
                                        value={channel.checkoutUrlTemplate || ''}
                                        onChange={event => updateChannel(channel.id, { checkoutUrlTemplate: event.target.value })}
                                        placeholder="Checkout URL template"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    />
                                    <input
                                        value={channel.qrImageTemplate || ''}
                                        onChange={event => updateChannel(channel.id, { qrImageTemplate: event.target.value })}
                                        placeholder="QR image template"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    />
                                    <input
                                        value={channel.webhookUrl || ''}
                                        onChange={event => updateChannel(channel.id, { webhookUrl: event.target.value })}
                                        placeholder="Webhook / callback URL"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                        <div className="font-semibold text-slate-900 dark:text-white">{getProviderLabel(channel.provider)}</div>
                                        <div className="mt-2 leading-6">
                                            Dùng các biến: <code>{'{amount}'}</code>, <code>{'{code}'}</code>, <code>{'{description}'}</code>, <code>{'{bankName}'}</code>, <code>{'{accountNumber}'}</code>, <code>{'{accountName}'}</code>.
                                        </div>
                                    </div>
                                    <textarea
                                        value={channel.note || ''}
                                        onChange={event => updateChannel(channel.id, { note: event.target.value })}
                                        placeholder="Ghi chú hiển thị cho host"
                                        className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Đề nghị đổi gói từ host</h3>
                </div>
                <div className="mt-5 space-y-4">
                    {requests.length === 0 && (
                        <div className="rounded-[1.5rem] border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700">
                            Chưa có yêu cầu đổi gói hoặc mua add-on nào từ host.
                        </div>
                    )}
                    {requests.map(request => {
                        const host = hostUsers.find(user => user.id === request.hostId);
                        const currentPlan = pricingTiers.find(tier => tier.id === (request.currentPlanId || host?.subscriptionPlanId));
                        const targetPlan = pricingTiers.find(tier => tier.id === request.requestedPlanId);
                        const requestedAddons = (value.addons || []).filter(addon => request.requestedAddonIds?.includes(addon.id));
                        const effectiveFeatures = buildPlanFeatureList(targetPlan || currentPlan, requestedAddons);

                        return (
                            <div key={request.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="text-lg font-semibold text-slate-900 dark:text-white">{request.hostName}</div>
                                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${REQUEST_TONE[request.status]}`}>
                                                {REQUEST_LABEL[request.status]}
                                            </span>
                                            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                                                {request.paymentCode}
                                            </span>
                                        </div>
                                        <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
                                            <div>Gói hiện tại: <span className="font-semibold text-slate-900 dark:text-white">{currentPlan?.name || 'Chưa gán'}</span></div>
                                            <div>Gói đề nghị: <span className="font-semibold text-slate-900 dark:text-white">{targetPlan?.name || currentPlan?.name || 'Giữ nguyên'}</span></div>
                                            <div>Số tiền: <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(request.amount)}</span></div>
                                <div>Thời gian: <span className="font-semibold text-slate-900 dark:text-white">{formatDateTimeVN(request.requestedAt, request.requestedAt)}</span></div>
                                        </div>
                                        {request.note && (
                                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                                {request.note}
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            {requestedAddons.length === 0 ? (
                                                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                    Không đổi add-on
                                                </span>
                                            ) : requestedAddons.map(addon => (
                                                <span key={addon.id} className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950/30 dark:text-violet-300">
                                                    {addon.name}
                                                </span>
                                            ))}
                                        </div>
                                        {effectiveFeatures.length > 0 && (
                                            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                                                {effectiveFeatures.slice(0, 6).map(feature => (
                                                    <div key={feature} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-[280px] rounded-[1.5rem] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                            <div>Kênh: <span className="font-semibold text-slate-900 dark:text-white">{request.paymentChannelProvider || 'manual'}</span></div>
                                            {request.paymentLink && (
                                                <a
                                                    href={request.paymentLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                                                >
                                                    Mở link thanh toán
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                                                QR hoặc link thanh toán được lấy trực tiếp từ cấu hình subscription channel. Khi admin duyệt, cấu hình host và sheet sẽ đồng bộ theo gói mới.
                                            </div>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {request.status === 'pending_payment' && request.amount > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => applyRequestDecision(request, 'pending_review', 'Admin đã xác nhận nhận tiền.')}
                                                    className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 transition hover:bg-amber-700"
                                                >
                                                    <Banknote className="h-4 w-4" />
                                                    Xác nhận đã thu
                                                </button>
                                            )}
                                            {request.status !== 'approved' && request.status !== 'rejected' && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => applyRequestDecision(request, 'approved', 'Admin đã duyệt và áp cấu hình cho host.')}
                                                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Duyệt và áp dụng
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => applyRequestDecision(request, 'rejected', 'Admin từ chối yêu cầu thay đổi gói.')}
                                                        className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-950/20"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        Từ chối
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Webhook thanh toán theo host</h3>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                    Admin có thể xem và chỉnh trực tiếp cấu hình đối soát thanh toán của từng host. Bấm lưu ở cuối trang để áp dụng toàn bộ thay đổi cấu hình.
                </p>
                <div className="mt-5 grid gap-4">
                    {hostUsers.map(host => {
                        const config = normalizeHostPaymentGatewayConfig(
                            host.id,
                            value.paymentConfig?.hostGatewayConfigs?.[host.id],
                        );
                        const webhookUrl = buildHostPaymentWebhookUrl(value.googleSheetWebhookUrl || '', {
                            hostId: host.id,
                            provider: config.provider,
                            webhookToken: config.webhookToken,
                        });

                        return (
                            <div key={host.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <div className="text-lg font-semibold text-slate-900 dark:text-white">{host.name}</div>
                                        <div className="text-sm text-slate-500">{host.email}</div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config.enabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                                            {config.enabled ? 'Đang bật đối soát' : 'Chưa bật'}
                                        </span>
                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                                            {config.providerLabel || getProviderLabel(config.provider)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                    <div className="space-y-3">
                                        <select
                                            value={config.provider}
                                            onChange={event => updateGatewayConfig(host.id, {
                                                provider: event.target.value as HostPaymentGatewayConfig['provider'],
                                                providerLabel: getProviderLabel(event.target.value as HostPaymentGatewayConfig['provider']),
                                            })}
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                        >
                                            <option value="manual">Thủ công</option>
                                            <option value="sepay">SePay</option>
                                            <option value="custom">Webhook custom</option>
                                        </select>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                                                <span>Bật đối soát tự động</span>
                                                <input
                                                    type="checkbox"
                                                    checked={config.enabled}
                                                    onChange={event => updateGatewayConfig(host.id, { enabled: event.target.checked })}
                                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </label>
                                            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                                                <span>Tự gạch bill</span>
                                                <input
                                                    type="checkbox"
                                                    checked={config.autoMarkPaid}
                                                    onChange={event => updateGatewayConfig(host.id, { autoMarkPaid: event.target.checked })}
                                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </label>
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-3">
                                            <input
                                                value={config.bankName}
                                                onChange={event => updateGatewayConfig(host.id, { bankName: event.target.value })}
                                                placeholder="Ngân hàng"
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                            />
                                            <input
                                                value={config.accountNumber}
                                                onChange={event => updateGatewayConfig(host.id, { accountNumber: event.target.value })}
                                                placeholder="Số tài khoản"
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                            />
                                            <input
                                                value={config.accountName}
                                                onChange={event => updateGatewayConfig(host.id, { accountName: event.target.value })}
                                                placeholder="Chủ tài khoản"
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Webhook URL</div>
                                            <div className="mt-3 break-all text-xs leading-6 text-slate-600 dark:text-slate-300">
                                                {webhookUrl || 'Cần Google Apps Script URL để sinh webhook cho host này.'}
                                            </div>
                                        </div>
                                        <textarea
                                            value={config.note || ''}
                                            onChange={event => updateGatewayConfig(host.id, { note: event.target.value })}
                                            placeholder="Ghi chú nội bộ cho admin hoặc host"
                                            className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                        />
                                        <div className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                            Lần webhook gần nhất: {config.lastWebhookAt ? formatDateTimeVN(config.lastWebhookAt, config.lastWebhookAt) : 'Chưa có'}
                                            <br />
                                            Trạng thái: {config.lastWebhookStatus || 'Chưa ghi nhận'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
