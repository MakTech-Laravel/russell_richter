import { Head, Link } from '@inertiajs/react';
import { Calendar, Car, CheckCircle, Plus } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardEmptyState,
    DashboardStat,
    StatusPill,
    dashboardRowLinkClass,
} from '@/components/dashboard/dashboard-ui';
import UserLayout from '@/layouts/user-layout';

interface DashboardProps {
    stats: {
        vehicles_count: number;
        upcoming_bookings: number;
        completed_services: number;
    };
    upcomingBookings: Array<{
        id: number;
        scheduled_at: string;
        status: string;
        vehicle: string | null;
        service: string | null;
    }>;
    vehicles: Array<{
        id: number;
        display_name: string;
        vin: string;
        mileage: number | null;
    }>;
}

export default function UserDashboard({ stats, upcomingBookings, vehicles }: DashboardProps) {
    return (
        <UserLayout
            title="Dashboard"
            subtitle="Manage your vehicles, bookings, and service history."
            actions={
                <>
                    <Link href={route('vehicles.create')} className="ml-btn-outline hidden sm:inline-flex">
                        <Plus className="h-4 w-4" /> Add Vehicle
                    </Link>
                    <Link href={route('bookings.create')} className="ml-btn-primary inline-flex">
                        <Calendar className="h-4 w-4" /> Book Service
                    </Link>
                </>
            }
        >
            <Head title="Customer Dashboard" />

            <div className="space-y-8">
                <div className="grid gap-4 sm:grid-cols-3">
                    <DashboardStat label="Vehicles" value={stats.vehicles_count} icon={Car} tone="gold" />
                    <DashboardStat label="Upcoming" value={stats.upcoming_bookings} icon={Calendar} tone="sky" />
                    <DashboardStat label="Completed" value={stats.completed_services} icon={CheckCircle} tone="emerald" />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <DashboardCard>
                        <DashboardCardHeader title="Upcoming Bookings" />
                        <DashboardCardContent className="space-y-3">
                            {upcomingBookings.length === 0 ? (
                                <p className="text-sm text-slate-400">
                                    No upcoming bookings.{' '}
                                    <Link href={route('bookings.create')} className="text-gold-400 hover:underline">
                                        Book a service
                                    </Link>
                                </p>
                            ) : (
                                upcomingBookings.map((booking) => (
                                    <Link
                                        key={booking.id}
                                        href={route('bookings.show', booking.id)}
                                        className={dashboardRowLinkClass()}
                                    >
                                        <p className="font-semibold text-white">{booking.service}</p>
                                        <p className="text-sm text-slate-400">
                                            {booking.vehicle} · {booking.scheduled_at}
                                        </p>
                                        <div className="mt-2">
                                            <StatusPill status={booking.status} />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </DashboardCardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <DashboardCardHeader
                            title="My Vehicles"
                            actions={
                                <Link href={route('vehicles.index')} className="text-sm text-gold-400 hover:underline">
                                    View all
                                </Link>
                            }
                        />
                        <DashboardCardContent className="space-y-3">
                            {vehicles.length === 0 ? (
                                <p className="text-sm text-slate-400">
                                    No vehicles yet.{' '}
                                    <Link href={route('vehicles.create')} className="text-gold-400 hover:underline">
                                        Add your first vehicle
                                    </Link>
                                </p>
                            ) : (
                                vehicles.map((vehicle) => (
                                    <Link
                                        key={vehicle.id}
                                        href={route('vehicles.show', vehicle.id)}
                                        className={dashboardRowLinkClass()}
                                    >
                                        <p className="font-semibold text-white">{vehicle.display_name}</p>
                                        <p className="text-sm text-slate-400">VIN: {vehicle.vin}</p>
                                        {vehicle.mileage && (
                                            <p className="text-xs text-slate-500">{vehicle.mileage.toLocaleString()} miles</p>
                                        )}
                                    </Link>
                                ))
                            )}
                        </DashboardCardContent>
                    </DashboardCard>
                </div>
            </div>
        </UserLayout>
    );
}
