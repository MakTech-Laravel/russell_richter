import { Form, Head, router } from '@inertiajs/react';
import { MapPin, Route, Zap } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    StatusPill,
    dashboardInputClass,
    dashboardLabelClass,
    dashboardSelectClass,
} from '@/components/dashboard/dashboard-ui';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';

interface Technician {
    id: number;
    name: string;
}

interface RouteStop {
    id: number;
    route_order: number | null;
    customer: string | null;
    vehicle: string | null;
    service: string | null;
    address: string;
    scheduled_at: string;
    status: string;
    latitude: number | null;
    longitude: number | null;
}

interface IndexProps {
    technicians: Technician[];
    selectedTechnicianId: number | null;
    date: string;
    routes: RouteStop[];
}

export default function Index({ technicians, selectedTechnicianId, date, routes }: IndexProps) {
    const applyFilters = (technicianId: string, selectedDate: string): void => {
        router.get(route('admin.routes.index'), {
            technician_id: technicianId || undefined,
            date: selectedDate,
        }, { preserveState: true });
    };

    return (
        <AdminLayout
            title="Route Planning"
            subtitle="View and optimize technician routes by date."
            actions={
                selectedTechnicianId ? (
                    <Form action={route('admin.routes.optimize')} method="post">
                        <input type="hidden" name="technician_id" value={selectedTechnicianId} />
                        <input type="hidden" name="date" value={date} />
                        <button type="submit" className="ml-btn-primary inline-flex">
                            <Zap className="h-4 w-4" /> Optimize Route
                        </button>
                    </Form>
                ) : undefined
            }
        >
            <Head title="Route Planning" />

            <div className="space-y-6">
                <DashboardCard>
                    <DashboardCardContent className="pt-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="technician_id" className={dashboardLabelClass()}>Technician</label>
                                <select
                                    id="technician_id"
                                    value={selectedTechnicianId ?? ''}
                                    onChange={(e) => applyFilters(e.target.value, date)}
                                    className={dashboardSelectClass()}
                                >
                                    {technicians.map((tech) => (
                                        <option key={tech.id} value={tech.id}>{tech.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="date" className={dashboardLabelClass()}>Date</label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => applyFilters(String(selectedTechnicianId ?? ''), e.target.value)}
                                    className={dashboardInputClass()}
                                />
                            </div>
                        </div>
                    </DashboardCardContent>
                </DashboardCard>

                <DashboardCard>
                    <DashboardCardHeader
                        title={
                            <span className="flex items-center gap-2">
                                <Route className="h-4 w-4 text-gold-400" />
                                Route Stops ({routes.length})
                            </span>
                        }
                    />
                    <DashboardCardContent>
                        {routes.length === 0 ? (
                            <p className="text-sm text-slate-400">No stops scheduled for this technician on the selected date.</p>
                        ) : (
                            <div className="space-y-4">
                                {routes.map((stop, index) => (
                                    <div key={stop.id} className="flex gap-4 rounded-xl border border-white/5 bg-ink-900/40 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-sm font-bold text-gold-400">
                                            {stop.route_order ?? index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-medium text-white">{stop.customer ?? 'Customer'}</p>
                                                    <p className="text-sm text-slate-400">{stop.service} · {stop.vehicle}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gold-400">{stop.scheduled_at}</span>
                                                    <StatusPill status={stop.status} />
                                                </div>
                                            </div>
                                            <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                                                <MapPin className="h-3 w-3" /> {stop.address}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </DashboardCardContent>
                </DashboardCard>
            </div>
        </AdminLayout>
    );
}
