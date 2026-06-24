import { Head, Link } from '@inertiajs/react';
import { Calendar, Plus } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardEmptyState,
    StatusPill,
    dashboardRowLinkClass,
} from '@/components/dashboard/dashboard-ui';
import { BookingWorkProgress } from '@/components/dashboard/booking-work-progress';
import UserLayout from '@/layouts/user-layout';

interface Booking {
    id: number;
    route_key: string;
    status: string;
    status_label: string;
    work_status_label: string;
    work_progress_step: number;
    work_is_done: boolean;
    payment_status: string;
    payment_status_label: string;
    scheduled_at: string;
    total_price: string | number | null;
    vehicle: { id: number; display_name: string; vin: string } | null;
    service: { id: number; name: string } | null;
    technician: { id: number; name: string } | null;
}

interface IndexProps {
    bookings: Booking[];
}

export default function Index({ bookings }: IndexProps) {
    return (
        <UserLayout
            title="My Bookings"
            subtitle="View and manage your service appointments."
            actions={
                <Link href={route('bookings.create')} className="ml-btn-primary inline-flex">
                    <Plus className="h-4 w-4" /> Book Service
                </Link>
            }
        >
            <Head title="My Bookings" />

            {bookings.length === 0 ? (
                <DashboardEmptyState
                    icon={Calendar}
                    title="No bookings yet"
                    description="Schedule your first mobile oil change today."
                    action={
                        <Link href={route('bookings.create')} className="ml-btn-primary inline-flex">
                            Book Service
                        </Link>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <Link key={booking.id} href={route('bookings.show', booking.route_key)} className="block">
                            <DashboardCard className="transition hover:border-gold-500/20">
                                <DashboardCardHeader
                                    title={booking.service?.name ?? 'Service'}
                                    subtitle={booking.vehicle?.display_name}
                                    actions={
                                        <div className="flex flex-wrap items-center gap-2">
                                            <StatusPill status={booking.status} label={booking.status_label} />
                                            <StatusPill status={booking.payment_status} label={booking.payment_status_label} />
                                        </div>
                                    }
                                />
                                <DashboardCardContent className="space-y-4 pt-0">
                                    <BookingWorkProgress
                                        status={booking.status}
                                        workStatusLabel={booking.work_status_label}
                                        workProgressStep={booking.work_progress_step}
                                        workIsDone={booking.work_is_done}
                                        compact
                                    />
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                        <span>{booking.scheduled_at}</span>
                                        {booking.technician && <span>Technician: {booking.technician.name}</span>}
                                        {booking.total_price != null && (
                                            <span className="font-semibold text-gold-400">
                                                ${Number(booking.total_price).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </DashboardCardContent>
                            </DashboardCard>
                        </Link>
                    ))}
                </div>
            )}
        </UserLayout>
    );
}
