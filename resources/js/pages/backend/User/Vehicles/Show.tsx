import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="flex justify-between border-b border-gray-200 py-3 last:border-0">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

export default function Show({ vehicle }: ShowProps) {
    return (
        <UserLayout>
            <Head title={vehicle.display_name} />

            <div className="container mx-auto max-w-2xl px-4 py-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link href={route('vehicles.index')} className="inline-flex items-center gap-1 text-sm text-ml-gold hover:underline">
                            <ArrowLeft className="size-4" /> Back to vehicles
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900">{vehicle.display_name}</h1>
                        <p className="font-mono text-sm text-gray-400">{vehicle.vin}</p>
                    </div>
                    <Button asChild variant="outline" className="border-amber-200 text-gray-900 hover:bg-amber-50">
                        <Link href={route('vehicles.edit', vehicle.id)}>
                            <Edit className="size-4" /> Edit
                        </Link>
                    </Button>
                </div>

                <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                    <CardHeader>
                        <CardTitle>Vehicle Details</CardTitle>
                        {vehicle.decoded_at && (
                            <p className="text-xs text-gray-400">VIN decoded {vehicle.decoded_at}</p>
                        )}
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>

                <div className="mt-6">
                    <Button asChild className="ml-gold-gradient border-0 font-bold text-ml-black">
                        <Link href={route('bookings.create')}>Book Service for This Vehicle</Link>
                    </Button>
                </div>
            </div>
        </UserLayout>
    );
}
