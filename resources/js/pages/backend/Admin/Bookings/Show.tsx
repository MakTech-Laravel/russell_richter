import { Form, Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, FlaskConical, Wrench } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    StatusPill,
    dashboardInputClass,
    dashboardLabelClass,
    dashboardSelectClass,
} from '@/components/dashboard/dashboard-ui';
import { BookingWorkProgress } from '@/components/dashboard/booking-work-progress';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

interface Recommendation {
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
    latitude: number | null;
    longitude: number | null;
    total_price: string | number | null;
    package_price: string | number | null;
    extra_quarts: number;
    extra_quarts_amount: string | number | null;
    extra_charge_amount: string | number | null;
    extra_charge_label: string | null;
    discount_percent: string | number | null;
    discount_amount: string | number | null;
    customer_notes: string | null;
    technician_notes: string | null;
    route_order: number | null;
    customer: { id: number; name: string; email: string; phone: string | null } | null;
    vehicle: { id: number; display_name: string; vin: string; mileage: number | null; oil_preference_notes: string | null } | null;
    service: {
        id: number;
        name: string;
        base_price?: string | number;
        included_quarts?: number | null;
        additional_quart_price?: string | number | null;
    } | null;
    technician: { id: number; name: string } | null;
    recommendations: Recommendation[];
}

interface ServiceOption {
    id: number;
    name: string;
    base_price: string | number;
    included_quarts: number | null;
    additional_quart_price: string | number | null;
}

interface StatusOption {
    value: string;
    label: string;
}

interface OilSpec {
    oil_grade: string;
    oil_capacity_quarts: number;
    oil_filter_part_no: string;
    oil_filter_brand: string | null;
    supports_synthetic: boolean;
}

interface ShowProps {
    booking: Booking;
    technicians: Array<{ id: number; name: string }>;
    statuses: StatusOption[];
    services: ServiceOption[];
    oilSpec: OilSpec | null;
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

export default function Show({ booking, technicians, statuses, oilSpec }: ShowProps) {
    const fullAddress = `${booking.service_address}, ${booking.service_city}, ${booking.service_state} ${booking.service_zip}`;
    const quartPrice = Number(booking.service?.additional_quart_price ?? 0);
    const includedQuarts = booking.service?.included_quarts ?? null;

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

                <BookingWorkProgress
                    status={booking.status}
                    workStatusLabel={booking.work_status_label}
                    workProgressStep={booking.work_progress_step}
                    workIsDone={booking.work_is_done}
                />

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
                                <DetailRow label="Package" value={booking.package_price != null ? `$${Number(booking.package_price).toFixed(2)}` : null} />
                                <DetailRow
                                    label="Extra Quarts"
                                    value={
                                        booking.extra_quarts > 0
                                            ? `${booking.extra_quarts} × $${quartPrice.toFixed(2)} = $${Number(booking.extra_quarts_amount ?? 0).toFixed(2)}`
                                            : 'None'
                                    }
                                />
                                <DetailRow
                                    label={booking.extra_charge_label || 'Extra Charge'}
                                    value={
                                        Number(booking.extra_charge_amount ?? 0) > 0
                                            ? `$${Number(booking.extra_charge_amount).toFixed(2)}`
                                            : 'None'
                                    }
                                />
                                <DetailRow
                                    label="Discount"
                                    value={
                                        Number(booking.discount_percent ?? 0) > 0
                                            ? `${Number(booking.discount_percent).toFixed(0)}% (−$${Number(booking.discount_amount ?? 0).toFixed(2)})`
                                            : 'None'
                                    }
                                />
                                <DetailRow label="Total" value={booking.total_price != null ? `$${Number(booking.total_price).toFixed(2)}` : null} />
                                <DetailRow label="Customer Notes" value={booking.customer_notes} />
                            </DashboardCardContent>
                        </DashboardCard>

                        <DashboardCard>
                            <DashboardCardHeader
                                title="Customer-Specific Pricing"
                                subtitle="Changes apply only to this booking — package catalog prices stay unchanged."
                            />
                            <DashboardCardContent>
                                <Form
                                    action={route('admin.bookings.pricing.update', booking.route_key)}
                                    method="patch"
                                    className="space-y-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            {includedQuarts != null && (
                                                <p className="text-xs text-slate-400">
                                                    Package includes {includedQuarts} quarts
                                                    {quartPrice > 0 ? ` · extra quarts $${quartPrice.toFixed(2)} each` : ''}.
                                                    {oilSpec ? ` Vehicle capacity: ${oilSpec.oil_capacity_quarts} quarts.` : ''}
                                                </p>
                                            )}

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label htmlFor="extra_quarts" className={dashboardLabelClass()}>Extra Quarts</label>
                                                    <input
                                                        id="extra_quarts"
                                                        name="extra_quarts"
                                                        type="number"
                                                        min={0}
                                                        max={50}
                                                        defaultValue={booking.extra_quarts}
                                                        className={dashboardInputClass()}
                                                    />
                                                    <InputError message={errors.extra_quarts} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="discount_percent" className={dashboardLabelClass()}>Discount %</label>
                                                    <input
                                                        id="discount_percent"
                                                        name="discount_percent"
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        step="0.01"
                                                        defaultValue={Number(booking.discount_percent ?? 0)}
                                                        className={dashboardInputClass()}
                                                    />
                                                    <InputError message={errors.discount_percent} />
                                                </div>
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label htmlFor="extra_charge_label" className={dashboardLabelClass()}>Extra Charge Label</label>
                                                    <input
                                                        id="extra_charge_label"
                                                        name="extra_charge_label"
                                                        type="text"
                                                        defaultValue={booking.extra_charge_label ?? ''}
                                                        placeholder="e.g. Cabin filter, after-hours fee"
                                                        className={dashboardInputClass()}
                                                    />
                                                    <InputError message={errors.extra_charge_label} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="extra_charge_amount" className={dashboardLabelClass()}>Extra Charge Amount</label>
                                                    <input
                                                        id="extra_charge_amount"
                                                        name="extra_charge_amount"
                                                        type="number"
                                                        min={0}
                                                        step="0.01"
                                                        defaultValue={Number(booking.extra_charge_amount ?? 0)}
                                                        className={dashboardInputClass()}
                                                    />
                                                    <InputError message={errors.extra_charge_amount} />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="scheduled_at" className={dashboardLabelClass()}>Scheduled At</label>
                                                <input
                                                    id="scheduled_at"
                                                    name="scheduled_at"
                                                    type="datetime-local"
                                                    defaultValue={booking.scheduled_at?.slice(0, 16)}
                                                    className={dashboardInputClass()}
                                                />
                                                <InputError message={errors.scheduled_at} />
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2 sm:col-span-2">
                                                    <label htmlFor="service_address" className={dashboardLabelClass()}>Address</label>
                                                    <input
                                                        id="service_address"
                                                        name="service_address"
                                                        type="text"
                                                        defaultValue={booking.service_address}
                                                        className={dashboardInputClass()}
                                                    />
                                                    <InputError message={errors.service_address} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="service_city" className={dashboardLabelClass()}>City</label>
                                                    <input id="service_city" name="service_city" type="text" defaultValue={booking.service_city} className={dashboardInputClass()} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="service_state" className={dashboardLabelClass()}>State</label>
                                                    <input id="service_state" name="service_state" type="text" maxLength={2} defaultValue={booking.service_state} className={dashboardInputClass()} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label htmlFor="service_zip" className={dashboardLabelClass()}>ZIP</label>
                                                    <input id="service_zip" name="service_zip" type="text" defaultValue={booking.service_zip} className={dashboardInputClass()} />
                                                </div>
                                            </div>

                                            <button type="submit" disabled={processing} className="ml-btn-primary inline-flex">
                                                {processing ? 'Saving...' : 'Save Customer Pricing'}
                                            </button>
                                        </>
                                    )}
                                </Form>
                            </DashboardCardContent>
                        </DashboardCard>

                        <DashboardCard>
                            <DashboardCardHeader
                                title={
                                    <span className="flex items-center gap-2">
                                        <FlaskConical className="h-4 w-4 text-gold-400" />
                                        Oil Service Specifications
                                    </span>
                                }
                                subtitle={oilSpec && booking.vehicle ? `OEM fitment data for ${booking.vehicle.display_name}` : undefined}
                            />
                            <DashboardCardContent>
                                {oilSpec ? (
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between border-b border-white/5 py-3">
                                            <span className="text-slate-400">🛢️ Oil Grade</span>
                                            <span className="rounded-md bg-gold-500/10 px-2 py-0.5 font-mono text-sm font-bold text-gold-300 ring-1 ring-gold-500/30">
                                                {oilSpec.oil_grade}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-white/5 py-3">
                                            <span className="text-slate-400">🛢️ Oil Capacity</span>
                                            <span className="font-semibold text-white">{oilSpec.oil_capacity_quarts} quarts</span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-white/5 py-3">
                                            <span className="text-slate-400">Oil Type</span>
                                            <span className={`text-sm font-semibold ${oilSpec.supports_synthetic ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                {oilSpec.supports_synthetic ? '✓ Full Synthetic' : 'Conventional'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-3">
                                            <span className="text-slate-400">🔩 Oil Filter (OEM)</span>
                                            <div className="text-right">
                                                <div className="inline-flex items-center gap-1.5 rounded-md border border-gold-500/30 bg-gold-500/10 px-2.5 py-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Part #</span>
                                                    <span className="font-mono text-sm font-bold tracking-wider text-gold-300">
                                                        {oilSpec.oil_filter_part_no}
                                                    </span>
                                                </div>
                                                {oilSpec.oil_filter_brand && (
                                                    <p className="mt-1 text-xs text-slate-500">{oilSpec.oil_filter_brand}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 py-4 text-slate-500">
                                        <FlaskConical className="h-5 w-5 shrink-0" />
                                        <p className="text-sm">No fitment data on file for this vehicle. Verify oil specs on-site.</p>
                                    </div>
                                )}

                                {booking.vehicle?.oil_preference_notes && (
                                    <div className="mt-4 rounded-xl border border-gold-500/20 bg-gold-500/5 p-4">
                                        <p className="text-xs font-bold uppercase tracking-wider text-gold-400">Customer Oil &amp; Filter Preferences</p>
                                        <p className="mt-2 text-sm text-slate-300">{booking.vehicle.oil_preference_notes}</p>
                                    </div>
                                )}
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
                                                {rec.part_number && (
                                                    <p className="mt-1.5 inline-flex rounded bg-white/5 px-2 py-0.5 font-mono text-xs text-gold-300">
                                                        Part #: {rec.part_number}
                                                    </p>
                                                )}
                                                {rec.specification && <p className="mt-1 text-sm text-slate-400">{rec.specification}</p>}
                                                <p className="mt-1 text-xs text-slate-500">Qty: {rec.quantity}</p>
                                                {rec.notes && <p className="mt-1 text-xs text-slate-500 italic">{rec.notes}</p>}
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
                                action={route('admin.bookings.update', booking.route_key)}
                                method="patch"
                                className="space-y-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-2">
                                            <label htmlFor="status" className={dashboardLabelClass()}>Work Status</label>
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
