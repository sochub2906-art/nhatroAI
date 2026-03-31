import React, { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, CheckCircle2, Crown, ExternalLink, Layers3, Radio, ReceiptText, Sparkles, WalletCards } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency, useApp } from '../AppContext';
import type { AddOnFeature, PaymentChannelConfig, SubscriptionRequest, SubscriptionRequestStatus, SubscriptionRequestType } from '../types';
import {
    buildSubscriptionDescription,
    buildSubscriptionPaymentCode,
    calculateSubscriptionAmount,
    createSubscriptionRequestRecord,
    normalizeSubscriptionChannels,
    resolveSubscriptionChannelArtifacts,
} from '../utils/subscriptionPayments';
import { formatDateTimeVN } from '../utils/dateFormat';

const REQUEST_STATUS_LABELS: Record<SubscriptionRequestStatus, string> = {
    draft: 'Nháp',
    pending_payment: 'Chờ thanh toán',
    pending_review: 'Chờ admin duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    cancelled: 'Đã hủy',
};

const REQUEST_STATUS_CLASS: Record<SubscriptionRequestStatus, string> = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    pending_payment: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
    pending_review: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
    rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300',
    cancelled: 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400',
};

function inferRequestType(currentPlanId: string, selectedPlanId: string, addIds: string[], removeIds: string[]): SubscriptionRequestType {
    const planChanged = currentPlanId !== selectedPlanId;
    if (planChanged && (addIds.length > 0 || removeIds.length > 0)) return 'bundle_update';
    if (planChanged) return 'plan_change';
    if (addIds.length > 0) return 'addon_purchase';
    return 'addon_cancel';
}

function RequestBadge({ status }: { status: SubscriptionRequestStatus }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${REQUEST_STATUS_CLASS[status]}`}>
            {REQUEST_STATUS_LABELS[status]}
        </span>
    );
}

function formatRequestType(type: SubscriptionRequestType) {
    switch (type) {
        case 'plan_change':
            return 'Đổi gói';
        case 'addon_purchase':
            return 'Mua add-on';
        case 'addon_cancel':
            return 'Tắt add-on';
        case 'bundle_update':
            return 'Đổi gói + add-on';
        default:
            return type;
    }
}

export default function HostSubscriptionPanel() {
    const { currentUser, allUsers, pricingTiers, adminSettings, updateAdminSettings } = useApp();
    const host = useMemo(
        () => allUsers.find(user => user.id === currentUser?.id) || currentUser,
        [allUsers, currentUser],
    );

    const addons = adminSettings.addons || [];
    const channels = normalizeSubscriptionChannels(adminSettings.paymentConfig?.subscriptionChannels);
    const enabledChannels = channels.filter(channel => channel.enabled);
    const activeAddonIds = host?.activeAddons || [];
    const currentPlan = pricingTiers.find(tier => tier.id === host?.subscriptionPlanId) || null;
    const pendingRequests = (adminSettings.subscriptionRequests || [])
        .filter(request => request.hostId === host?.id)
        .sort((left, right) => new Date(right.requestedAt).getTime() - new Date(left.requestedAt).getTime());

    const [selectedPlanId, setSelectedPlanId] = useState(host?.subscriptionPlanId || pricingTiers[0]?.id || '');
    const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(activeAddonIds);
    const [selectedChannelId, setSelectedChannelId] = useState(enabledChannels[0]?.id || channels[0]?.id || '');
    const [note, setNote] = useState('');
    const [createdRequestId, setCreatedRequestId] = useState('');

    if (!host || host.role !== 'HOST') return null;

    const selectedPlan = pricingTiers.find(tier => tier.id === selectedPlanId) || currentPlan;
    const selectedAddons = addons.filter(addon => selectedAddonIds.includes(addon.id));
    const addedAddonIds = selectedAddonIds.filter(id => !activeAddonIds.includes(id));
    const removedAddonIds = activeAddonIds.filter(id => !selectedAddonIds.includes(id));
    const selectedChannel = channels.find(channel => channel.id === selectedChannelId) || enabledChannels[0] || channels[0];
    const hasChanges = selectedPlanId !== (host.subscriptionPlanId || '') || addedAddonIds.length > 0 || removedAddonIds.length > 0;
    const activeAddonKey = activeAddonIds.join('|');
    const channelKey = channels.map(channel => `${channel.id}:${channel.enabled ? '1' : '0'}`).join('|');

    const requestAmount = calculateSubscriptionAmount(
        selectedPlanId !== host.subscriptionPlanId ? selectedPlan : null,
        addons.filter(addon => addedAddonIds.includes(addon.id)),
    );
    const requestDescription = buildSubscriptionDescription(
        selectedPlanId !== host.subscriptionPlanId ? selectedPlan : null,
        addons.filter(addon => addedAddonIds.includes(addon.id)),
    );
    const latestRequest = pendingRequests.find(request => request.id === createdRequestId) || pendingRequests[0] || null;

    useEffect(() => {
        setSelectedPlanId(host.subscriptionPlanId || pricingTiers[0]?.id || '');
        setSelectedAddonIds(activeAddonIds);
    }, [host.subscriptionPlanId, pricingTiers, activeAddonKey]);

    useEffect(() => {
        if (!selectedChannelId && channels.length > 0) {
            setSelectedChannelId(enabledChannels[0]?.id || channels[0]?.id || '');
        }
    }, [selectedChannelId, channelKey, enabledChannels, channels]);

    const handleToggleAddon = (addonId: string) => {
        setSelectedAddonIds(prev => prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]);
    };

    const handleSubmitRequest = () => {
        if (!selectedPlan || !hasChanges) return;

        const requestType = inferRequestType(host.subscriptionPlanId || '', selectedPlanId, addedAddonIds, removedAddonIds);
        const needsPayment = requestAmount > 0;
        const paymentCode = buildSubscriptionPaymentCode(host.id);
        const paymentArtifacts = resolveSubscriptionChannelArtifacts(
            selectedChannel,
            {
                bankName: adminSettings.paymentConfig?.bankName || '',
                accountNumber: adminSettings.paymentConfig?.accountNumber || '',
                accountName: adminSettings.paymentConfig?.accountName || '',
            },
            requestAmount,
            paymentCode,
            requestDescription,
        );

        const request = createSubscriptionRequestRecord({
            hostId: host.id,
            hostName: host.name,
            hostEmail: host.email,
            currentPlanId: host.subscriptionPlanId,
            requestedPlanId: selectedPlanId,
            requestedAddonIds: selectedAddonIds,
            removedAddonIds,
            type: requestType,
            amount: requestAmount,
            paymentCode,
            paymentChannel: selectedChannel,
            paymentLink: paymentArtifacts.paymentLink,
            qrImageUrl: paymentArtifacts.qrImageUrl,
            qrPayload: paymentArtifacts.qrPayload,
            note,
        });

        const nextRequest: SubscriptionRequest = needsPayment
            ? request
            : { ...request, status: 'pending_review', paymentLink: '', qrImageUrl: '', qrPayload: '' };

        updateAdminSettings({
            ...adminSettings,
            subscriptionRequests: [...(adminSettings.subscriptionRequests || []), nextRequest],
        });
        setCreatedRequestId(nextRequest.id);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                <div className="space-y-6">
                    <section className="overflow-hidden rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-blue-50 p-6 shadow-sm dark:border-amber-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm dark:bg-slate-800/80 dark:text-amber-300">
                                    <Crown className="h-3.5 w-3.5" />
                                    Gói đang dùng
                                </div>
                                <h3 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                                    {currentPlan?.name || 'Chưa chọn gói'}
                                </h3>
                                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                                    Quản lý đổi gói, mua thêm tính năng và theo dõi yêu cầu đồng bộ giữa Host và Admin trong cùng một luồng.
                                </p>
                            </div>
                            <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-4 text-right shadow-sm dark:border-slate-700 dark:bg-slate-950/70">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Chi phí hiện tại</div>
                                <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(currentPlan?.price || 0)}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">mỗi tháng</div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Giới hạn tòa nhà</div>
                                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{currentPlan?.maxBuildings || 0}</div>
                            </div>
                            <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Giới hạn phòng</div>
                                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{currentPlan?.maxRooms || 0}</div>
                            </div>
                            <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Add-on đang bật</div>
                                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{activeAddonIds.length}</div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-500" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Chọn gói dịch vụ</h3>
                        </div>
                        <div className="mt-5 grid gap-4 lg:grid-cols-3">
                            {pricingTiers.map(tier => {
                                const selected = tier.id === selectedPlanId;
                                const current = tier.id === host.subscriptionPlanId;
                                return (
                                    <button
                                        key={tier.id}
                                        type="button"
                                        onClick={() => setSelectedPlanId(tier.id)}
                                        className={`rounded-[1.5rem] border p-5 text-left transition ${selected ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10 dark:border-blue-400 dark:bg-blue-950/30' : 'border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700'}`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-lg font-semibold text-slate-900 dark:text-white">{tier.name}</div>
                                                <div className="mt-1 text-sm text-slate-500">{formatCurrency(tier.price)}/tháng</div>
                                            </div>
                                            {current && <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">Đang dùng</span>}
                                        </div>
                                        <div className="mt-4 flex gap-3 text-xs text-slate-500">
                                            <span>Tòa: {tier.maxBuildings}</span>
                                            <span>Phòng: {tier.maxRooms}</span>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            {tier.features.slice(0, 4).map(feature => (
                                                <div key={feature} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-2">
                            <Layers3 className="h-5 w-5 text-violet-500" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Mua thêm tính năng phụ</h3>
                        </div>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            {addons.length === 0 && <div className="rounded-[1.5rem] border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-700">Admin chưa cấu hình add-on.</div>}
                            {addons.map((addon: AddOnFeature) => {
                                const selected = selectedAddonIds.includes(addon.id);
                                const current = activeAddonIds.includes(addon.id);
                                return (
                                    <button
                                        key={addon.id}
                                        type="button"
                                        onClick={() => handleToggleAddon(addon.id)}
                                        className={`rounded-[1.5rem] border p-5 text-left transition ${selected ? 'border-violet-500 bg-violet-50 shadow-lg shadow-violet-500/10 dark:border-violet-400 dark:bg-violet-950/20' : 'border-slate-200 bg-slate-50 hover:border-violet-200 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700'}`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-white">{addon.name}</div>
                                                <div className="mt-1 text-sm text-slate-500">{formatCurrency(addon.price)}/tháng</div>
                                            </div>
                                            {current && <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">Đang bật</span>}
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{addon.description}</p>
                                        {(addon.features || []).length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                {addon.features!.map(feature => (
                                                    <div key={feature} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                        <BadgeCheck className="mt-0.5 h-3.5 w-3.5 text-violet-500" />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </div>

                <aside className="space-y-6 xl:sticky xl:top-6">
                    <section className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm dark:border-slate-800">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-200">
                            <WalletCards className="h-4 w-4" />
                            Tạo đề nghị đổi gói
                        </div>
                        <div className="mt-5 space-y-4">
                            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Gói chọn</div>
                                <div className="mt-2 text-lg font-semibold">{selectedPlan?.name || 'Chưa chọn'}</div>
                                <div className="mt-1 text-sm text-slate-300">{formatCurrency(selectedPlan?.price || 0)}/tháng</div>
                            </div>

                            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Add-on sẽ áp dụng</div>
                                <div className="mt-3 space-y-2 text-sm text-slate-200">
                                    {selectedAddons.length === 0 && <div>Không chọn add-on nào.</div>}
                                    {selectedAddons.map(addon => (
                                        <div key={addon.id} className="flex items-center justify-between gap-3">
                                            <span>{addon.name}</span>
                                            <span className="text-slate-400">{formatCurrency(addon.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Kênh thanh toán</div>
                                <select
                                    value={selectedChannelId}
                                    onChange={event => setSelectedChannelId(event.target.value)}
                                    className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                                >
                                    {channels.map((channel: PaymentChannelConfig) => (
                                        <option key={channel.id} value={channel.id}>{channel.name}{channel.enabled ? '' : ' (tắt)'}</option>
                                    ))}
                                </select>
                                <div className="mt-3 text-xs leading-5 text-slate-400">
                                    {selectedChannel?.note || 'Nếu chưa có cổng riêng, hệ thống vẫn tạo QR chuyển khoản với mã đối soát.'}
                                </div>
                            </div>

                            <textarea
                                value={note}
                                onChange={event => setNote(event.target.value)}
                                placeholder="Ghi chú cho admin: cần nâng room limit, mở thêm CCCD reader, hỗ trợ webhook riêng..."
                                className="min-h-[96px] w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                            />

                            <div className="rounded-[1.5rem] border border-blue-500/20 bg-blue-500/10 p-4">
                                <div className="text-xs uppercase tracking-[0.2em] text-blue-200">Tạm tính cần thanh toán</div>
                                <div className="mt-2 text-3xl font-bold">{formatCurrency(requestAmount)}</div>
                                <div className="mt-2 text-xs leading-5 text-blue-100">
                                    Nếu chỉ tắt add-on hoặc gửi đề nghị không phát sinh phí, yêu cầu sẽ chuyển thẳng sang chờ admin duyệt.
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmitRequest}
                                disabled={!hasChanges}
                                className="w-full rounded-[1.5rem] bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Tạo đề nghị thay đổi gói
                            </button>
                        </div>
                    </section>

                    {latestRequest && (
                        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                    <ReceiptText className="h-4 w-4 text-emerald-500" />
                                    Yêu cầu gần nhất
                                </div>
                                <RequestBadge status={latestRequest.status} />
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px] md:items-start">
                                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <div>Mã đối soát: <span className="font-semibold text-slate-900 dark:text-white">{latestRequest.paymentCode}</span></div>
                                    <div>Loại yêu cầu: <span className="font-semibold text-slate-900 dark:text-white">{formatRequestType(latestRequest.type)}</span></div>
                                    <div>Số tiền: <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(latestRequest.amount)}</span></div>
                                    <div>Thời gian: <span className="font-semibold text-slate-900 dark:text-white">{formatDateTimeVN(latestRequest.requestedAt, latestRequest.requestedAt)}</span></div>
                                    {latestRequest.note && <div>Ghi chú: <span className="font-semibold text-slate-900 dark:text-white">{latestRequest.note}</span></div>}
                                    {latestRequest.paymentLink && (
                                        <a href={latestRequest.paymentLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                                            Mở cổng thanh toán
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                                    {latestRequest.qrImageUrl ? (
                                        <img src={latestRequest.qrImageUrl} alt="QR thanh toán gói dịch vụ" className="h-[148px] w-[148px] rounded-xl object-cover" />
                                    ) : (
                                        <QRCodeSVG value={latestRequest.qrPayload || latestRequest.paymentCode} size={148} bgColor="transparent" fgColor="currentColor" className="text-slate-900 dark:text-white" />
                                    )}
                                    <div className="mt-3 text-center text-xs text-slate-500">
                                        Quét QR hoặc chuyển khoản đúng mã để admin đối soát.
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                            <Radio className="h-4 w-4 text-violet-500" />
                            Lịch sử yêu cầu đồng bộ
                        </div>
                        <div className="mt-4 space-y-3">
                            {pendingRequests.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 dark:border-slate-700">Chưa có yêu cầu đổi gói nào.</div>}
                            {pendingRequests.slice(0, 6).map(request => (
                                <div key={request.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{request.paymentCode}</div>
                                        <RequestBadge status={request.status} />
                                    </div>
                                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                        {formatDateTimeVN(request.requestedAt, request.requestedAt)} · {formatRequestType(request.type)}
                                    </div>
                                    <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                                        {formatCurrency(request.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
