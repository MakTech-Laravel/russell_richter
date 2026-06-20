import { Head, Link } from '@inertiajs/react';
import { Car, Edit, Eye, Plus } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardEmptyState,
} from '@/components/dashboard/dashboard-ui';
import UserLayout from '@/layouts/user-layout';

interface Vehicle {
    id: number;
    vin: string;
    display_name: string;
    mileage: number | null;
    license_plate: string | null;
    color: string | null;
}

interface IndexProps {
    vehicles: Vehicle[];
}

export default function Index({ vehicles }: IndexProps) {
    return (
        <UserLayout
            title="My Vehicles"
            subtitle="Manage your registered vehicles for mobile service."
            actions={
                <Link href={route('vehicles.create')} className="ml-btn-primary inline-flex">
                    <Plus className="h-4 w-4" /> Add Vehicle
                </Link>
            }
        >
            <Head title="My Vehicles" />

            {vehicles.length === 0 ? (
                <DashboardEmptyState
                    icon={Car}
                    title="No vehicles yet"
                    description="Add your first vehicle to start booking services."
                    action={
                        <Link href={route('vehicles.create')} className="ml-btn-primary inline-flex">
                            Add Vehicle
                        </Link>
                    }
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((vehicle) => (
                        <DashboardCard key={vehicle.id}>
                            <DashboardCardHeader title={vehicle.display_name} subtitle={`VIN: ${vehicle.vin}`} />
                            <DashboardCardContent className="space-y-3 pt-0">
                                <div className="flex flex-wrap gap-2 text-sm text-slate-400">
                                    {vehicle.mileage != null && <span>{vehicle.mileage.toLocaleString()} mi</span>}
                                    {vehicle.license_plate && <span>· {vehicle.license_plate}</span>}
                                    {vehicle.color && <span>· {vehicle.color}</span>}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('vehicles.show', vehicle.id)} className="ml-btn-outline inline-flex text-xs">
                                        <Eye className="h-3.5 w-3.5" /> View
                                    </Link>
                                    <Link href={route('vehicles.edit', vehicle.id)} className="ml-btn-outline inline-flex text-xs">
                                        <Edit className="h-3.5 w-3.5" /> Edit
                                    </Link>
                                </div>
                            </DashboardCardContent>
                        </DashboardCard>
                    ))}
                </div>
            )}
        </UserLayout>
    );
}
