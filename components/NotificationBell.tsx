import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Bell, CheckCheck, CircleCheck, Info, X } from 'lucide-react';
import { useApp } from '../AppContext';
import type { AppNotification } from '../types';
import { formatDateTimeVN } from '../utils/dateFormat';

function formatNotificationTime(value: string): string {
    return formatDateTimeVN(value, value);
}

function getSeverityIcon(notification: AppNotification) {
    if (notification.severity === 'success' || notification.type === 'payment_paid' || notification.type === 'gateway_payment_received') {
        return CircleCheck;
    }
    if (notification.severity === 'warning') {
        return AlertTriangle;
    }
    return Info;
}

function getSeverityClass(notification: AppNotification): string {
    if (notification.severity === 'success' || notification.type === 'payment_paid' || notification.type === 'gateway_payment_received') {
        return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300';
    }
    if (notification.severity === 'warning') {
        return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300';
    }
    if (notification.severity === 'error') {
        return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-300';
    }
    return 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200';
}

export default function NotificationBell() {
    const [open, setOpen] = React.useState(false);
    const {
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
    } = useApp();
    const navigate = useNavigate();
    const rootRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [open]);

    const handleOpenNotification = (notification: AppNotification) => {
        markNotificationRead(notification.id);
        if (notification.actionPath) {
            navigate(notification.actionPath);
            setOpen(false);
        }
    };

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen(value => !value)}
                className="relative rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                title="Thông báo"
            >
                <Bell className="h-5 w-5" />
                {unreadNotificationCount > 0 && (
                    <>
                        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                        <span className="absolute -right-1 -top-1 inline-flex min-w-[1.2rem] items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                        </span>
                    </>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-14 z-[70] w-[min(92vw,24rem)] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 dark:border-slate-800">
                        <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">Thông báo</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                {notifications.length === 0 ? 'Chưa có cập nhật mới.' : `${unreadNotificationCount} mục chưa đọc`}
                            </div>
                        </div>
                        {notifications.length > 0 && (
                            <button
                                type="button"
                                onClick={markAllNotificationsRead}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                Đọc hết
                            </button>
                        )}
                    </div>

                    <div className="max-h-[28rem] overflow-y-auto p-3">
                        {notifications.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                Khi có tiền vào, nhắc nợ hoặc webhook thanh toán, thông báo sẽ hiện ở đây.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notifications.map(notification => {
                                    const Icon = getSeverityIcon(notification);
                                    return (
                                        <div
                                            key={notification.id}
                                            className={`rounded-2xl border px-4 py-3 ${getSeverityClass(notification)} ${notification.actionPath ? 'cursor-pointer' : ''} ${notification.readAt ? 'opacity-80' : ''}`}
                                            onClick={() => handleOpenNotification(notification)}
                                            role={notification.actionPath ? 'button' : undefined}
                                            tabIndex={notification.actionPath ? 0 : -1}
                                            onKeyDown={event => {
                                                if (!notification.actionPath) return;
                                                if (event.key === 'Enter' || event.key === ' ') {
                                                    event.preventDefault();
                                                    handleOpenNotification(notification);
                                                }
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 rounded-2xl bg-white/70 p-2 dark:bg-slate-900/70">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <div className="text-sm font-semibold">{notification.title}</div>
                                                            <div className="mt-1 text-sm leading-6">{notification.message}</div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={event => {
                                                                event.stopPropagation();
                                                                dismissNotification(notification.id);
                                                            }}
                                                            className="rounded-xl p-1.5 text-slate-400 transition hover:bg-black/5 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-slate-200"
                                                            title="Ẩn thông báo"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                        <span>{formatNotificationTime(notification.createdAt)}</span>
                                                        {notification.actionPath && <span>Xem chi tiết</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
