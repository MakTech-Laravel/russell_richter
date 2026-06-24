import { Head, Link, router } from '@inertiajs/react';
import { Filter } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardTable,
    StatusPill,
    dashboardSelectClass,
    dashboardTableHeadClass,
    dashboardTableRowClass,
} from '@/components/dashboard/dashboard-ui';
import AdminLayout from '@/layouts/admin-layout';

interface BookingRow {
    id: number;
    customer: string | null;
    customer_email: string | null;
    vehicle: string | null;
    service: string | null;
    technician: string | null;
    status: string;
    status_label: string;
    work_status_label: string;
    work_progress_step: number;
    work_is_done: boolean;
    payment_status: string;
    payment_status_label: string;
    scheduled_at: string;
    total_price: string | number | null;
    route_order: number | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedBookings {
    data: BookingRow[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface StatusOption {
    value: string;
    label: string;
}

interface IndexProps {
    bookings: PaginatedBookings;
    filters: { status: string };
    statuses: StatusOption[];
    technicians: Array<{ id: number; name: string }>;
}

export default function Index({ bookings, filters, statuses }: IndexProps) {
    const applyStatusFilter = (status: string): void => {
        router.get(route('admin.bookings.index'), status ? { status } : {}, { preserveState: true });
    };

    return (
        <AdminLayout
            title="Bookings"
            subtitle={`${bookings.total} total booking(s)`}
            actions={
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gold-400" />
                    <select
                        value={filters.status}
                        onChange={(e) => applyStatusFilter(e.target.value)}
                        className={dashboardSelectClass()}
                    >
                        <option value="">All statuses</option>
                        {statuses.map((status) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                    </select>
                </div>
            }
        >
            <Head title="Bookings" />

            <DashboardCard>
                <DashboardCardHeader title="All Bookings" />
                <DashboardCardContent>
                    {bookings.data.length === 0 ? (
                        <p className="text-sm text-slate-400">No bookings found.</p>
                    ) : (
                        <DashboardTable>
                            <thead>
                                <tr className={dashboardTableHeadClass()}>
                                    <th className="pb-3 pr-4">ID</th>
                                    <th className="pb-3 pr-4">Customer</th>
                                    <th className="pb-3 pr-4">Vehicle</th>
                                    <th className="pb-3 pr-4">Service</th>
                                    <th className="pb-3 pr-4">Technician</th>
                                    <th className="pb-3 pr-4">Scheduled</th>
                                    <th className="pb-3 pr-4">Work Status</th>
                                    <th className="pb-3 pr-4">Payment</th>
                                    <th className="pb-3">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.data.map((booking) => (
                                    <tr key={booking.id} className={dashboardTableRowClass()}>
                                        <td className="py-3 pr-4">
                                            <Link href={route('admin.bookings.show', booking.id)} className="text-gold-400 hover:underline">
                                                #{booking.id}
                                            </Link>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div className="text-white">{booking.customer ?? '—'}</div>
                                            {booking.customer_email && (
                                                <div className="text-xs text-slate-500">{booking.customer_email}</div>
                                            )}
                                        </td>
                                        <td className="py-3 pr-4 text-slate-400">{booking.vehicle ?? '—'}</td>
                                        <td className="py-3 pr-4 text-slate-400">{booking.service ?? '—'}</td>
                                        <td className="py-3 pr-4 text-slate-400">{booking.technician ?? '—'}</td>
                                        <td className="py-3 pr-4 text-slate-400">{booking.scheduled_at}</td>
                                        <td className="py-3 pr-4">
                                            <div className="space-y-1">
                                                <StatusPill
                                                    status={booking.work_is_done ? 'completed' : booking.status}
                                                    label={booking.work_status_label}
                                                />
                                                {!booking.work_is_done && booking.status !== 'cancelled' && (
                                                    <div className="h-1 w-20 overflow-hidden rounded-full bg-white/5">
                                                        <div
                                                            className="h-full rounded-full bg-gold-400"
                                                            style={{
                                                                width: `${Math.max(12, (booking.work_progress_step / 4) * 100)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <StatusPill status={booking.payment_status} label={booking.payment_status_label} />
                                        </td>
                                        <td className="py-3 font-semibold text-gold-400">
                                            {booking.total_price != null ? `$${Number(booking.total_price).toFixed(2)}` : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </DashboardTable>
                    )}

                    {bookings.last_page > 1 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {bookings.links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        preserveScroll
                                        className={link.active ? 'ml-btn-primary px-3 py-1.5 text-xs' : 'ml-btn-outline px-3 py-1.5 text-xs'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="ml-btn-outline cursor-not-allowed px-3 py-1.5 text-xs opacity-40"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ),
                            )}
                        </div>
                    )}
                </DashboardCardContent>
            </DashboardCard>
        </AdminLayout>
    );
}
