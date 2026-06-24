import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { BookingScheduleField } from '@/components/dashboard/booking-schedule-field';
import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    dashboardInputClass,
    dashboardLabelClass,
} from '@/components/dashboard/dashboard-ui';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import UserLayout from '@/layouts/user-layout';

interface Booking {
    id: number;
    route_key: string;
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
    return (
        <UserLayout
            title="Edit Booking"
            subtitle={`${booking.service?.name} · ${booking.vehicle?.display_name} · ${booking.status_label}`}
        >
            <Head title={`Edit Booking #${booking.id}`} />

            <div className="mx-auto max-w-2xl space-y-4">
                <Link href={route('bookings.show', booking.route_key)} className="inline-flex items-center gap-1 text-sm text-gold-400 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to booking
                </Link>

                <DashboardCard>
                    <DashboardCardHeader title="Update Appointment" />
                    <DashboardCardContent>
                        <Form
                            action={route('bookings.update', booking.route_key)}
                            method="put"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <BookingScheduleField
                                        defaultValue={booking.scheduled_at}
                                        error={errors.scheduled_at}
                                    />

                                    <div className="space-y-2">
                                        <label htmlFor="service_address" className={dashboardLabelClass()}>Service Address</label>
                                        <Input
                                            id="service_address"
                                            name="service_address"
                                            defaultValue={booking.service_address}
                                            className={dashboardInputClass()}
                                        />
                                        <InputError message={errors.service_address} />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="space-y-2">
                                            <label htmlFor="service_city" className={dashboardLabelClass()}>City</label>
                                            <Input id="service_city" name="service_city" defaultValue={booking.service_city} className={dashboardInputClass()} />
                                            <InputError message={errors.service_city} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="service_state" className={dashboardLabelClass()}>State</label>
                                            <Input id="service_state" name="service_state" defaultValue={booking.service_state} maxLength={2} className={dashboardInputClass()} />
                                            <InputError message={errors.service_state} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="service_zip" className={dashboardLabelClass()}>ZIP</label>
                                            <Input id="service_zip" name="service_zip" defaultValue={booking.service_zip} className={dashboardInputClass()} />
                                            <InputError message={errors.service_zip} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="mileage_at_service" className={dashboardLabelClass()}>Mileage</label>
                                        <Input
                                            id="mileage_at_service"
                                            name="mileage_at_service"
                                            type="number"
                                            defaultValue={booking.mileage_at_service ?? ''}
                                            className={dashboardInputClass()}
                                        />
                                        <InputError message={errors.mileage_at_service} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="customer_notes" className={dashboardLabelClass()}>Notes</label>
                                        <Textarea
                                            id="customer_notes"
                                            name="customer_notes"
                                            rows={3}
                                            defaultValue={booking.customer_notes ?? ''}
                                            className={dashboardInputClass()}
                                        />
                                        <InputError message={errors.customer_notes} />
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button type="submit" disabled={processing} className="ml-btn-primary inline-flex">
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <Link href={route('bookings.show', booking.route_key)} className="ml-btn-outline inline-flex">
                                            Cancel
                                        </Link>
                                    </div>
                                </>
                            )}
                        </Form>
                    </DashboardCardContent>
                </DashboardCard>
            </div>
        </UserLayout>
    );
}
