import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Car } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address_line: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
}

interface Vehicle {
    id: number;
    display_name: string;
    vin: string;
    mileage: number | null;
}

interface Booking {
    id: number;
    service: string | null;
    vehicle: string | null;
    status: string;
    scheduled_at: string;
}

interface ShowProps {
    customer: Customer;
    vehicles: Vehicle[];
    bookings: Booking[];
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
    if (!value) {
        return null;
    }

    return (
        <div className="flex justify-between border-b border-gray-200 py-3 last:border-0">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

export default function Show({ customer, vehicles, bookings }: ShowProps) {
    const fullAddress = [customer.address_line, customer.city, customer.state, customer.zip].filter(Boolean).join(', ');

    return (
        <AdminLayout>
            <Head title={customer.name} />

            <div className="bg-white px-4 py-8 text-gray-900">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-6">
                        <Link href={route('admin.customers.index')} className="inline-flex items-center gap-1 text-sm text-ml-gold hover:underline">
                            <ArrowLeft className="size-4" /> Back to customers
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold">{customer.name}</h1>
                        <p className="text-gray-500">{customer.email}</p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                            <CardContent>
                                <DetailRow label="Email" value={customer.email} />
                                <DetailRow label="Phone" value={customer.phone} />
                                <DetailRow label="Address" value={fullAddress || null} />
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Car className="size-4 text-ml-gold" />
                                    Vehicles ({vehicles.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {vehicles.length === 0 ? (
                                    <p className="text-sm text-gray-400">No vehicles registered.</p>
                                ) : (
                                    vehicles.map((vehicle) => (
                                        <div key={vehicle.id} className="rounded-lg border border-gray-200 p-4">
                                            <p className="font-medium">{vehicle.display_name}</p>
                                            <p className="text-xs text-gray-400">VIN: {vehicle.vin}</p>
                                            {vehicle.mileage != null && (
                                                <p className="text-xs text-gray-400">{vehicle.mileage.toLocaleString()} mi</p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 bg-white text-gray-900 shadow-sm lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="size-4 text-ml-gold" />
                                    Bookings ({bookings.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {bookings.length === 0 ? (
                                    <p className="text-sm text-gray-400">No bookings yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {bookings.map((booking) => (
                                            <Link
                                                key={booking.id}
                                                href={route('admin.bookings.show', booking.id)}
                                                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-amber-200"
                                            >
                                                <div>
                                                    <p className="font-medium">{booking.service ?? 'Service'}</p>
                                                    <p className="text-sm text-gray-500">{booking.vehicle} · {booking.scheduled_at}</p>
                                                </div>
                                                <Badge className="border-amber-200 bg-amber-50 text-ml-gold">{booking.status}</Badge>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
