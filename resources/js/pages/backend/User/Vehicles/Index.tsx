import { Head, Link } from '@inertiajs/react';
import { Car, Edit, Eye, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <UserLayout>
            <Head title="My Vehicles" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
                        <p className="text-gray-500">Manage your registered vehicles for mobile service.</p>
                    </div>
                    <Button asChild className="ml-gold-gradient border-0 font-bold text-ml-black">
                        <Link href={route('vehicles.create')}>
                            <Plus className="size-4" /> Add Vehicle
                        </Link>
                    </Button>
                </div>

                {vehicles.length === 0 ? (
                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                            <Car className="size-12 text-ml-gold/40" />
                            <div>
                                <p className="text-lg font-medium">No vehicles yet</p>
                                <p className="text-sm text-gray-400">Add your first vehicle to start booking services.</p>
                            </div>
                            <Button asChild className="ml-gold-gradient border-0 font-bold text-ml-black">
                                <Link href={route('vehicles.create')}>Add Vehicle</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {vehicles.map((vehicle) => (
                            <Card key={vehicle.id} className="border-gray-200 bg-white text-gray-900 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{vehicle.display_name}</CardTitle>
                                    <p className="text-xs text-gray-400">VIN: {vehicle.vin}</p>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                                        {vehicle.mileage != null && (
                                            <span>{vehicle.mileage.toLocaleString()} mi</span>
                                        )}
                                        {vehicle.license_plate && <span>· {vehicle.license_plate}</span>}
                                        {vehicle.color && <span>· {vehicle.color}</span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" size="sm" className="border-amber-200 text-gray-900 hover:bg-amber-50">
                                            <Link href={route('vehicles.show', vehicle.id)}>
                                                <Eye className="size-4" /> View
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="sm" className="border-amber-200 text-gray-900 hover:bg-amber-50">
                                            <Link href={route('vehicles.edit', vehicle.id)}>
                                                <Edit className="size-4" /> Edit
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
