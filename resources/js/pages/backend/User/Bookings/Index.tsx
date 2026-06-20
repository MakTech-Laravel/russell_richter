import { Head, Link } from '@inertiajs/react';
import { Calendar, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';

interface Booking {
    id: number;
    status: string;
    status_label: string;
    payment_status: string;
    payment_status_label: string;
    scheduled_at: string;
    total_price: string | number | null;
    vehicle: { id: number; display_name: string; vin: string } | null;
    service: { id: number; name: string } | null;
    technician: { id: number; name: string } | null;
}

interface IndexProps {
    bookings: Booking[];
}

export default function Index({ bookings }: IndexProps) {
    return (
        <UserLayout>
            <Head title="My Bookings" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                        <p className="text-gray-500">View and manage your service appointments.</p>
                    </div>
                    <Button asChild className="ml-gold-gradient border-0 font-bold text-ml-black">
                        <Link href={route('bookings.create')}>
                            <Plus className="size-4" /> Book Service
                        </Link>
                    </Button>
                </div>

                {bookings.length === 0 ? (
                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                            <Calendar className="size-12 text-ml-gold/40" />
                            <div>
                                <p className="text-lg font-medium">No bookings yet</p>
                                <p className="text-sm text-gray-400">Schedule your first mobile oil change today.</p>
                            </div>
                            <Button asChild className="ml-gold-gradient border-0 font-bold text-ml-black">
                                <Link href={route('bookings.create')}>Book Service</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <Link
                                key={booking.id}
                                href={route('bookings.show', booking.id)}
                                className="block"
                            >
                                <Card className="border-gray-200 bg-white text-gray-900 shadow-sm transition-colors hover:border-amber-200">
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div>
                                            <CardTitle className="text-lg">{booking.service?.name ?? 'Service'}</CardTitle>
                                            <p className="text-sm text-gray-500">{booking.vehicle?.display_name}</p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge className="border-amber-200 bg-amber-50 text-ml-gold">
                                                {booking.status_label}
                                            </Badge>
                                            <Badge
                                                className={
                                                    booking.payment_status === 'paid'
                                                        ? 'border-green-200 bg-green-50 text-green-700'
                                                        : 'border-red-200 bg-red-50 text-red-700'
                                                }
                                            >
                                                {booking.payment_status_label}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span>{booking.scheduled_at}</span>
                                        {booking.technician && <span>Technician: {booking.technician.name}</span>}
                                        {booking.total_price != null && (
                                            <span className="text-ml-gold">${Number(booking.total_price).toFixed(2)}</span>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
