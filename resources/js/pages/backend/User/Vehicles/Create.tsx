import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import { useState } from 'react';

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

    return (
        <UserLayout title="Add Vehicle" subtitle="Enter your VIN to auto-fill vehicle details.">
            <Head title="Add Vehicle" />

            <div className="mx-auto max-w-2xl space-y-4">
                <Link href={route('vehicles.index')} className="inline-flex items-center gap-1 text-sm text-gold-400 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to vehicles
                </Link>

                <DashboardCard>
                    <DashboardCardHeader title="Vehicle Information" />
                    <DashboardCardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="vin" className={dashboardLabelClass()}>VIN</label>
                                <div className="flex gap-2">
                                    <Input
                                        id="vin"
                                        value={data.vin}
                                        onChange={(e) => setData('vin', e.target.value.toUpperCase())}
                                        maxLength={17}
                                        placeholder="17-character VIN"
                                        className={dashboardInputClass()}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={decodeVin}
                                        disabled={decoding || data.vin.length !== 17}
                                        className="ml-btn-outline inline-flex shrink-0"
                                    >
                                        {decoding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                        Decode
                                    </button>
                                </div>
                                <InputError message={errors.vin} />
                                {decodeError && <InputError message={decodeError} />}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="year" className={dashboardLabelClass()}>Year</label>
                                    <Input id="year" value={data.year} onChange={(e) => setData('year', e.target.value)} className={dashboardInputClass()} />
                                    <InputError message={errors.year} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="make" className={dashboardLabelClass()}>Make</label>
                                    <Input id="make" value={data.make} onChange={(e) => setData('make', e.target.value)} className={dashboardInputClass()} />
                                    <InputError message={errors.make} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="model" className={dashboardLabelClass()}>Model</label>
                                    <Input id="model" value={data.model} onChange={(e) => setData('model', e.target.value)} className={dashboardInputClass()} />
                                    <InputError message={errors.model} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="trim" className={dashboardLabelClass()}>Trim</label>
                                    <Input id="trim" value={data.trim} onChange={(e) => setData('trim', e.target.value)} className={dashboardInputClass()} />
                                    <InputError message={errors.trim} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="engine" className={dashboardLabelClass()}>Engine</label>
                                    <Input id="engine" value={data.engine} onChange={(e) => setData('engine', e.target.value)} className={dashboardInputClass()} />
                                    <InputError message={errors.engine} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="fuel_type" className={dashboardLabelClass()}>Fuel Type</label>
                                    <Input id="fuel_type" value={data.fuel_type} onChange={(e) => setData('fuel_type', e.target.value)} className={dashboardInputClass()} />
                                    <InputError message={errors.fuel_type} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <label htmlFor="mileage" className={dashboardLabelClass()}>Mileage</label>
                                    <Input id="mileage" type="number" value={data.mileage} onChange={(e) => setData('mileage', e.target.value)} className={dashboardInputClass()} />
                                    <InputError message={errors.mileage} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="license_plate" className={dashboardLabelClass()}>License Plate</label>
                                    <Input id="license_plate" value={data.license_plate} onChange={(e) => setData('license_plate', e.target.value)} className={dashboardInputClass()} />
                                    <InputError message={errors.license_plate} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="color" className={dashboardLabelClass()}>Color</label>
                                    <Input id="color" value={data.color} onChange={(e) => setData('color', e.target.value)} className={dashboardInputClass()} />
                                    <InputError message={errors.color} />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button type="submit" disabled={processing} className="ml-btn-primary inline-flex">
                                    {processing ? 'Saving...' : 'Add Vehicle'}
                                </button>
                                <Link href={route('vehicles.index')} className="ml-btn-outline inline-flex">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </DashboardCardContent>
                </DashboardCard>
            </div>
        </UserLayout>
    );
}
