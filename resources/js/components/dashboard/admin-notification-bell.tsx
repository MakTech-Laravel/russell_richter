import { router } from '@inertiajs/react';
import { Bell, CalendarCheck, CreditCard, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface AdminNotification {
    id: string;
    type: string;
    title: string;
    message: string;
    url: string;
    read_at: string | null;
    created_at: string;
}

interface NotificationsResponse {
    notifications: AdminNotification[];
    unread_count: number;
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : '';
}

async function requestNotifications(countOnly = false): Promise<NotificationsResponse> {
    const url = countOnly
        ? `${route('admin.notifications.index')}?count_only=1`
        : route('admin.notifications.index');

    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    });

    if (!response.ok) {
        throw new Error('Failed to load notifications');
    }

    const data = await response.json();

    if (countOnly) {
        return { notifications: [], unread_count: data.unread_count ?? 0 };
    }

    return data;
}

async function markNotificationRead(id: string): Promise<number> {
    const response = await fetch(route('admin.notifications.read', id), {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
    });

    if (!response.ok) {
        throw new Error('Failed to mark notification as read');
    }

    const data = await response.json();

    return data.unread_count ?? 0;
}

async function markAllNotificationsRead(): Promise<number> {
    const response = await fetch(route('admin.notifications.read-all'), {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
    });

    if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
    }

    return 0;
}

function NotificationIcon({ type }: { type: string }) {
    if (type === 'transaction') {
        return <CreditCard className="h-4 w-4 text-gold-400" />;
    }

    return <CalendarCheck className="h-4 w-4 text-sky-400" />;
}

interface AdminNotificationBellProps {
    initialUnreadCount?: number;
}

export function AdminNotificationBell({ initialUnreadCount = 0 }: AdminNotificationBellProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

    useEffect(() => {
        setUnreadCount(initialUnreadCount);
    }, [initialUnreadCount]);

    const refreshUnreadCount = useCallback(async () => {
        try {
            const data = await requestNotifications(true);
            setUnreadCount(data.unread_count);
        } catch {
            // Ignore background refresh errors.
        }
    }, []);

    useEffect(() => {
        const interval = window.setInterval(refreshUnreadCount, 60_000);

        return () => window.clearInterval(interval);
    }, [refreshUnreadCount]);

    const loadNotifications = useCallback(async () => {
        setLoading(true);

        try {
            const data = await requestNotifications();
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleOpenChange = (nextOpen: boolean): void => {
        setOpen(nextOpen);

        if (nextOpen) {
            void loadNotifications();
        }
    };

    const handleNotificationClick = async (notification: AdminNotification): Promise<void> => {
        if (!notification.read_at) {
            try {
                const nextCount = await markNotificationRead(notification.id);
                setUnreadCount(nextCount);
                setNotifications((current) =>
                    current.map((item) =>
                        item.id === notification.id
                            ? { ...item, read_at: new Date().toISOString() }
                            : item,
                    ),
                );
            } catch {
                // Continue navigation even if marking read fails.
            }
        }

        setOpen(false);
        router.visit(notification.url);
    };

    const handleMarkAllRead = async (): Promise<void> => {
        try {
            await markAllNotificationsRead();
            setUnreadCount(0);
            setNotifications((current) =>
                current.map((item) => ({ ...item, read_at: item.read_at ?? new Date().toISOString() })),
            );
        } catch {
            // Ignore mark-all errors.
        }
    };

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-ink-800 text-slate-300 hover:bg-ink-700 hover:text-gold-400"
                    aria-label="Notifications"
                >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-ink-900 ring-2 ring-ink-900">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-80 border-white/10 bg-ink-900 p-0 text-white"
            >
                <div className="flex items-center justify-between px-3 py-2.5">
                    <DropdownMenuLabel className="p-0 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Notifications
                    </DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={() => void handleMarkAllRead()}
                            className="text-[11px] font-semibold text-gold-400 hover:text-gold-300"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                {loading ? (
                    <div className="flex items-center justify-center gap-2 px-3 py-8 text-sm text-slate-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="px-3 py-8 text-center text-sm text-slate-500">
                        No notifications yet.
                    </div>
                ) : (
                    <div className="max-h-80 overflow-y-auto py-1">
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    'cursor-pointer items-start gap-3 rounded-none px-3 py-3 focus:bg-white/5 focus:text-white',
                                    !notification.read_at && 'bg-gold-500/5',
                                )}
                                onClick={() => void handleNotificationClick(notification)}
                            >
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                                    <NotificationIcon type={notification.type} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-semibold text-white">
                                        {notification.title}
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">
                                        {notification.message}
                                    </span>
                                    <span className="mt-1 block text-[10px] text-slate-500">
                                        {notification.created_at}
                                    </span>
                                </span>
                                {!notification.read_at && (
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold-400" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
