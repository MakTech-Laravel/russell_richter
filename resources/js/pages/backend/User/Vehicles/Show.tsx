import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
} from '@/components/dashboard/dashboard-ui';
import UserLayout from '@/layouts/user-layout';

interface Vehicle {
    id: number;
    vin: string;
    year: number | null;
    make: string | null;
    model: string | null;
    trim: string | null;
    engine: string | null;
    fuel_type: string | null;
    body_class: string | null;
    drive_type: string | null;
    mileage: number | null;
    license_plate: string | null;
    color: string | null;
    display_name: string;
    decoded_at: string | null;
}

interface ShowProps {
    vehicle: Vehicle;
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
    if (value == null || value === '') {
        return null;
    }

    return (
        <div className="flex justify-between border-b border-white/5 py-3 last:border-0">
            <span className="text-slate-400">{label}</span>
            <span className="font-medium text-white">{value}</span>
        </div>
    );
}

export default function Show({ vehicle }: ShowProps) {
    return (
        <UserLayout
            title={vehicle.display_name}
            subtitle={vehicle.vin}
            actions={
                <Link href={route('vehicles.edit', vehicle.id)} className="ml-btn-outline inline-flex">
                    <Edit className="h-4 w-4" /> Edit
                </Link>
            }
        >
            <Head title={vehicle.display_name} />

            <div className="mx-auto max-w-2xl space-y-4">
                <Link href={route('vehicles.index')} className="inline-flex items-center gap-1 text-sm text-gold-400 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to vehicles
                </Link>

                <DashboardCard>
                    <DashboardCardHeader
                        title="Vehicle Details"
                        subtitle={vehicle.decoded_at ? `VIN decoded ${vehicle.decoded_at}` : undefined}
                    />
                    <DashboardCardContent>
                        <DetailRow label="Year" value={vehicle.year} />
                        <DetailRow label="Make" value={vehicle.make} />
                        <DetailRow label="Model" value={vehicle.model} />
                        <DetailRow label="Trim" value={vehicle.trim} />
                        <DetailRow label="Engine" value={vehicle.engine} />
                        <DetailRow label="Fuel Type" value={vehicle.fuel_type} />
                        <DetailRow label="Body Class" value={vehicle.body_class} />
                        <DetailRow label="Drive Type" value={vehicle.drive_type} />
                        <DetailRow label="Mileage" value={vehicle.mileage != null ? `${vehicle.mileage.toLocaleString()} mi` : null} />
                        <DetailRow label="License Plate" value={vehicle.license_plate} />
                        <DetailRow label="Color" value={vehicle.color} />
                    </DashboardCardContent>
                </DashboardCard>

                <Link href={route('bookings.create')} className="ml-btn-primary inline-flex">
                    Book Service for This Vehicle
                </Link>
            </div>
        </UserLayout>
    );
}
