import { usePage } from '@inertiajs/react';
import * as React from 'react';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Toaster } from '@/components/ui/sonner';
import { adminNav } from '@/config/dashboard-nav';
import { type SharedData } from '@/types';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export default function AdminLayout({
    children,
    title = 'Overview',
    subtitle,
    actions,
}: AdminLayoutProps) {
    const { auth, portal } = usePage<SharedData>().props;
    const admin = auth.admin;

    if (!admin) {
        return null;
    }

    return (
        <>
            <DashboardShell
                portalLabel="Admin Portal"
                nav={adminNav}
                user={{ name: admin.name, email: admin.email }}
                logoutUrl={route('admin.logout')}
                title={title}
                subtitle={subtitle}
                actions={actions}
                pendingBookings={portal?.pending_bookings ?? 0}
                unreadNotifications={portal?.unread_notifications ?? 0}
                showAdminNotifications
                globalSearch={{
                    href: route('admin.vehicles.index'),
                    placeholder: 'Search VIN, make, model…',
                    preserveQueryOnPath: '/admin/vehicles',
                }}
            >
                {children}
            </DashboardShell>
            <Toaster position="top-right" richColors />
        </>
    );
}
