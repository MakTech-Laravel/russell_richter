import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Phone, Wrench } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    StatusPill,
} from '@/components/dashboard/dashboard-ui';
import TechnicianLayout from '@/layouts/technician-layout';

interface Recommendation {
    part_type_label: string;
    part_name: string;
    specification: string | null;
    quantity: number;
    estimated_price: string | number | null;
}

interface Job {
    id: number;
    status: string;
    status_label: string;
    scheduled_at: string;
    completed_at: string | null;
    customer: string | null;
    customer_email: string | null;
    customer_phone: string | null;
    vehicle: string | null;
    vehicle_vin: string | null;
    service: string | null;
    address: string;
    service_address: string;
    service_city: string;
    service_state: string;
    service_zip: string;
    customer_notes: string | null;
    technician_notes: string | null;
    mileage_at_service: number | null;
    total_price: string | number | null;
    recommendations: Recommendation[];
}

interface ShowProps {
    job: Job;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
            <dt className="w-40 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</dt>
            <dd className="text-sm text-slate-300">{value}</dd>
        </div>
    );
}

export default function Show({ job }: ShowProps) {
    return (
        <TechnicianLayout
            title={`Job #${job.id}`}
            subtitle={`${job.service ?? 'Service'} · ${job.customer ?? 'Customer'}`}
        >
            <Head title={`Job #${job.id}`} />

            <div className="mx-auto max-w-3xl space-y-4">
                <Link
                    href={route('technician.jobs.history')}
                    className="inline-flex items-center gap-1 text-sm text-gold-400 hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to job history
                </Link>

                <DashboardCard>
                    <DashboardCardHeader
                        title={job.service ?? 'Service Details'}
                        subtitle={job.vehicle ?? undefined}
                        actions={<StatusPill status={job.status} label={job.status_label} />}
                    />
                    <DashboardCardContent className="space-y-6">
                        <dl className="space-y-4">
                            <DetailRow label="Customer" value={job.customer ?? '—'} />
                            {job.customer_phone && (
                                <DetailRow
                                    label="Phone"
                                    value={
                                        <a href={`tel:${job.customer_phone}`} className="inline-flex items-center gap-1.5 text-gold-400 hover:underline">
                                            <Phone className="h-3.5 w-3.5" />
                                            {job.customer_phone}
                                        </a>
                                    }
                                />
                            )}
                            {job.customer_email && <DetailRow label="Email" value={job.customer_email} />}
                            {job.vehicle_vin && <DetailRow label="VIN" value={job.vehicle_vin} />}
                            <DetailRow label="Scheduled" value={job.scheduled_at} />
                            <DetailRow label="Completed" value={job.completed_at ?? '—'} />
                            {job.mileage_at_service != null && (
                                <DetailRow label="Mileage" value={`${job.mileage_at_service.toLocaleString()} mi`} />
                            )}
                            {job.total_price != null && (
                                <DetailRow label="Total" value={`$${Number(job.total_price).toFixed(2)}`} />
                            )}
                        </dl>

                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Service Location</p>
                            <p className="flex items-start gap-2 text-sm text-slate-300">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                                {job.address}
                            </p>
                        </div>

                        {job.customer_notes && (
                            <div className="rounded-xl border border-white/5 bg-ink-900/50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer Notes</p>
                                <p className="mt-2 text-sm text-slate-300">{job.customer_notes}</p>
                            </div>
                        )}

                        {job.technician_notes && (
                            <div className="rounded-xl border border-white/5 bg-ink-900/50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Technician Notes</p>
                                <p className="mt-2 text-sm text-slate-300">{job.technician_notes}</p>
                            </div>
                        )}

                        {job.recommendations.length > 0 && (
                            <div>
                                <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-gold-400">
                                    <Wrench className="h-4 w-4" /> Recommended Parts
                                </p>
                                <div className="space-y-2">
                                    {job.recommendations.map((rec, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border border-white/5 bg-ink-900/40 px-4 py-3 text-sm"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <span className="font-medium text-white">{rec.part_name}</span>
                                                {rec.estimated_price != null && (
                                                    <span className="text-gold-400">
                                                        ${Number(rec.estimated_price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500">
                                                {rec.part_type_label}
                                                {rec.quantity > 1 ? ` · Qty ${rec.quantity}` : ''}
                                            </p>
                                            {rec.specification && (
                                                <p className="mt-1 text-xs text-slate-500">{rec.specification}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </DashboardCardContent>
                </DashboardCard>
            </div>
        </TechnicianLayout>
    );
}
