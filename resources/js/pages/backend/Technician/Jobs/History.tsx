import { Head, Link } from '@inertiajs/react';
import { Eye, History as HistoryIcon } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardEmptyState,
    DashboardTable,
    dashboardTableHeadClass,
    dashboardTableRowClass,
} from '@/components/dashboard/dashboard-ui';
import TechnicianLayout from '@/layouts/technician-layout';

interface HistoryItem {
    id: number;
    route_key: string;
    customer: string | null;
    vehicle: string | null;
    service: string | null;
    completed_at: string | null;
    scheduled_at: string;
}

interface HistoryProps {
    history: HistoryItem[];
}

export default function History({ history }: HistoryProps) {
    return (
        <TechnicianLayout
            title="Job History"
            subtitle={`${history.length} completed job(s) on your record.`}
        >
            <Head title="Job History" />

            {history.length === 0 ? (
                <DashboardEmptyState
                    icon={HistoryIcon}
                    title="No completed jobs yet"
                    description="Jobs you complete will appear here for future reference."
                />
            ) : (
                <DashboardCard>
                    <DashboardCardHeader title="Completed Jobs" />
                    <DashboardCardContent>
                        <DashboardTable>
                            <thead>
                                <tr className={dashboardTableHeadClass()}>
                                    <th className="pb-3 pr-4">Job</th>
                                    <th className="pb-3 pr-4">Customer</th>
                                    <th className="pb-3 pr-4">Vehicle</th>
                                    <th className="pb-3 pr-4">Service</th>
                                    <th className="pb-3 pr-4">Completed</th>
                                    <th className="pb-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id} className={dashboardTableRowClass()}>
                                        <td className="py-3 pr-4 font-medium text-gold-400">#{item.id}</td>
                                        <td className="py-3 pr-4 text-white">{item.customer ?? '—'}</td>
                                        <td className="py-3 pr-4 text-slate-400">{item.vehicle ?? '—'}</td>
                                        <td className="py-3 pr-4 text-slate-400">{item.service ?? '—'}</td>
                                        <td className="py-3 pr-4 text-slate-400">
                                            {item.completed_at ?? item.scheduled_at}
                                        </td>
                                        <td className="py-3 text-right">
                                            <Link
                                                href={route('technician.jobs.show', item.route_key)}
                                                className="ml-btn-outline inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </DashboardTable>
                    </DashboardCardContent>
                </DashboardCard>
            )}
        </TechnicianLayout>
    );
}
