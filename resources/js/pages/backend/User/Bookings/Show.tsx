import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Edit, FlaskConical, Wrench } from 'lucide-react';

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
    part_number: string | null;
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

const PART_TYPE_ICONS: Record<string, string> = {
    oil: '🛢️',
    oil_filter: '🔩',
    cabin_filter: '💨',
    wiper: '🌧️',
};

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
                            {booking.vehicle?.vin && (
                                <div className="flex justify-between border-b border-white/5 py-3 last:border-0">
                                    <span className="text-slate-400">VIN</span>
                                    <span className="font-mono text-xs tracking-widest text-slate-300">{booking.vehicle.vin}</span>
                                </div>
                            )}
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
                                    Oil &amp; Parts Recommendations
                                </span>
                            }
                            subtitle={booking.vehicle ? `Based on your ${booking.vehicle.display_name}` : undefined}
                        />
                        <DashboardCardContent>
                            {booking.recommendations.length === 0 ? (
                                <div className="flex flex-col items-center gap-3 py-6 text-center">
                                    <FlaskConical className="h-8 w-8 text-slate-600" />
                                    <p className="text-sm text-slate-400">
                                        No recommendations yet. Parts will be suggested based on your vehicle's VIN once the booking is confirmed.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {booking.recommendations.map((rec) => (
                                        <div key={rec.id} className="rounded-xl border border-white/5 bg-ink-900/40 p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-base">
                                                            {PART_TYPE_ICONS[rec.part_type] ?? '🔧'}
                                                        </span>
                                                        <p className="font-semibold text-white">{rec.part_name}</p>
                                                    </div>
                                                    <p className="mt-0.5 text-xs font-medium text-gold-400">{rec.part_type_label}</p>

                                                    {rec.part_number && (
                                                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-gold-500/30 bg-gold-500/10 px-2 py-1">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Part #</span>
                                                            <span className="font-mono text-xs font-bold tracking-wider text-gold-300">
                                                                {rec.part_number}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {rec.specification && (
                                                        <p className="mt-2 text-sm text-slate-300">
                                                            <span className="text-slate-500">Spec: </span>{rec.specification}
                                                        </p>
                                                    )}

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {rec.part_type === 'oil'
                                                            ? `${parseFloat(String(rec.quantity))} qt`
                                                            : `Qty: ${parseFloat(String(rec.quantity))}`}
                                                    </p>

                                                    {rec.notes && (
                                                        <p className="mt-1.5 text-xs italic text-slate-500">{rec.notes}</p>
                                                    )}
                                                </div>
                                                {rec.estimated_price != null && (
                                                    <span className="shrink-0 text-sm font-bold text-gold-400">
                                                        ${Number(rec.estimated_price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <p className="pt-1 text-center text-[11px] text-slate-600">
                                        Recommendations generated from your vehicle's VIN &amp; fitment data
                                    </p>
                                </div>
                            )}
                        </DashboardCardContent>
                    </DashboardCard>
                </div>
            </div>
        </UserLayout>
    );
}
