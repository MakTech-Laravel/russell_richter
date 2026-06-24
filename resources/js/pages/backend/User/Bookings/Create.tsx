import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    dashboardInputClass,
    dashboardLabelClass,
    dashboardSelectClass,
} from '@/components/dashboard/dashboard-ui';
import { BookingScheduleField } from '@/components/dashboard/booking-schedule-field';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
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
    selectedServiceId: number | null;
    defaults: Defaults;
}

export default function Create({ vehicles, services, selectedServiceId, defaults }: CreateProps) {
    return (
        <UserLayout title="Book Service" subtitle="Schedule a mobile oil change at your location.">
            <Head title="Book Service" />

            <div className="mx-auto max-w-2xl space-y-4">
                <Link href={route('bookings.index')} className="inline-flex items-center gap-1 text-sm text-gold-400 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to bookings
                </Link>

                {vehicles.length === 0 ? (
                    <DashboardCard>
                        <DashboardCardContent className="py-12 text-center">
                            <p className="text-slate-400">You need at least one vehicle to book a service.</p>
                            <Link href={route('vehicles.create')} className="ml-btn-primary mt-4 inline-flex">
                                Add Vehicle
                            </Link>
                        </DashboardCardContent>
                    </DashboardCard>
                ) : (
                    <DashboardCard>
                        <DashboardCardHeader title="Service Details" />
                        <DashboardCardContent>
                            <Form action={route('bookings.store')} method="post" className="space-y-6">
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-2">
                                            <label htmlFor="vehicle_id" className={dashboardLabelClass()}>Vehicle</label>
                                            <select id="vehicle_id" name="vehicle_id" required className={dashboardSelectClass()} defaultValue="">
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
                                            <label htmlFor="service_id" className={dashboardLabelClass()}>Service</label>
                                            <select
                                                id="service_id"
                                                name="service_id"
                                                required
                                                className={dashboardSelectClass()}
                                                defaultValue={selectedServiceId ?? ''}
                                            >
                                                <option value="" disabled>Select a service</option>
                                                {services.map((service) => (
                                                    <option key={service.id} value={service.id}>
                                                        {service.name} — ${Number(service.base_price).toFixed(2)}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.service_id} />
                                        </div>

                                        <BookingScheduleField error={errors.scheduled_at} />

                                        <div className="space-y-2">
                                            <label htmlFor="service_address" className={dashboardLabelClass()}>Service Address</label>
                                            <Input
                                                id="service_address"
                                                name="service_address"
                                                defaultValue={defaults.service_address ?? ''}
                                                required
                                                className={dashboardInputClass()}
                                            />
                                            <InputError message={errors.service_address} />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div className="space-y-2 sm:col-span-1">
                                                <label htmlFor="service_city" className={dashboardLabelClass()}>City</label>
                                                <Input
                                                    id="service_city"
                                                    name="service_city"
                                                    defaultValue={defaults.service_city ?? 'Victoria'}
                                                    required
                                                    className={dashboardInputClass()}
                                                />
                                                <InputError message={errors.service_city} />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="service_state" className={dashboardLabelClass()}>State</label>
                                                <Input
                                                    id="service_state"
                                                    name="service_state"
                                                    defaultValue={defaults.service_state ?? 'TX'}
                                                    maxLength={2}
                                                    required
                                                    className={dashboardInputClass()}
                                                />
                                                <InputError message={errors.service_state} />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="service_zip" className={dashboardLabelClass()}>ZIP</label>
                                                <Input
                                                    id="service_zip"
                                                    name="service_zip"
                                                    defaultValue={defaults.service_zip ?? ''}
                                                    required
                                                    className={dashboardInputClass()}
                                                />
                                                <InputError message={errors.service_zip} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="mileage_at_service" className={dashboardLabelClass()}>Current Mileage (optional)</label>
                                            <Input id="mileage_at_service" name="mileage_at_service" type="number" className={dashboardInputClass()} />
                                            <InputError message={errors.mileage_at_service} />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="customer_notes" className={dashboardLabelClass()}>Notes (optional)</label>
                                            <Textarea
                                                id="customer_notes"
                                                name="customer_notes"
                                                rows={3}
                                                placeholder="Gate code, parking instructions, etc."
                                                className={dashboardInputClass()}
                                            />
                                            <InputError message={errors.customer_notes} />
                                        </div>

                                        <p className="rounded-xl border border-gold-500/20 bg-gold-500/10 px-4 py-3 text-sm text-slate-300">
                                            After you submit, you&apos;ll be redirected to Stripe to pay securely. Your booking is confirmed once payment is complete.
                                        </p>

                                        <div className="flex gap-3">
                                            <button type="submit" disabled={processing} className="ml-btn-primary inline-flex">
                                                {processing ? 'Redirecting...' : 'Proceed to Payment'}
                                            </button>
                                            <Link href={route('bookings.index')} className="ml-btn-outline inline-flex">
                                                Cancel
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </DashboardCardContent>
                    </DashboardCard>
                )}
            </div>
        </UserLayout>
    );
}
