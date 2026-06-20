import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, CreditCard } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';

interface Recommendation {
    id: number;
    part_type: string;
    part_type_label: string;
    part_name: string;
    specification: string | null;
    quantity: number;
    estimated_price: string | number | null;
    notes: string | null;
}

interface Booking {
    id: number;
    status: string;
    status_label: string;
    payment_status: string;
    payment_status_label: string;
    paid_at: string | null;
    scheduled_at: string;
    completed_at: string | null;
    service_address: string;
    service_city: string;
    service_state: string;
    service_zip: string;
    mileage_at_service: number | null;
    total_price: string | number | null;
    customer_notes: string | null;
    technician_notes: string | null;
    vehicle: { id: number; display_name: string; vin: string } | null;
    service: { id: number; name: string } | null;
    technician: { id: number; name: string } | null;
    recommendations: Recommendation[];
}

interface ShowProps {
    booking: Booking;
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
    if (value == null || value === '') {
        return null;
    }

    return (
        <div className="flex justify-between border-b border-gray-200 py-3 last:border-0">
            <span className="text-gray-500">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
}

export default function Show({ booking }: ShowProps) {
    const canEdit = !['completed', 'cancelled'].includes(booking.status);
    const isUnpaid = booking.payment_status === 'unpaid';
    const fullAddress = `${booking.service_address}, ${booking.service_city}, ${booking.service_state} ${booking.service_zip}`;

    return (
        <UserLayout>
            <Head title={`Booking #${booking.id}`} />

            <div className="container mx-auto max-w-3xl px-4 py-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href={route('bookings.index')} className="inline-flex items-center gap-1 text-sm text-ml-gold hover:underline">
                            <ArrowLeft className="size-4" /> Back to bookings
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900">{booking.service?.name ?? 'Booking'}</h1>
                        <p className="text-gray-500">Booking #{booking.id}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge className="border-amber-200 bg-amber-50 text-ml-gold">{booking.status_label}</Badge>
                        <Badge
                            className={
                                booking.payment_status === 'paid'
                                    ? 'border-green-200 bg-green-50 text-green-700'
                                    : 'border-red-200 bg-red-50 text-red-700'
                            }
                        >
                            {booking.payment_status_label}
                        </Badge>
                        {isUnpaid && (
                            <Form action={route('bookings.payment.checkout', booking.id)} method="post">
                                {({ processing }) => (
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="ml-gold-gradient border-0 font-bold text-ml-black"
                                    >
                                        <CreditCard className="size-4" />
                                        {processing ? 'Redirecting...' : 'Pay Now'}
                                    </Button>
                                )}
                            </Form>
                        )}
                        {canEdit && (
                            <Button asChild variant="outline" size="sm" className="border-amber-200 text-gray-900 hover:bg-amber-50">
                                <Link href={route('bookings.edit', booking.id)}>
                                    <Edit className="size-4" /> Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader>
                            <CardTitle>Appointment Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DetailRow label="Scheduled" value={booking.scheduled_at} />
                            <DetailRow label="Paid At" value={booking.paid_at} />
                            <DetailRow label="Completed" value={booking.completed_at} />
                            <DetailRow label="Vehicle" value={booking.vehicle?.display_name} />
                            <DetailRow label="Technician" value={booking.technician?.name} />
                            <DetailRow label="Mileage" value={booking.mileage_at_service != null ? `${booking.mileage_at_service.toLocaleString()} mi` : null} />
                            <DetailRow label="Total" value={booking.total_price != null ? `$${Number(booking.total_price).toFixed(2)}` : null} />
                            <DetailRow label="Address" value={fullAddress} />
                            <DetailRow label="Your Notes" value={booking.customer_notes} />
                            <DetailRow label="Technician Notes" value={booking.technician_notes} />
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="size-4 text-ml-gold" />
                                Recommended Parts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {booking.recommendations.length === 0 ? (
                                <p className="text-sm text-gray-400">No recommendations yet. Parts will be suggested based on your vehicle.</p>
                            ) : (
                                <div className="space-y-4">
                                    {booking.recommendations.map((rec) => (
                                        <div key={rec.id} className="rounded-lg border border-gray-200 p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-medium">{rec.part_name}</p>
                                                    <p className="text-xs text-ml-gold">{rec.part_type_label}</p>
                                                </div>
                                                {rec.estimated_price != null && (
                                                    <span className="text-sm font-medium text-ml-gold">
                                                        ${Number(rec.estimated_price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            {rec.specification && (
                                                <p className="mt-1 text-sm text-gray-500">{rec.specification}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-400">Qty: {rec.quantity}</p>
                                            {rec.notes && <p className="mt-2 text-xs text-gray-400">{rec.notes}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </UserLayout>
    );
}
