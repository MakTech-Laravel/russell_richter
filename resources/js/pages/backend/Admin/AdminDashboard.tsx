import { Head, Link } from '@inertiajs/react';
import { Calendar, Car, CheckCircle, Clock, CreditCard, Users, Wrench } from 'lucide-react';

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
    total_revenue: string | number;
}

interface RecentBooking {
    id: number;
    route_key: string;
    customer: string | null;
    vehicle: string | null;
    service: string | null;
    status: string;
    status_label: string;
    work_status_label: string;
    work_is_done: boolean;
    scheduled_at: string;
}

interface RecentTransaction {
    id: number;
    customer: string | null;
    service: string | null;
    amount: string | number;
    status: string;
    paid_at: string | null;
}

interface AdminDashboardProps {
    stats: Stats;
    recentBookings: RecentBooking[];
    recentTransactions: RecentTransaction[];
}

export default function AdminDashboard({ stats, recentBookings, recentTransactions }: AdminDashboardProps) {
    return (
        <AdminLayout title="Overview" subtitle="Mobile Lube operations overview.">
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                    <DashboardStat label="Customers" value={stats.customers} icon={Users} tone="gold" />
                    <DashboardStat label="Vehicles" value={stats.vehicles} icon={Car} tone="sky" />
                    <DashboardStat label="Pending" value={stats.pending_bookings} icon={Clock} tone="amber" />
                    <DashboardStat label="Today" value={stats.today_bookings} icon={Calendar} tone="violet" />
                    <DashboardStat label="Completed" value={stats.completed_bookings} icon={CheckCircle} tone="emerald" />
                    <DashboardStat label="Technicians" value={stats.technicians} icon={Wrench} tone="rose" />
                    <DashboardStat
                        label="Revenue"
                        value={`$${Number(stats.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                        icon={CreditCard}
                        tone="gold"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
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
                                            <th className="pb-3">Work Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentBookings.map((booking) => (
                                            <tr key={booking.id} className={dashboardTableRowClass()}>
                                                <td className="py-3 pr-4">
                                                    <Link
                                                        href={route('admin.bookings.show', booking.route_key)}
                                                        className="text-gold-400 hover:underline"
                                                    >
                                                        {booking.customer ?? '—'}
                                                    </Link>
                                                </td>
                                                <td className="py-3 pr-4 text-slate-400">{booking.vehicle ?? '—'}</td>
                                                <td className="py-3 pr-4 text-slate-400">{booking.service ?? '—'}</td>
                                                <td className="py-3 pr-4 text-slate-400">{booking.scheduled_at}</td>
                                                <td className="py-3">
                                                    <StatusPill
                                                        status={booking.work_is_done ? 'completed' : booking.status}
                                                        label={booking.work_status_label}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </DashboardTable>
                            )}
                        </DashboardCardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <DashboardCardHeader
                            title="Recent Transactions"
                            actions={
                                <Link href={route('admin.transactions.index')} className="text-sm text-gold-400 hover:underline">
                                    View all
                                </Link>
                            }
                        />
                        <DashboardCardContent>
                            {recentTransactions.length === 0 ? (
                                <p className="text-sm text-slate-400">No transactions yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentTransactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-ink-900/40 px-4 py-3">
                                            <div>
                                                <p className="font-medium text-white">{tx.customer ?? 'Customer'}</p>
                                                <p className="text-sm text-slate-400">{tx.service}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gold-300">${Number(tx.amount).toFixed(2)}</p>
                                                <StatusPill
                                                    status={tx.status === 'Succeeded' ? 'completed' : 'pending'}
                                                    label={tx.status}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </DashboardCardContent>
                    </DashboardCard>
                </div>
            </div>
        </AdminLayout>
    );
}
