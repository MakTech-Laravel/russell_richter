import { Head, Link, router } from '@inertiajs/react';
import { Filter } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    const selectClass = 'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900';

    const applyStatusFilter = (status: string): void => {
        router.get(route('admin.bookings.index'), status ? { status } : {}, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Bookings" />

            <div className="bg-white px-4 py-8 text-gray-900">
                <div className="container mx-auto">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Bookings</h1>
                            <p className="text-gray-500">{bookings.total} total booking(s)</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="size-4 text-ml-gold" />
                            <select
                                value={filters.status}
                                onChange={(e) => applyStatusFilter(e.target.value)}
                                className={selectClass}
                            >
                                <option value="">All statuses</option>
                                {statuses.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader>
                            <CardTitle>All Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bookings.data.length === 0 ? (
                                <p className="text-sm text-gray-400">No bookings found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-left text-gray-500">
                                                <th className="pb-3 pr-4 font-medium">ID</th>
                                                <th className="pb-3 pr-4 font-medium">Customer</th>
                                                <th className="pb-3 pr-4 font-medium">Vehicle</th>
                                                <th className="pb-3 pr-4 font-medium">Service</th>
                                                <th className="pb-3 pr-4 font-medium">Technician</th>
                                                <th className="pb-3 pr-4 font-medium">Scheduled</th>
                                                <th className="pb-3 pr-4 font-medium">Status</th>
                                                <th className="pb-3 pr-4 font-medium">Payment</th>
                                                <th className="pb-3 font-medium">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.data.map((booking) => (
                                                <tr key={booking.id} className="border-b border-ml-gold/5 last:border-0">
                                                    <td className="py-3 pr-4">
                                                        <Link href={route('admin.bookings.show', booking.id)} className="text-ml-gold hover:underline">
                                                            #{booking.id}
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <div>{booking.customer ?? '—'}</div>
                                                        {booking.customer_email && (
                                                            <div className="text-xs text-gray-400">{booking.customer_email}</div>
                                                        )}
                                                    </td>
                                                    <td className="py-3 pr-4 text-gray-600">{booking.vehicle ?? '—'}</td>
                                                    <td className="py-3 pr-4 text-gray-600">{booking.service ?? '—'}</td>
                                                    <td className="py-3 pr-4 text-gray-600">{booking.technician ?? '—'}</td>
                                                    <td className="py-3 pr-4 text-gray-600">{booking.scheduled_at}</td>
                                                    <td className="py-3 pr-4">
                                                        <Badge className="border-amber-200 bg-amber-50 text-ml-gold">{booking.status_label}</Badge>
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <Badge
                                                            className={
                                                                booking.payment_status === 'paid'
                                                                    ? 'border-green-200 bg-green-50 text-green-700'
                                                                    : 'border-red-200 bg-red-50 text-red-700'
                                                            }
                                                        >
                                                            {booking.payment_status_label}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 text-ml-gold">
                                                        {booking.total_price != null ? `$${Number(booking.total_price).toFixed(2)}` : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {bookings.last_page > 1 && (
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {bookings.links.map((link, index) => (
                                        link.url ? (
                                            <Button
                                                key={index}
                                                asChild
                                                size="sm"
                                                variant={link.active ? 'default' : 'outline'}
                                                className={link.active ? 'ml-gold-gradient border-0 text-ml-black' : 'border-amber-200 text-gray-900 hover:bg-amber-50'}
                                            >
                                                <Link href={link.url} preserveScroll dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Button>
                                        ) : (
                                            <Button
                                                key={index}
                                                size="sm"
                                                variant="outline"
                                                disabled
                                                className="border-amber-200 text-gray-400"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
