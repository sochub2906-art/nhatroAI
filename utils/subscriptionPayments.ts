import type {
    AddOnFeature,
    BankInfo,
    PaymentChannelConfig,
    PricingTier,
    SubscriptionRequest,
    SubscriptionRequestType,
} from '../types';

export const DEFAULT_SUBSCRIPTION_CHANNELS: PaymentChannelConfig[] = [
    {
        id: 'sepay',
        name: 'SePay QR',
        provider: 'sepay',
        enabled: true,
        note: 'Dùng mã chuyển khoản để đối soát yêu cầu đổi gói.',
    },
    {
        id: 'custom',
        name: 'Webhook / đối tác khác',
        provider: 'custom',
        enabled: false,
        note: 'Cấu hình URL riêng nếu dùng cổng trung gian khác.',
    },
];

function sanitizeToken(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase();
}

export function normalizeSubscriptionChannels(channels?: PaymentChannelConfig[]): PaymentChannelConfig[] {
    const seeded = channels && channels.length > 0 ? channels : DEFAULT_SUBSCRIPTION_CHANNELS;
    const known = new Map(DEFAULT_SUBSCRIPTION_CHANNELS.map(channel => [channel.id, channel]));
    return seeded.map(channel => ({
        ...(known.get(channel.id) || {}),
        ...channel,
        enabled: channel.enabled !== false,
    }));
}

export function interpolatePaymentTemplate(template: string, values: Record<string, string | number | undefined>): string {
    return Object.entries(values).reduce((result, [key, value]) => {
        const resolved = value === undefined || value === null ? '' : String(value);
        return result.replaceAll(`{${key}}`, encodeURIComponent(resolved)).replaceAll(`{{${key}}}`, resolved);
    }, template);
}

export function buildSubscriptionPaymentCode(hostId: string): string {
    return `SRSUB-${sanitizeToken(hostId).slice(-8)}-${Date.now().toString().slice(-6)}`;
}

export function buildSubscriptionDescription(plan?: PricingTier | null, addons: AddOnFeature[] = []): string {
    const parts: string[] = [];
    if (plan) parts.push(`Gói ${plan.name}`);
    if (addons.length > 0) parts.push(`Add-on ${addons.map(addon => addon.name).join(', ')}`);
    return parts.join(' + ') || 'Đề nghị thay đổi gói';
}

export function calculateSubscriptionAmount(plan?: PricingTier | null, addons: AddOnFeature[] = []): number {
    return (plan?.price || 0) + addons.reduce((sum, addon) => sum + (addon.price || 0), 0);
}

export function buildFallbackQrPayload(bankInfo: BankInfo, amount: number, paymentCode: string, description: string): string {
    return [
        `BANK:${bankInfo.bankName || ''}`,
        `ACCOUNT:${bankInfo.accountNumber || ''}`,
        `OWNER:${bankInfo.accountName || ''}`,
        `AMOUNT:${amount}`,
        `REF:${paymentCode}`,
        `DESC:${description}`,
    ].join('|');
}

export function resolveSubscriptionChannelArtifacts(
    channel: PaymentChannelConfig | undefined,
    bankInfo: BankInfo,
    amount: number,
    paymentCode: string,
    description: string,
) {
    const values = {
        amount,
        code: paymentCode,
        description,
        bankName: bankInfo.bankName || '',
        accountNumber: bankInfo.accountNumber || '',
        accountName: bankInfo.accountName || '',
    };

    const paymentLink = channel?.checkoutUrlTemplate
        ? interpolatePaymentTemplate(channel.checkoutUrlTemplate, values)
        : '';
    const qrImageUrl = channel?.qrImageTemplate
        ? interpolatePaymentTemplate(channel.qrImageTemplate, values)
        : '';
    const qrPayload = buildFallbackQrPayload(bankInfo, amount, paymentCode, description);

    return {
        paymentLink,
        qrImageUrl,
        qrPayload,
    };
}

export function createSubscriptionRequestRecord(params: {
    hostId: string;
    hostName: string;
    hostEmail: string;
    currentPlanId?: string;
    requestedPlanId?: string;
    requestedAddonIds?: string[];
    removedAddonIds?: string[];
    type: SubscriptionRequestType;
    amount: number;
    paymentCode: string;
    paymentChannel?: PaymentChannelConfig;
    paymentLink?: string;
    qrImageUrl?: string;
    qrPayload?: string;
    note?: string;
}): SubscriptionRequest {
    return {
        id: `SUBREQ_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        hostId: params.hostId,
        hostName: params.hostName,
        hostEmail: params.hostEmail,
        currentPlanId: params.currentPlanId,
        requestedPlanId: params.requestedPlanId,
        requestedAddonIds: params.requestedAddonIds || [],
        removedAddonIds: params.removedAddonIds || [],
        type: params.type,
        status: 'pending_payment',
        amount: params.amount,
        paymentCode: params.paymentCode,
        paymentChannelId: params.paymentChannel?.id,
        paymentChannelProvider: params.paymentChannel?.provider,
        paymentLink: params.paymentLink || '',
        qrImageUrl: params.qrImageUrl || '',
        qrPayload: params.qrPayload || '',
        note: params.note || '',
        requestedAt: new Date().toISOString(),
    };
}

export function buildPlanFeatureList(plan?: PricingTier | null, addons: AddOnFeature[] = []): string[] {
    const items = [...(plan?.features || [])];
    addons.forEach(addon => {
        if (addon.description) items.push(addon.description);
        (addon.features || []).forEach(feature => items.push(feature));
    });
    return Array.from(new Set(items.filter(Boolean)));
}
