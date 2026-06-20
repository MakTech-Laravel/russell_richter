import { Head, Link } from '@inertiajs/react';
import { Calendar, Car, CheckCircle, Clock, Users, Wrench } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardStat,
    DashboardTable,
    StatusPill,
    dashboardTableHeadClass,
    dashboardTableRowClass,
} from '@/components/dashboard/dashboard-ui';
import AdminLayout from '@/layouts/admin-layout';

interface Stats {
    customers: number;
    vehicles: number;
    pending_bookings: number;
    today_bookings: number;
    completed_bookings: number;
    technicians: number;
}

interface RecentBooking {
    id: number;
    customer: string | null;
    vehicle: string | null;
    service: string | null;
    status: string;
    scheduled_at: string;
}

interface AdminDashboardProps {
    stats: Stats;
    recentBookings: RecentBooking[];
}

export default function AdminDashboard({ stats, recentBookings }: AdminDashboardProps) {
    return (
        <AdminLayout title="Overview" subtitle="Mobile Lube operations overview.">
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <DashboardStat label="Customers" value={stats.customers} icon={Users} tone="gold" />
                    <DashboardStat label="Vehicles" value={stats.vehicles} icon={Car} tone="sky" />
                    <DashboardStat label="Pending" value={stats.pending_bookings} icon={Clock} tone="amber" />
                    <DashboardStat label="Today" value={stats.today_bookings} icon={Calendar} tone="violet" />
                    <DashboardStat label="Completed" value={stats.completed_bookings} icon={CheckCircle} tone="emerald" />
                    <DashboardStat label="Technicians" value={stats.technicians} icon={Wrench} tone="rose" />
                </div>

                <DashboardCard>
                    <DashboardCardHeader
                        title="Recent Bookings"
                        actions={
                            <Link href={route('admin.bookings.index')} className="text-sm text-gold-400 hover:underline">
                                View all
                            </Link>
                        }
                    />
                    <DashboardCardContent>
                        {recentBookings.length === 0 ? (
                            <p className="text-sm text-slate-400">No bookings yet.</p>
                        ) : (
                            <DashboardTable>
                                <thead>
                                    <tr className={dashboardTableHeadClass()}>
                                        <th className="pb-3 pr-4">Customer</th>
                                        <th className="pb-3 pr-4">Vehicle</th>
                                        <th className="pb-3 pr-4">Service</th>
                                        <th className="pb-3 pr-4">Scheduled</th>
                                        <th className="pb-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((booking) => (
                                        <tr key={booking.id} className={dashboardTableRowClass()}>
                                            <td className="py-3 pr-4">
                                                <Link
                                                    href={route('admin.bookings.show', booking.id)}
                                                    className="text-gold-400 hover:underline"
                                                >
                                                    {booking.customer ?? '—'}
                                                </Link>
                                            </td>
                                            <td className="py-3 pr-4 text-slate-400">{booking.vehicle ?? '—'}</td>
                                            <td className="py-3 pr-4 text-slate-400">{booking.service ?? '—'}</td>
                                            <td className="py-3 pr-4 text-slate-400">{booking.scheduled_at}</td>
                                            <td className="py-3">
                                                <StatusPill status={booking.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </DashboardTable>
                        )}
                    </DashboardCardContent>
                </DashboardCard>
            </div>
        </AdminLayout>
    );
}
