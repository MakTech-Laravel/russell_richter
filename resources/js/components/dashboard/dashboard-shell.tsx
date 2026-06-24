import { Form, Link, router, usePage } from '@inertiajs/react';
import { LogOut, Menu, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CompactLogo } from '@/components/brand';
import { AdminNotificationBell } from '@/components/dashboard/admin-notification-bell';
import type { DashboardNavItem } from '@/config/dashboard-nav';
import { useNavActive } from '@/hooks/use-nav-active';
import { cn } from '@/lib/utils';

interface DashboardUser {
    name: string;
    email: string;
}

interface GlobalSearchConfig {
    href: string;
    placeholder?: string;
    preserveQueryOnPath?: string;
}

interface DashboardShellProps {
    portalLabel: string;
    nav: DashboardNavItem[];
    user: DashboardUser;
    logoutUrl: string;
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    pendingBookings?: number;
    unreadNotifications?: number;
    showAdminNotifications?: boolean;
    globalSearch?: GlobalSearchConfig;
    children: React.ReactNode;
}

function useGlobalSearchValue(preserveQueryOnPath?: string): string {
    const { url } = usePage();

    return useMemo(() => {
        if (!preserveQueryOnPath) {
            return '';
        }

        const pathname = url.split('?')[0] ?? url;

        if (pathname !== preserveQueryOnPath && !pathname.startsWith(`${preserveQueryOnPath}/`)) {
            return '';
        }

        const query = url.includes('?') ? url.split('?')[1] : '';

        return new URLSearchParams(query).get('search') ?? '';
    }, [preserveQueryOnPath, url]);
}

function SidebarNavItem({
    item,
    onNavigate,
    pendingBookings,
}: {
    item: DashboardNavItem;
    onNavigate: () => void;
    pendingBookings: number;
}) {
    const active = useNavActive(item);
    const badgeCount = item.badgeKey === 'pending_bookings' ? pendingBookings : 0;
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
                'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                active
                    ? 'bg-gradient-to-r from-gold-500/25 via-gold-500/10 to-transparent text-gold-200 shadow-[inset_0_0_0_1px_rgba(255,184,32,0.2)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
            )}
        >
            {active && (
                <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-gradient-to-b from-gold-300 to-gold-600 shadow-[0_0_12px_rgba(255,184,32,0.45)]" />
            )}
            <span
                className={cn(
                    'flex h-5 w-5 items-center justify-center',
                    active ? 'text-gold-400' : 'text-slate-500 group-hover:text-gold-400',
                )}
            >
                <Icon className="h-4 w-4" />
            </span>
            <span className="flex-1 text-left">{item.label}</span>
            {badgeCount > 0 && (
                <span
                    className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                        active ? 'bg-gold-500/30 text-gold-200' : 'bg-gold-500 text-ink-900',
                    )}
                >
                    {badgeCount}
                </span>
            )}
        </Link>
    );
}

export function DashboardShell({
    portalLabel,
    nav,
    user,
    logoutUrl,
    title,
    subtitle,
    actions,
    pendingBookings = 0,
    unreadNotifications = 0,
    showAdminNotifications = false,
    globalSearch,
    children,
}: DashboardShellProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const globalSearchValue = useGlobalSearchValue(globalSearch?.preserveQueryOnPath);
    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleLogout = (): void => {
        router.post(logoutUrl);
    };

    return (
        <div className="min-h-screen bg-carbon text-white">
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/5 bg-ink-900 transition-transform lg:translate-x-0',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="flex h-full flex-col">
                    <div className="border-b border-white/5 px-5 py-5">
                        <Link href={nav[0]?.href ?? '/'} onClick={() => setMobileOpen(false)}>
                            <CompactLogo />
                        </Link>
                    </div>
                    <div className="px-3 pt-4">
                        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            {portalLabel}
                        </div>
                    </div>
                    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
                        {nav.map((item) => (
                            <SidebarNavItem
                                key={item.label}
                                item={item}
                                pendingBookings={pendingBookings}
                                onNavigate={() => setMobileOpen(false)}
                            />
                        ))}
                    </nav>
                    <div className="border-t border-white/5 p-3">
                        <div className="flex items-center gap-3 rounded-xl p-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-sm font-bold text-ink-900 shadow-md shadow-black/30">
                                {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-bold text-white">{user.name}</div>
                                <div className="truncate text-[11px] text-slate-500">{user.email}</div>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                title="Sign out"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-rose-400"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 border-b border-white/5 bg-ink-900/80 backdrop-blur-md">
                    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                className="ml-btn-icon lg:hidden"
                                onClick={() => setMobileOpen((value) => !value)}
                                aria-label="Toggle menu"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <div className="min-w-0">
                                <h1 className="truncate text-lg font-black uppercase tracking-tight text-white sm:text-xl">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="hidden truncate text-xs text-slate-400 sm:block">{subtitle}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            {globalSearch ? (
                                <Form
                                    action={globalSearch.href}
                                    method="get"
                                    className="relative hidden md:block"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        const formData = new FormData(event.currentTarget);
                                        const search = String(formData.get('search') ?? '').trim();

                                        if (search === '') {
                                            return;
                                        }

                                        router.get(globalSearch.href, { search });
                                    }}
                                >
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="search"
                                        name="search"
                                        key={globalSearchValue}
                                        defaultValue={globalSearchValue}
                                        placeholder={globalSearch.placeholder ?? 'Search VIN, customer, booking…'}
                                        className="w-56 rounded-lg border border-white/10 bg-ink-800 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-gold-500 focus:bg-ink-700 focus:outline-none focus:ring-2 focus:ring-gold-500/30 xl:w-72"
                                    />
                                </Form>
                            ) : null}
                            {showAdminNotifications ? (
                                <AdminNotificationBell initialUnreadCount={unreadNotifications} />
                            ) : null}
                            {actions}
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
