import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UserLayout from '@/layouts/user-layout';

interface Booking {
    id: number;
    status: string;
    status_label: string;
    scheduled_at: string;
    service_address: string;
    service_city: string;
    service_state: string;
    service_zip: string;
    mileage_at_service: number | null;
    customer_notes: string | null;
    vehicle: { id: number; display_name: string; vin: string } | null;
    service: { id: number; name: string } | null;
}

interface EditProps {
    booking: Booking;
}

export default function Edit({ booking }: EditProps) {
    const inputClass = 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400';
    const scheduledLocal = booking.scheduled_at.replace(' ', 'T').slice(0, 16);

    return (
        <UserLayout>
            <Head title={`Edit Booking #${booking.id}`} />

            <div className="container mx-auto max-w-2xl px-4 py-8">
                <div className="mb-6">
                    <Link href={route('bookings.show', booking.id)} className="inline-flex items-center gap-1 text-sm text-ml-gold hover:underline">
                        <ArrowLeft className="size-4" /> Back to booking
                    </Link>
                    <h1 className="mt-2 text-3xl font-bold text-gray-900">Edit Booking</h1>
                    <p className="text-gray-500">
                        {booking.service?.name} · {booking.vehicle?.display_name} · {booking.status_label}
                    </p>
                </div>

                <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                    <CardHeader>
                        <CardTitle>Update Appointment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={route('bookings.update', booking.id)}
                            method="put"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="scheduled_at" className="text-gray-600">Date & Time</Label>
                                        <Input
                                            id="scheduled_at"
                                            name="scheduled_at"
                                            type="datetime-local"
                                            defaultValue={scheduledLocal}
                                            className={inputClass}
                                        />
                                        <InputError message={errors.scheduled_at} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="service_address" className="text-gray-600">Service Address</Label>
                                        <Input
                                            id="service_address"
                                            name="service_address"
                                            defaultValue={booking.service_address}
                                            className={inputClass}
                                        />
                                        <InputError message={errors.service_address} />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="service_city" className="text-gray-600">City</Label>
                                            <Input id="service_city" name="service_city" defaultValue={booking.service_city} className={inputClass} />
                                            <InputError message={errors.service_city} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="service_state" className="text-gray-600">State</Label>
                                            <Input id="service_state" name="service_state" defaultValue={booking.service_state} maxLength={2} className={inputClass} />
                                            <InputError message={errors.service_state} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="service_zip" className="text-gray-600">ZIP</Label>
                                            <Input id="service_zip" name="service_zip" defaultValue={booking.service_zip} className={inputClass} />
                                            <InputError message={errors.service_zip} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mileage_at_service" className="text-gray-600">Mileage</Label>
                                        <Input
                                            id="mileage_at_service"
                                            name="mileage_at_service"
                                            type="number"
                                            defaultValue={booking.mileage_at_service ?? ''}
                                            className={inputClass}
                                        />
                                        <InputError message={errors.mileage_at_service} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="customer_notes" className="text-gray-600">Notes</Label>
                                        <Textarea
                                            id="customer_notes"
                                            name="customer_notes"
                                            rows={3}
                                            defaultValue={booking.customer_notes ?? ''}
                                            className={inputClass}
                                        />
                                        <InputError message={errors.customer_notes} />
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <Button type="submit" disabled={processing} className="ml-gold-gradient border-0 font-bold text-ml-black">
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button asChild type="button" variant="outline" className="border-amber-200 text-gray-900 hover:bg-amber-50">
                                            <Link href={route('bookings.show', booking.id)}>Cancel</Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
}
