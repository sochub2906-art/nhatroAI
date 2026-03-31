import type { HostPaymentGatewayConfig, PaymentGatewayProvider } from '../types';

function randomToken(length = 24): string {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    return Array.from(values, value => alphabet[value % alphabet.length]).join('');
}

function defaultProviderLabel(provider: PaymentGatewayProvider): string {
    switch (provider) {
        case 'sepay':
            return 'SePay';
        case 'custom':
            return 'Webhook custom';
        default:
            return 'Thu cong';
    }
}

export function createDefaultHostPaymentGatewayConfig(
    hostId: string,
    seed?: Partial<HostPaymentGatewayConfig>,
): HostPaymentGatewayConfig {
    const provider = seed?.provider || 'manual';
    return {
        hostId,
        provider,
        providerLabel: seed?.providerLabel || defaultProviderLabel(provider),
        enabled: seed?.enabled ?? false,
        bankName: seed?.bankName || '',
        accountNumber: seed?.accountNumber || '',
        accountName: seed?.accountName || '',
        webhookToken: seed?.webhookToken || randomToken(),
        generatedWebhookUrl: seed?.generatedWebhookUrl || '',
        autoMarkPaid: seed?.autoMarkPaid ?? true,
        matchMode: seed?.matchMode || 'bill_id',
        note: seed?.note || '',
        lastWebhookAt: seed?.lastWebhookAt || '',
        lastWebhookStatus: seed?.lastWebhookStatus || '',
        lastWebhookMessage: seed?.lastWebhookMessage || '',
        updatedAt: seed?.updatedAt || new Date().toISOString(),
    };
}

export function normalizeHostPaymentGatewayConfig(
    hostId: string,
    seed?: Partial<HostPaymentGatewayConfig>,
): HostPaymentGatewayConfig {
    return createDefaultHostPaymentGatewayConfig(hostId, seed);
}

export function buildHostPaymentWebhookUrl(
    baseWebhookUrl: string,
    config: Pick<HostPaymentGatewayConfig, 'hostId' | 'provider' | 'webhookToken'>,
): string {
    if (!baseWebhookUrl) return '';
    try {
        const url = new URL(baseWebhookUrl);
        url.searchParams.set('action', 'paymentWebhook');
        url.searchParams.set('hostId', config.hostId);
        url.searchParams.set('provider', config.provider);
        if (config.webhookToken) {
            url.searchParams.set('token', config.webhookToken);
        }
        return url.toString();
    } catch {
        return '';
    }
}
