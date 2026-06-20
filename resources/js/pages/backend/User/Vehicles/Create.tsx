import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserLayout from '@/layouts/user-layout';

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : '';
}

interface DecodedVin {
    year?: number | string;
    make?: string;
    model?: string;
    trim?: string;
    engine?: string;
    fuel_type?: string;
    body_class?: string;
    drive_type?: string;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        vin: '',
        year: '' as string | number,
        make: '',
        model: '',
        trim: '',
        engine: '',
        fuel_type: '',
        body_class: '',
        drive_type: '',
        mileage: '' as string | number,
        license_plate: '',
        color: '',
        decode_vin: true,
    });

    const [decoding, setDecoding] = useState(false);
    const [decodeError, setDecodeError] = useState('');

    const decodeVin = async (): Promise<void> => {
        if (data.vin.length !== 17) {
            setDecodeError('Please enter a valid 17-character VIN.');

            return;
        }

        setDecoding(true);
        setDecodeError('');

        try {
            const response = await fetch(route('vin.decode'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ vin: data.vin.toUpperCase() }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setDecodeError(result.message ?? 'Unable to decode VIN.');

                return;
            }

            const decoded = result.data as DecodedVin;
            setData((prev) => ({
                ...prev,
                vin: data.vin.toUpperCase(),
                year: decoded.year ?? prev.year,
                make: decoded.make ?? prev.make,
                model: decoded.model ?? prev.model,
                trim: decoded.trim ?? prev.trim,
                engine: decoded.engine ?? prev.engine,
                fuel_type: decoded.fuel_type ?? prev.fuel_type,
                body_class: decoded.body_class ?? prev.body_class,
                drive_type: decoded.drive_type ?? prev.drive_type,
            }));
        } catch {
            setDecodeError('Unable to decode VIN. Please enter details manually.');
        } finally {
            setDecoding(false);
        }
    };

    const submit = (e: React.FormEvent): void => {
        e.preventDefault();
        post(route('vehicles.store'));
    };

    const inputClass = 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400';

    return (
        <UserLayout>
            <Head title="Add Vehicle" />

            <div className="container mx-auto max-w-2xl px-4 py-8">
                <div className="mb-6">
                    <Link href={route('vehicles.index')} className="inline-flex items-center gap-1 text-sm text-ml-gold hover:underline">
                        <ArrowLeft className="size-4" /> Back to vehicles
                    </Link>
                    <h1 className="mt-2 text-3xl font-bold text-gray-900">Add Vehicle</h1>
                    <p className="text-gray-500">Enter your VIN to auto-fill vehicle details.</p>
                </div>

                <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                    <CardHeader>
                        <CardTitle>Vehicle Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="vin" className="text-gray-600">VIN</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="vin"
                                        value={data.vin}
                                        onChange={(e) => setData('vin', e.target.value.toUpperCase())}
                                        maxLength={17}
                                        placeholder="17-character VIN"
                                        className={inputClass}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={decodeVin}
                                        disabled={decoding || data.vin.length !== 17}
                                        className="shrink-0 border-amber-200 text-gray-900 hover:bg-amber-50"
                                    >
                                        {decoding ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                                        Decode
                                    </Button>
                                </div>
                                <InputError message={errors.vin} />
                                {decodeError && <InputError message={decodeError} />}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="year" className="text-gray-600">Year</Label>
                                    <Input id="year" value={data.year} onChange={(e) => setData('year', e.target.value)} className={inputClass} />
                                    <InputError message={errors.year} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="make" className="text-gray-600">Make</Label>
                                    <Input id="make" value={data.make} onChange={(e) => setData('make', e.target.value)} className={inputClass} />
                                    <InputError message={errors.make} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="model" className="text-gray-600">Model</Label>
                                    <Input id="model" value={data.model} onChange={(e) => setData('model', e.target.value)} className={inputClass} />
                                    <InputError message={errors.model} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="trim" className="text-gray-600">Trim</Label>
                                    <Input id="trim" value={data.trim} onChange={(e) => setData('trim', e.target.value)} className={inputClass} />
                                    <InputError message={errors.trim} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="engine" className="text-gray-600">Engine</Label>
                                    <Input id="engine" value={data.engine} onChange={(e) => setData('engine', e.target.value)} className={inputClass} />
                                    <InputError message={errors.engine} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fuel_type" className="text-gray-600">Fuel Type</Label>
                                    <Input id="fuel_type" value={data.fuel_type} onChange={(e) => setData('fuel_type', e.target.value)} className={inputClass} />
                                    <InputError message={errors.fuel_type} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="mileage" className="text-gray-600">Mileage</Label>
                                    <Input id="mileage" type="number" value={data.mileage} onChange={(e) => setData('mileage', e.target.value)} className={inputClass} />
                                    <InputError message={errors.mileage} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="license_plate" className="text-gray-600">License Plate</Label>
                                    <Input id="license_plate" value={data.license_plate} onChange={(e) => setData('license_plate', e.target.value)} className={inputClass} />
                                    <InputError message={errors.license_plate} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="color" className="text-gray-600">Color</Label>
                                    <Input id="color" value={data.color} onChange={(e) => setData('color', e.target.value)} className={inputClass} />
                                    <InputError message={errors.color} />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing} className="ml-gold-gradient border-0 font-bold text-ml-black">
                                    {processing ? 'Saving...' : 'Add Vehicle'}
                                </Button>
                                <Button asChild type="button" variant="outline" className="border-amber-200 text-gray-900 hover:bg-amber-50">
                                    <Link href={route('vehicles.index')}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
}
