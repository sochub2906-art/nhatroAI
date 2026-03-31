import type { AppNotification } from '../types';

const NOTIFICATION_STORAGE_PREFIX = 'sr_notifications_';
const MAX_NOTIFICATIONS = 80;

function getStorageKey(hostId: string): string {
    return `${NOTIFICATION_STORAGE_PREFIX}${hostId}`;
}

function sortNotifications(items: AppNotification[]): AppNotification[] {
    return [...items].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
}

export function loadHostNotifications(hostId: string): AppNotification[] {
    try {
        const raw = localStorage.getItem(getStorageKey(hostId));
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return sortNotifications(parsed).slice(0, MAX_NOTIFICATIONS);
    } catch (error) {
        console.warn('Failed to load host notifications:', error);
        return [];
    }
}

export function saveHostNotifications(hostId: string, notifications: AppNotification[]): void {
    try {
        localStorage.setItem(
            getStorageKey(hostId),
            JSON.stringify(sortNotifications(notifications).slice(0, MAX_NOTIFICATIONS)),
        );
    } catch (error) {
        console.warn('Failed to save host notifications:', error);
    }
}

export function upsertHostNotifications(hostId: string, notifications: AppNotification[]): AppNotification[] {
    const existing = loadHostNotifications(hostId);
    const mergedMap = new Map<string, AppNotification>();

    existing.forEach(notification => mergedMap.set(notification.id, notification));
    notifications.forEach(notification => {
        const previous = mergedMap.get(notification.id);
        mergedMap.set(notification.id, previous ? { ...previous, ...notification } : notification);
    });

    const next = sortNotifications(Array.from(mergedMap.values())).slice(0, MAX_NOTIFICATIONS);
    saveHostNotifications(hostId, next);
    return next;
}

export function markHostNotificationRead(hostId: string, notificationId: string): AppNotification[] {
    const next = loadHostNotifications(hostId).map(notification =>
        notification.id === notificationId
            ? { ...notification, readAt: notification.readAt || new Date().toISOString() }
            : notification,
    );
    saveHostNotifications(hostId, next);
    return next;
}

export function markAllHostNotificationsRead(hostId: string): AppNotification[] {
    const now = new Date().toISOString();
    const next = loadHostNotifications(hostId).map(notification => ({
        ...notification,
        readAt: notification.readAt || now,
    }));
    saveHostNotifications(hostId, next);
    return next;
}

export function removeHostNotification(hostId: string, notificationId: string): AppNotification[] {
    const next = loadHostNotifications(hostId).filter(notification => notification.id !== notificationId);
    saveHostNotifications(hostId, next);
    return next;
}
