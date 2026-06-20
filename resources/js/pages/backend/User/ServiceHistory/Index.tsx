import { Head, Link } from '@inertiajs/react';
import { CheckCircle, History } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardEmptyState,
} from '@/components/dashboard/dashboard-ui';
import UserLayout from '@/layouts/user-layout';

interface HistoryItem {
    id: number;
    completed_at: string | null;
    scheduled_at: string;
    total_price: string | number | null;
    vehicle: string | null;
    service: string | null;
    technician: string | null;
    recommendations_count: number;
}

interface IndexProps {
    history: HistoryItem[];
}

export default function Index({ history }: IndexProps) {
    return (
        <UserLayout title="Service History" subtitle="View your completed mobile service appointments.">
            <Head title="Service History" />

            {history.length === 0 ? (
                <DashboardEmptyState
                    icon={History}
                    title="No completed services yet"
                    description="Your service history will appear here after your first appointment."
                    action={
                        <Link href={route('bookings.create')} className="ml-btn-primary inline-flex">
                            Book Service
                        </Link>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <Link key={item.id} href={route('bookings.show', item.id)} className="block">
                            <DashboardCard className="transition hover:border-gold-500/20">
                                <DashboardCardHeader
                                    title={
                                        <span className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-gold-400" />
                                            {item.service ?? 'Service'}
                                        </span>
                                    }
                                    subtitle={item.vehicle}
                                    actions={
                                        item.total_price != null ? (
                                            <span className="text-lg font-bold text-gold-400">
                                                ${Number(item.total_price).toFixed(2)}
                                            </span>
                                        ) : undefined
                                    }
                                />
                                <DashboardCardContent className="flex flex-wrap gap-4 pt-0 text-sm text-slate-400">
                                    <span>Completed: {item.completed_at ?? item.scheduled_at}</span>
                                    {item.technician && <span>Technician: {item.technician}</span>}
                                    {item.recommendations_count > 0 && (
                                        <span>{item.recommendations_count} part recommendation(s)</span>
                                    )}
                                </DashboardCardContent>
                            </DashboardCard>
                        </Link>
                    ))}
                </div>
            )}
        </UserLayout>
    );
}
