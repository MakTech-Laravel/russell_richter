import { Form, Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Wrench } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    StatusPill,
    dashboardInputClass,
    dashboardLabelClass,
    dashboardSelectClass,
} from '@/components/dashboard/dashboard-ui';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

interface Recommendation {
    part_type_label: string;
    part_name: string;
    specification: string | null;
    quantity: number;
    estimated_price: string | number | null;
    notes: string | null;
}

interface Booking {
    id: number;
    status: string;
    status_label: string;
    payment_status: string;
    payment_status_label: string;
    paid_at: string | null;
    scheduled_at: string;
    completed_at: string | null;
    service_address: string;
    service_city: string;
    service_state: string;
    service_zip: string;
    latitude: number | null;
    longitude: number | null;
    total_price: string | number | null;
    customer_notes: string | null;
    technician_notes: string | null;
    route_order: number | null;
    customer: { id: number; name: string; email: string; phone: string | null } | null;
    vehicle: { id: number; display_name: string; vin: string; mileage: number | null } | null;
    service: { id: number; name: string } | null;
    technician: { id: number; name: string } | null;
    recommendations: Recommendation[];
}

interface StatusOption {
    value: string;
    label: string;
}

interface ShowProps {
    booking: Booking;
    technicians: Array<{ id: number; name: string }>;
    statuses: StatusOption[];
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

export default function Show({ booking, technicians, statuses }: ShowProps) {
    const fullAddress = `${booking.service_address}, ${booking.service_city}, ${booking.service_state} ${booking.service_zip}`;

    return (
        <AdminLayout
            title={`Booking #${booking.id}`}
            subtitle={`${booking.service?.name} · ${booking.customer?.name}`}
            actions={
                <div className="flex flex-wrap gap-2">
                    <StatusPill status={booking.status} label={booking.status_label} />
                    <StatusPill status={booking.payment_status} label={booking.payment_status_label} />
                </div>
            }
        >
            <Head title={`Booking #${booking.id}`} />

            <div className="mx-auto max-w-5xl space-y-4">
                <Link href={route('admin.bookings.index')} className="inline-flex items-center gap-1 text-sm text-gold-400 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to bookings
                </Link>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <DashboardCard>
                            <DashboardCardHeader title="Booking Details" />
                            <DashboardCardContent>
                                <DetailRow label="Scheduled" value={booking.scheduled_at} />
                                <DetailRow label="Paid At" value={booking.paid_at} />
                                <DetailRow label="Completed" value={booking.completed_at} />
                                <DetailRow label="Customer" value={booking.customer?.name} />
                                <DetailRow label="Email" value={booking.customer?.email} />
                                <DetailRow label="Phone" value={booking.customer?.phone} />
                                <DetailRow label="Vehicle" value={booking.vehicle?.display_name} />
                                <DetailRow label="VIN" value={booking.vehicle?.vin} />
                                <DetailRow label="Service" value={booking.service?.name} />
                                <DetailRow label="Address" value={fullAddress} />
                                <DetailRow label="Route Order" value={booking.route_order} />
                                <DetailRow label="Total" value={booking.total_price != null ? `$${Number(booking.total_price).toFixed(2)}` : null} />
                                <DetailRow label="Customer Notes" value={booking.customer_notes} />
                            </DashboardCardContent>
                        </DashboardCard>

                        <DashboardCard>
                            <DashboardCardHeader
                                title={
                                    <span className="flex items-center gap-2">
                                        <Wrench className="h-4 w-4 text-gold-400" />
                                        Part Recommendations
                                    </span>
                                }
                            />
                            <DashboardCardContent>
                                {booking.recommendations.length === 0 ? (
                                    <p className="text-sm text-slate-400">No recommendations generated.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {booking.recommendations.map((rec, index) => (
                                            <div key={index} className="rounded-xl border border-white/5 bg-ink-900/40 p-4">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className="font-medium text-white">{rec.part_name}</p>
                                                        <p className="text-xs text-gold-400">{rec.part_type_label}</p>
                                                    </div>
                                                    {rec.estimated_price != null && (
                                                        <span className="text-gold-400">${Number(rec.estimated_price).toFixed(2)}</span>
                                                    )}
                                                </div>
                                                {rec.specification && <p className="mt-1 text-sm text-slate-400">{rec.specification}</p>}
                                                <p className="mt-1 text-xs text-slate-500">Qty: {rec.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </DashboardCardContent>
                        </DashboardCard>
                    </div>

                    <DashboardCard className="lg:col-span-1">
                        <DashboardCardHeader title="Manage Booking" />
                        <DashboardCardContent>
                            <Form
                                action={route('admin.bookings.update', booking.id)}
                                method="patch"
                                className="space-y-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-2">
                                            <label htmlFor="status" className={dashboardLabelClass()}>Status</label>
                                            <select id="status" name="status" defaultValue={booking.status} required className={dashboardSelectClass()}>
                                                {statuses.map((status) => (
                                                    <option key={status.value} value={status.value}>{status.label}</option>
                                                ))}
                                            </select>
                                            <InputError message={errors.status} />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="technician_id" className={dashboardLabelClass()}>Assign Technician</label>
                                            <select
                                                id="technician_id"
                                                name="technician_id"
                                                defaultValue={booking.technician?.id ?? ''}
                                                className={dashboardSelectClass()}
                                            >
                                                <option value="">Unassigned</option>
                                                {technicians.map((tech) => (
                                                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                                                ))}
                                            </select>
                                            <InputError message={errors.technician_id} />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="technician_notes" className={dashboardLabelClass()}>Technician Notes</label>
                                            <Textarea
                                                id="technician_notes"
                                                name="technician_notes"
                                                rows={4}
                                                defaultValue={booking.technician_notes ?? ''}
                                                className={dashboardInputClass()}
                                            />
                                            <InputError message={errors.technician_notes} />
                                        </div>

                                        <button type="submit" disabled={processing} className="ml-btn-primary inline-flex w-full justify-center">
                                            {processing ? 'Updating...' : 'Update Booking'}
                                        </button>
                                    </>
                                )}
                            </Form>

                            {booking.customer && (
                                <button
                                    type="button"
                                    className="ml-btn-outline mt-4 inline-flex w-full justify-center"
                                    onClick={() => router.visit(route('admin.customers.show', booking.customer!.id))}
                                >
                                    View Customer
                                </button>
                            )}
                        </DashboardCardContent>
                    </DashboardCard>
                </div>
            </div>
        </AdminLayout>
    );
}
