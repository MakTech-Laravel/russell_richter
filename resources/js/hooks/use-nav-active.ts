import { usePage } from '@inertiajs/react';

import type { DashboardNavItem } from '@/config/dashboard-nav';

export function isNavItemActive(item: DashboardNavItem, currentUrl: string): boolean {
    const patterns = item.match ?? [new URL(item.href, window.location.origin).pathname];

    return patterns.some((pattern) => {
        if (pattern.endsWith('*')) {
            return currentUrl.startsWith(pattern.slice(0, -1));
        }

        if (pattern === '/technician/jobs') {
            return currentUrl === pattern;
        }

        if (pattern === '/bookings' || pattern === '/admin/bookings') {
            return (
                currentUrl === pattern ||
                (currentUrl.startsWith(`${pattern}/`) && !currentUrl.includes('/create'))
            );
        }

        return currentUrl === pattern || currentUrl.startsWith(`${pattern}/`);
    });
}

export function useNavActive(item: DashboardNavItem): boolean {
    const { url } = usePage();

    return isNavItemActive(item, url);
}
