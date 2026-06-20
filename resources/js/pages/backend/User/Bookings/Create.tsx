import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UserLayout from '@/layouts/user-layout';

interface VehicleOption {
    id: number;
    display_name: string;
    vin: string;
}

interface ServiceOption {
    id: number;
    name: string;
    base_price: string | number;
    slug: string;
}

interface Defaults {
    service_address: string | null;
    service_city: string | null;
    service_state: string | null;
    service_zip: string | null;
}

interface CreateProps {
    vehicles: VehicleOption[];
    services: ServiceOption[];
    defaults: Defaults;
}

export default function Create({ vehicles, services, defaults }: CreateProps) {
    const inputClass = 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400';
    const selectClass = `${inputClass} flex h-10 w-full rounded-md border px-3 py-2 text-sm`;

    const defaultDatetime = (): string => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(9, 0, 0, 0);

        return date.toISOString().slice(0, 16);
    };

    return (
        <UserLayout>
            <Head title="Book Service" />

            <div className="container mx-auto max-w-2xl px-4 py-8">
                <div className="mb-6">
                    <Link href={route('bookings.index')} className="inline-flex items-center gap-1 text-sm text-ml-gold hover:underline">
                        <ArrowLeft className="size-4" /> Back to bookings
                    </Link>
                    <h1 className="mt-2 text-3xl font-bold text-gray-900">Book Service</h1>
                    <p className="text-gray-500">Schedule a mobile oil change at your location.</p>
                </div>

                {vehicles.length === 0 ? (
                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardContent className="py-12 text-center">
                            <p className="text-gray-500">You need at least one vehicle to book a service.</p>
                            <Button asChild className="mt-4 ml-gold-gradient border-0 font-bold text-ml-black">
                                <Link href={route('vehicles.create')}>Add Vehicle</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader>
                            <CardTitle>Service Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form action={route('bookings.store')} method="post" className="space-y-6">
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="vehicle_id" className="text-gray-600">Vehicle</Label>
                                            <select id="vehicle_id" name="vehicle_id" required className={selectClass} defaultValue="">
                                                <option value="" disabled>Select a vehicle</option>
                                                {vehicles.map((vehicle) => (
                                                    <option key={vehicle.id} value={vehicle.id}>
                                                        {vehicle.display_name} ({vehicle.vin})
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.vehicle_id} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="service_id" className="text-gray-600">Service</Label>
                                            <select id="service_id" name="service_id" required className={selectClass} defaultValue="">
                                                <option value="" disabled>Select a service</option>
                                                {services.map((service) => (
                                                    <option key={service.id} value={service.id}>
                                                        {service.name} — ${Number(service.base_price).toFixed(2)}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.service_id} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="scheduled_at" className="text-gray-600">Date & Time</Label>
                                            <Input
                                                id="scheduled_at"
                                                name="scheduled_at"
                                                type="datetime-local"
                                                defaultValue={defaultDatetime()}
                                                required
                                                className={inputClass}
                                            />
                                            <InputError message={errors.scheduled_at} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="service_address" className="text-gray-600">Service Address</Label>
                                            <Input
                                                id="service_address"
                                                name="service_address"
                                                defaultValue={defaults.service_address ?? ''}
                                                required
                                                className={inputClass}
                                            />
                                            <InputError message={errors.service_address} />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div className="space-y-2 sm:col-span-1">
                                                <Label htmlFor="service_city" className="text-gray-600">City</Label>
                                                <Input
                                                    id="service_city"
                                                    name="service_city"
                                                    defaultValue={defaults.service_city ?? 'Victoria'}
                                                    required
                                                    className={inputClass}
                                                />
                                                <InputError message={errors.service_city} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="service_state" className="text-gray-600">State</Label>
                                                <Input
                                                    id="service_state"
                                                    name="service_state"
                                                    defaultValue={defaults.service_state ?? 'TX'}
                                                    maxLength={2}
                                                    required
                                                    className={inputClass}
                                                />
                                                <InputError message={errors.service_state} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="service_zip" className="text-gray-600">ZIP</Label>
                                                <Input
                                                    id="service_zip"
                                                    name="service_zip"
                                                    defaultValue={defaults.service_zip ?? ''}
                                                    required
                                                    className={inputClass}
                                                />
                                                <InputError message={errors.service_zip} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="mileage_at_service" className="text-gray-600">Current Mileage (optional)</Label>
                                            <Input id="mileage_at_service" name="mileage_at_service" type="number" className={inputClass} />
                                            <InputError message={errors.mileage_at_service} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="customer_notes" className="text-gray-600">Notes (optional)</Label>
                                            <Textarea
                                                id="customer_notes"
                                                name="customer_notes"
                                                rows={3}
                                                placeholder="Gate code, parking instructions, etc."
                                                className={inputClass}
                                            />
                                            <InputError message={errors.customer_notes} />
                                        </div>

                                        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-gray-600">
                                            After you submit, you&apos;ll be redirected to Stripe to pay securely. Your booking is confirmed once payment is complete.
                                        </p>

                                        <div className="flex gap-3">
                                            <Button type="submit" disabled={processing} className="ml-gold-gradient border-0 font-bold text-ml-black">
                                                {processing ? 'Redirecting...' : 'Proceed to Payment'}
                                            </Button>
                                            <Button asChild type="button" variant="outline" className="border-amber-200 text-gray-900 hover:bg-amber-50">
                                                <Link href={route('bookings.index')}>Cancel</Link>
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </UserLayout>
    );
}
