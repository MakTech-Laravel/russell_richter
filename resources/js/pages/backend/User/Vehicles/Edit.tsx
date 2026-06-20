import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    dashboardInputClass,
    dashboardLabelClass,
} from '@/components/dashboard/dashboard-ui';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import UserLayout from '@/layouts/user-layout';

interface Vehicle {
    id: number;
    display_name: string;
    vin: string;
    mileage: number | null;
    license_plate: string | null;
    color: string | null;
}

interface EditProps {
    vehicle: Vehicle;
}

export default function Edit({ vehicle }: EditProps) {
    return (
        <UserLayout
            title="Edit Vehicle"
            subtitle={`${vehicle.display_name} · ${vehicle.vin}`}
        >
            <Head title={`Edit ${vehicle.display_name}`} />

            <div className="mx-auto max-w-lg space-y-4">
                <Link href={route('vehicles.show', vehicle.id)} className="inline-flex items-center gap-1 text-sm text-gold-400 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to vehicle
                </Link>

                <DashboardCard>
                    <DashboardCardHeader title="Update Details" />
                    <DashboardCardContent>
                        <Form
                            action={route('vehicles.update', vehicle.id)}
                            method="put"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <label htmlFor="mileage" className={dashboardLabelClass()}>Mileage</label>
                                        <Input
                                            id="mileage"
                                            name="mileage"
                                            type="number"
                                            defaultValue={vehicle.mileage ?? ''}
                                            className={dashboardInputClass()}
                                        />
                                        <InputError message={errors.mileage} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="license_plate" className={dashboardLabelClass()}>License Plate</label>
                                        <Input
                                            id="license_plate"
                                            name="license_plate"
                                            defaultValue={vehicle.license_plate ?? ''}
                                            className={dashboardInputClass()}
                                        />
                                        <InputError message={errors.license_plate} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="color" className={dashboardLabelClass()}>Color</label>
                                        <Input
                                            id="color"
                                            name="color"
                                            defaultValue={vehicle.color ?? ''}
                                            className={dashboardInputClass()}
                                        />
                                        <InputError message={errors.color} />
                                    </div>

                                    <div className="flex gap-3">
                                        <button type="submit" disabled={processing} className="ml-btn-primary inline-flex">
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <Link href={route('vehicles.show', vehicle.id)} className="ml-btn-outline inline-flex">
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
