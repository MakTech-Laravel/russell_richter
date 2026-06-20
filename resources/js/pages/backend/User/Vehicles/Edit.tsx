import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    const inputClass = 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400';

    return (
        <UserLayout>
            <Head title={`Edit ${vehicle.display_name}`} />

            <div className="container mx-auto max-w-lg px-4 py-8">
                <div className="mb-6">
                    <Link href={route('vehicles.show', vehicle.id)} className="inline-flex items-center gap-1 text-sm text-ml-gold hover:underline">
                        <ArrowLeft className="size-4" /> Back to vehicle
                    </Link>
                    <h1 className="mt-2 text-3xl font-bold text-gray-900">Edit Vehicle</h1>
                    <p className="text-gray-500">{vehicle.display_name} · {vehicle.vin}</p>
                </div>

                <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                    <CardHeader>
                        <CardTitle>Update Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={route('vehicles.update', vehicle.id)}
                            method="put"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="mileage" className="text-gray-600">Mileage</Label>
                                        <Input
                                            id="mileage"
                                            name="mileage"
                                            type="number"
                                            defaultValue={vehicle.mileage ?? ''}
                                            className={inputClass}
                                        />
                                        <InputError message={errors.mileage} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="license_plate" className="text-gray-600">License Plate</Label>
                                        <Input
                                            id="license_plate"
                                            name="license_plate"
                                            defaultValue={vehicle.license_plate ?? ''}
                                            className={inputClass}
                                        />
                                        <InputError message={errors.license_plate} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="color" className="text-gray-600">Color</Label>
                                        <Input
                                            id="color"
                                            name="color"
                                            defaultValue={vehicle.color ?? ''}
                                            className={inputClass}
                                        />
                                        <InputError message={errors.color} />
                                    </div>

                                    <div className="flex gap-3">
                                        <Button type="submit" disabled={processing} className="ml-gold-gradient border-0 font-bold text-ml-black">
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button asChild type="button" variant="outline" className="border-amber-200 text-gray-900 hover:bg-amber-50">
                                            <Link href={route('vehicles.show', vehicle.id)}>Cancel</Link>
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
