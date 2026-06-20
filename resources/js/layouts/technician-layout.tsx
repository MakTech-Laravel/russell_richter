import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Toaster } from '@/components/ui/sonner';
import { technicianNav } from '@/config/dashboard-nav';
import { type SharedData } from '@/types';

interface TechnicianLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
}

export default function TechnicianLayout({
    children,
    title = 'My Jobs',
    subtitle,
    actions,
}: TechnicianLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const technician = auth.technician;

    if (!technician) {
        return null;
    }

    return (
        <>
            <DashboardShell
                portalLabel="Technician Portal"
                nav={technicianNav}
                user={{ name: technician.name, email: technician.email }}
                logoutUrl={route('technician.logout')}
                title={title}
                subtitle={subtitle}
                actions={actions}
            >
                {children}
            </DashboardShell>
            <Toaster position="top-right" richColors />
        </>
    );
}
