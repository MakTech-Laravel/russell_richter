import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, History } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardEmptyState,
    dashboardSelectClass,
} from '@/components/dashboard/dashboard-ui';
import UserLayout from '@/layouts/user-layout';

interface HistoryItem {
    id: number;
    route_key: string;
    completed_at: string | null;
    scheduled_at: string;
    total_price: string | number | null;
    vehicle: string | null;
    service: string | null;
    technician: string | null;
    recommendations_count: number;
}

interface VehicleOption {
    id: number;
    display_name: string;
}

interface IndexProps {
    history: HistoryItem[];
    vehicles: VehicleOption[];
    filters: { vehicle_id: number | null };
}

export default function Index({ history, vehicles, filters }: IndexProps) {
    function applyVehicleFilter(vehicleId: string) {
        router.get(
            route('service-history.index'),
            vehicleId ? { vehicle_id: vehicleId } : {},
            { preserveState: true, preserveScroll: true },
        );
    }

    const showVehicleFilter = vehicles.length > 1;

    return (
        <UserLayout title="Service History" subtitle="View your completed mobile service appointments.">
            <Head title="Service History" />

            {showVehicleFilter && (
                <div className="mb-4 flex items-center gap-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Vehicle</label>
                    <select
                        value={filters.vehicle_id ?? ''}
                        onChange={(e) => applyVehicleFilter(e.target.value)}
                        className={dashboardSelectClass()}
                    >
                        <option value="">All Vehicles</option>
                        {vehicles.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.display_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {history.length === 0 ? (
                <DashboardEmptyState
                    icon={History}
                    title={filters.vehicle_id ? 'No completed services for this vehicle' : 'No completed services yet'}
                    description={
                        filters.vehicle_id
                            ? 'Try selecting a different vehicle or clearing the filter.'
                            : 'Your service history will appear here after your first appointment.'
                    }
                    action={
                        <Link href={route('bookings.create')} className="ml-btn-primary inline-flex">
                            Book Service
                        </Link>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <Link key={item.id} href={route('bookings.show', item.route_key)} className="block">
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
