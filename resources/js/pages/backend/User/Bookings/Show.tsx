import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Edit, Wrench } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    StatusPill,
} from '@/components/dashboard/dashboard-ui';
import { BookingWorkProgress } from '@/components/dashboard/booking-work-progress';
import UserLayout from '@/layouts/user-layout';

interface Recommendation {
    id: number;
    part_type: string;
    part_type_label: string;
    part_name: string;
    specification: string | null;
    quantity: number;
    estimated_price: string | number | null;
    notes: string | null;
}

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
    paid_at: string | null;
    scheduled_at: string;
    completed_at: string | null;
    service_address: string;
    service_city: string;
    service_state: string;
    service_zip: string;
    mileage_at_service: number | null;
    total_price: string | number | null;
    customer_notes: string | null;
    technician_notes: string | null;
    vehicle: { id: number; display_name: string; vin: string } | null;
    service: { id: number; name: string } | null;
    technician: { id: number; name: string } | null;
    recommendations: Recommendation[];
}

interface ShowProps {
    booking: Booking;
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
    if (value == null || value === '') {
        return null;
    }

    return (
        <div className="flex justify-between border-b border-white/5 py-3 last:border-0">
            <span className="text-slate-400">{label}</span>
            <span className="text-right font-medium text-white">{value}</span>
        </div>
    );
}

export default function Show({ booking }: ShowProps) {
    const canEdit = !['completed', 'cancelled'].includes(booking.status);
    const isUnpaid = booking.payment_status === 'unpaid';
    const fullAddress = `${booking.service_address}, ${booking.service_city}, ${booking.service_state} ${booking.service_zip}`;

    return (
        <UserLayout
            title={booking.service?.name ?? 'Booking'}
            subtitle={`Booking #${booking.id}`}
            actions={
                <div className="flex flex-wrap items-center gap-3">
                    <StatusPill status={booking.status} label={booking.status_label} />
                    <StatusPill status={booking.payment_status} label={booking.payment_status_label} />
                    {isUnpaid && (
                        <Form action={route('bookings.payment.checkout', booking.route_key)} method="post">
                            {({ processing }) => (
                                <button type="submit" disabled={processing} className="ml-btn-primary inline-flex">
                                    <CreditCard className="h-4 w-4" />
                                    {processing ? 'Redirecting...' : 'Pay Now'}
                                </button>
                            )}
                        </Form>
                    )}
                    {canEdit && (
                        <Link href={route('bookings.edit', booking.route_key)} className="ml-btn-outline inline-flex text-sm">
                            <Edit className="h-4 w-4" /> Edit
                        </Link>
                    )}
                </div>
            }
        >
            <Head title={`Booking #${booking.id}`} />

            <div className="mx-auto max-w-3xl space-y-4">
                <Link href={route('bookings.index')} className="inline-flex items-center gap-1 text-sm text-gold-400 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to bookings
                </Link>

                <BookingWorkProgress
                    status={booking.status}
                    workStatusLabel={booking.work_status_label}
                    workProgressStep={booking.work_progress_step}
                    workIsDone={booking.work_is_done}
                />

                <div className="grid gap-6 lg:grid-cols-2">
                    <DashboardCard>
                        <DashboardCardHeader title="Appointment Details" />
                        <DashboardCardContent>
                            <DetailRow label="Scheduled" value={booking.scheduled_at} />
                            <DetailRow label="Paid At" value={booking.paid_at} />
                            <DetailRow label="Completed" value={booking.completed_at} />
                            <DetailRow label="Vehicle" value={booking.vehicle?.display_name} />
                            <DetailRow label="Technician" value={booking.technician?.name} />
                            <DetailRow label="Mileage" value={booking.mileage_at_service != null ? `${booking.mileage_at_service.toLocaleString()} mi` : null} />
                            <DetailRow label="Total" value={booking.total_price != null ? `$${Number(booking.total_price).toFixed(2)}` : null} />
                            <DetailRow label="Address" value={fullAddress} />
                            <DetailRow label="Your Notes" value={booking.customer_notes} />
                            <DetailRow label="Technician Notes" value={booking.technician_notes} />
                        </DashboardCardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <DashboardCardHeader
                            title={
                                <span className="flex items-center gap-2">
                                    <Wrench className="h-4 w-4 text-gold-400" />
                                    Recommended Parts
                                </span>
                            }
                        />
                        <DashboardCardContent>
                            {booking.recommendations.length === 0 ? (
                                <p className="text-sm text-slate-400">No recommendations yet. Parts will be suggested based on your vehicle.</p>
                            ) : (
                                <div className="space-y-4">
                                    {booking.recommendations.map((rec) => (
                                        <div key={rec.id} className="rounded-xl border border-white/5 bg-ink-900/40 p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-medium text-white">{rec.part_name}</p>
                                                    <p className="text-xs text-gold-400">{rec.part_type_label}</p>
                                                </div>
                                                {rec.estimated_price != null && (
                                                    <span className="text-sm font-medium text-gold-400">
                                                        ${Number(rec.estimated_price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            {rec.specification && (
                                                <p className="mt-1 text-sm text-slate-400">{rec.specification}</p>
                                            )}
                                            <p className="mt-1 text-xs text-slate-500">Qty: {rec.quantity}</p>
                                            {rec.notes && <p className="mt-2 text-xs text-slate-500">{rec.notes}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </DashboardCardContent>
                    </DashboardCard>
                </div>
            </div>
        </UserLayout>
    );
}
