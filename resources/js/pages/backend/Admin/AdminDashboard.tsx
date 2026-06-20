import { Head, Link } from '@inertiajs/react';
import { Calendar, Car, CheckCircle, Clock, Users, Wrench } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    const statCards = [
        { label: 'Customers', value: stats.customers, icon: Users },
        { label: 'Vehicles', value: stats.vehicles, icon: Car },
        { label: 'Pending Bookings', value: stats.pending_bookings, icon: Clock },
        { label: "Today's Bookings", value: stats.today_bookings, icon: Calendar },
        { label: 'Completed', value: stats.completed_bookings, icon: CheckCircle },
        { label: 'Active Technicians', value: stats.technicians, icon: Wrench },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="bg-white px-4 py-8 text-gray-900">
                <div className="container mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-gray-500">Mobile Lube operations overview.</p>
                    </div>

                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {statCards.map((stat) => (
                            <Card key={stat.label} className="border-gray-200 bg-white text-gray-900 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm text-gray-600">
                                        <stat.icon className="size-4 text-ml-gold" />
                                        {stat.label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">{stat.value}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Bookings</CardTitle>
                            <Link href={route('admin.bookings.index')} className="text-sm text-ml-gold hover:underline">
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentBookings.length === 0 ? (
                                <p className="text-sm text-gray-400">No bookings yet.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-left text-gray-500">
                                                <th className="pb-3 pr-4 font-medium">Customer</th>
                                                <th className="pb-3 pr-4 font-medium">Vehicle</th>
                                                <th className="pb-3 pr-4 font-medium">Service</th>
                                                <th className="pb-3 pr-4 font-medium">Scheduled</th>
                                                <th className="pb-3 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentBookings.map((booking) => (
                                                <tr key={booking.id} className="border-b border-ml-gold/5 last:border-0">
                                                    <td className="py-3 pr-4">
                                                        <Link href={route('admin.bookings.show', booking.id)} className="text-ml-gold hover:underline">
                                                            {booking.customer ?? '—'}
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 pr-4 text-gray-600">{booking.vehicle ?? '—'}</td>
                                                    <td className="py-3 pr-4 text-gray-600">{booking.service ?? '—'}</td>
                                                    <td className="py-3 pr-4 text-gray-600">{booking.scheduled_at}</td>
                                                    <td className="py-3">
                                                        <Badge className="border-amber-200 bg-amber-50 text-ml-gold">{booking.status}</Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
