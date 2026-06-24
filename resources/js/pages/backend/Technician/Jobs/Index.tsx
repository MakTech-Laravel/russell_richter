import { Form, Head } from '@inertiajs/react';
import { CheckCircle, MapPin, Play, Wrench } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardEmptyState,
    StatusPill,
} from '@/components/dashboard/dashboard-ui';
import TechnicianLayout from '@/layouts/technician-layout';

interface Recommendation {
    part_type_label: string;
    part_name: string;
    specification: string | null;
}

interface Job {
    id: number;
    route_key: string;
    route_order: number | null;
    status: string;
    status_label: string;
    scheduled_at: string;
    customer: string | null;
    customer_phone: string | null;
    vehicle: string | null;
    service: string | null;
    address: string;
    customer_notes: string | null;
    recommendations: Recommendation[];
}

interface IndexProps {
    technician: { name: string; email: string };
    jobs: Job[];
}

export default function Index({ jobs }: IndexProps) {
    return (
        <TechnicianLayout
            title="My Jobs"
            subtitle={`${jobs.length} active job(s) assigned to you.`}
        >
            <Head title="My Jobs" />

            {jobs.length === 0 ? (
                <DashboardEmptyState
                    icon={CheckCircle}
                    title="All caught up!"
                    description="No active jobs assigned right now."
                />
            ) : (
                <div className="space-y-6">
                    {jobs.map((job, index) => (
                        <DashboardCard key={job.id}>
                            <DashboardCardHeader
                                title={
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-sm font-bold text-gold-300">
                                            {job.route_order ?? index + 1}
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-white">{job.service ?? 'Service'}</div>
                                            <p className="text-sm font-normal text-slate-400">
                                                {job.customer} · {job.vehicle}
                                            </p>
                                        </div>
                                    </div>
                                }
                                actions={<StatusPill status={job.status} label={job.status_label} />}
                            />
                            <DashboardCardContent className="space-y-4">
                                <div className="grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                                    <span>Scheduled: {job.scheduled_at}</span>
                                    {job.customer_phone && (
                                        <a href={`tel:${job.customer_phone}`} className="text-gold-400 hover:underline">
                                            {job.customer_phone}
                                        </a>
                                    )}
                                </div>

                                <p className="flex items-start gap-2 text-sm text-slate-300">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                                    {job.address}
                                </p>

                                {job.customer_notes && (
                                    <p className="rounded-xl border border-white/5 bg-ink-900/50 p-3 text-sm text-slate-400">
                                        <strong className="text-slate-300">Customer notes:</strong> {job.customer_notes}
                                    </p>
                                )}

                                {job.recommendations.length > 0 && (
                                    <div>
                                        <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-gold-400">
                                            <Wrench className="h-4 w-4" /> Recommended Parts
                                        </p>
                                        <div className="space-y-2">
                                            {job.recommendations.map((rec, recIndex) => (
                                                <div
                                                    key={recIndex}
                                                    className="rounded-lg border border-white/5 bg-ink-900/40 px-3 py-2 text-sm"
                                                >
                                                    <span className="font-medium text-white">{rec.part_name}</span>
                                                    <span className="text-slate-500"> · {rec.part_type_label}</span>
                                                    {rec.specification && (
                                                        <p className="text-xs text-slate-500">{rec.specification}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3 pt-2">
                                    <Form action={route('technician.jobs.update', job.route_key)} method="patch">
                                        <input type="hidden" name="status" value="in_progress" />
                                        <button type="submit" className="ml-btn-outline inline-flex">
                                            <Play className="h-4 w-4" /> Start Job
                                        </button>
                                    </Form>
                                    <Form action={route('technician.jobs.update', job.route_key)} method="patch">
                                        <input type="hidden" name="status" value="completed" />
                                        <button type="submit" className="ml-btn-primary inline-flex">
                                            <CheckCircle className="h-4 w-4" /> Complete Job
                                        </button>
                                    </Form>
                                </div>
                            </DashboardCardContent>
                        </DashboardCard>
                    ))}
                </div>
            )}
        </TechnicianLayout>
    );
}
