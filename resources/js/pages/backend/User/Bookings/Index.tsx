import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Plus } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardEmptyState,
    StatusPill,
} from '@/components/dashboard/dashboard-ui';
import { BookingWorkProgress } from '@/components/dashboard/booking-work-progress';
import UserLayout from '@/layouts/user-layout';
import { cn } from '@/lib/utils';

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
    filters: { status: string | null };
}

const STATUS_OPTIONS = [
    { value: null, label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
] as const;

function FilterChips({
    options,
    value,
    onChange,
}: {
    options: readonly { value: string | null; label: string }[];
    value: string | null;
    onChange: (v: string | null) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value ?? '__all__'}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition',
                        value === opt.value
                            ? 'bg-gold-500/20 text-gold-300 ring-gold-500/40'
                            : 'bg-white/5 text-slate-400 ring-white/10 hover:text-white hover:ring-white/20',
                    )}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

export default function Index({ bookings, filters }: IndexProps) {
    function applyFilter(status: string | null) {
        router.get(route('bookings.index'), status ? { status } : {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

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

            <div className="mb-4">
                <FilterChips options={STATUS_OPTIONS} value={filters.status} onChange={applyFilter} />
            </div>

            {bookings.length === 0 ? (
                <DashboardEmptyState
                    icon={Calendar}
                    title={filters.status ? `No ${filters.status.replace('_', ' ')} bookings` : 'No bookings yet'}
                    description={
                        filters.status
                            ? 'Try a different filter or book a new service.'
                            : 'Schedule your first mobile oil change today.'
                    }
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
