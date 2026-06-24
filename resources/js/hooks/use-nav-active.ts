import { usePage } from '@inertiajs/react';

import type { DashboardNavItem } from '@/config/dashboard-nav';

function navPathname(url: string): string {
    return url.split('?')[0]?.split('#')[0] ?? url;
}

export function isNavItemActive(item: DashboardNavItem, currentUrl: string): boolean {
    const pathname = navPathname(currentUrl);
    const patterns = item.match ?? [new URL(item.href, window.location.origin).pathname];

    return patterns.some((pattern) => {
        if (pattern.endsWith('*')) {
            return pathname.startsWith(pattern.slice(0, -1));
        }

        if (pattern === '/technician/jobs') {
            return pathname === pattern;
        }

        if (pattern === '/bookings' || pattern === '/admin/bookings') {
            return (
                pathname === pattern ||
                (pathname.startsWith(`${pattern}/`) && !pathname.includes('/create'))
            );
        }

        return pathname === pattern || pathname.startsWith(`${pattern}/`);
    });
}

export function useNavActive(item: DashboardNavItem): boolean {
    const { url } = usePage();

    return isNavItemActive(item, url);
}
