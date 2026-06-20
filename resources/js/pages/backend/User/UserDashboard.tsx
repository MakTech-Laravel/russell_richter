import { Head, Link } from '@inertiajs/react';
import { Calendar, Car, CheckCircle, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';

interface DashboardProps {
    stats: {
        vehicles_count: number;
        upcoming_bookings: number;
        completed_services: number;
    };
    upcomingBookings: Array<{
        id: number;
        scheduled_at: string;
        status: string;
        vehicle: string | null;
        service: string | null;
    }>;
    vehicles: Array<{
        id: number;
        display_name: string;
        vin: string;
        mileage: number | null;
    }>;
}

export default function UserDashboard({ stats, upcomingBookings, vehicles }: DashboardProps) {
    return (
        <UserLayout>
            <Head title="Customer Dashboard" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
                        <p className="text-gray-500">Manage your vehicles, bookings, and service history.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild variant="outline" className="border-amber-200 text-gray-900 hover:bg-amber-50">
                            <Link href={route('vehicles.create')}><Plus className="size-4" /> Add Vehicle</Link>
                        </Button>
                        <Button asChild className="ml-gold-gradient border-0 font-bold text-ml-black">
                            <Link href={route('bookings.create')}><Calendar className="size-4" /> Book Service</Link>
                        </Button>
                    </div>
                </div>

                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm text-gray-600"><Car className="size-4 text-ml-gold" /> Vehicles</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{stats.vehicles_count}</p></CardContent>
                    </Card>
                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="size-4 text-ml-gold" /> Upcoming</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{stats.upcoming_bookings}</p></CardContent>
                    </Card>
                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="size-4 text-ml-gold" /> Completed</CardTitle></CardHeader>
                        <CardContent><p className="text-3xl font-bold">{stats.completed_services}</p></CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader><CardTitle>Upcoming Bookings</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingBookings.length === 0 ? (
                                <p className="text-sm text-gray-400">No upcoming bookings. <Link href={route('bookings.create')} className="text-ml-gold hover:underline">Book a service</Link></p>
                            ) : (
                                upcomingBookings.map((booking) => (
                                    <Link key={booking.id} href={route('bookings.show', booking.id)} className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-amber-200">
                                        <p className="font-medium">{booking.service}</p>
                                        <p className="text-sm text-gray-500">{booking.vehicle} · {booking.scheduled_at}</p>
                                        <p className="mt-1 text-xs text-ml-gold">{booking.status}</p>
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>My Vehicles</CardTitle>
                            <Link href={route('vehicles.index')} className="text-sm text-ml-gold hover:underline">View all</Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {vehicles.length === 0 ? (
                                <p className="text-sm text-gray-400">No vehicles yet. <Link href={route('vehicles.create')} className="text-ml-gold hover:underline">Add your first vehicle</Link></p>
                            ) : (
                                vehicles.map((vehicle) => (
                                    <Link key={vehicle.id} href={route('vehicles.show', vehicle.id)} className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-amber-200">
                                        <p className="font-medium">{vehicle.display_name}</p>
                                        <p className="text-sm text-gray-500">VIN: {vehicle.vin}</p>
                                        {vehicle.mileage && <p className="text-xs text-gray-400">{vehicle.mileage.toLocaleString()} miles</p>}
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </UserLayout>
    );
}
