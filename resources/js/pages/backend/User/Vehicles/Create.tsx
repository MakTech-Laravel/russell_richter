import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FlaskConical, Loader2, Search, X } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import UserLayout from '@/layouts/user-layout';
import { cn } from '@/lib/utils';

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

interface OilSpec {
    oil_grade: string;
    oil_capacity_quarts: number;
    oil_filter_part_no: string;
    oil_filter_brand: string | null;
    supports_synthetic: boolean;
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
        oil_preference_notes: '',
        decode_vin: true,
    });

    const [decoding, setDecoding] = useState(false);
    const [decodeError, setDecodeError] = useState('');
    const [oilSpec, setOilSpec] = useState<OilSpec | null>(null);
    const [decoded, setDecoded] = useState(false);

    const decodeVin = async (): Promise<void> => {
        if (data.vin.length !== 17) {
            setDecodeError('Please enter a valid 17-character VIN.');

            return;
        }

        setDecoding(true);
        setDecodeError('');
        setOilSpec(null);
        setDecoded(false);

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

            const decodedData = result.data as DecodedVin;
            setData((prev) => ({
                ...prev,
                vin: data.vin.toUpperCase(),
                year: decodedData.year ?? prev.year,
                make: decodedData.make ?? prev.make,
                model: decodedData.model ?? prev.model,
                trim: decodedData.trim ?? prev.trim,
                engine: decodedData.engine ?? prev.engine,
                fuel_type: decodedData.fuel_type ?? prev.fuel_type,
                body_class: decodedData.body_class ?? prev.body_class,
                drive_type: decodedData.drive_type ?? prev.drive_type,
            }));

            setOilSpec(result.oil_spec ?? null);
            setDecoded(true);
        } catch {
            setDecodeError('Unable to decode VIN. Please enter details manually.');
        } finally {
            setDecoding(false);
        }
    };

    const clearVin = (): void => {
        setData((prev) => ({
            ...prev,
            vin: '',
            year: '',
            make: '',
            model: '',
            trim: '',
            engine: '',
            fuel_type: '',
            body_class: '',
            drive_type: '',
        }));
        setDecoded(false);
        setOilSpec(null);
        setDecodeError('');
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
                                    <div className="relative min-w-0 flex-1">
                                        <Input
                                            id="vin"
                                            value={data.vin}
                                            onChange={(e) => {
                                                setData('vin', e.target.value.toUpperCase());
                                                setDecoded(false);
                                                setOilSpec(null);
                                                setDecodeError('');
                                            }}
                                            maxLength={17}
                                            placeholder="17-character VIN"
                                            className={cn(dashboardInputClass(), data.vin && 'pr-9')}
                                            required
                                        />
                                        {data.vin.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={clearVin}
                                                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
                                                aria-label="Clear VIN"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
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
                                    <Input id="trim" value={data.trim} onChange={(e) => setData('trim', e.target.value)} className={dashboardInputClass()} placeholder="Enter trim manually if blank" />
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

                            <div className="space-y-2">
                                <label htmlFor="oil_preference_notes" className={dashboardLabelClass()}>
                                    Oil &amp; Filter Preferences (optional)
                                </label>
                                <Textarea
                                    id="oil_preference_notes"
                                    value={data.oil_preference_notes}
                                    onChange={(e) => setData('oil_preference_notes', e.target.value)}
                                    rows={3}
                                    placeholder="e.g. Prefer Mobil 1 full synthetic only, or request a specific oil filter brand."
                                    className={dashboardInputClass()}
                                />
                                <p className="text-xs text-slate-400">
                                    We stock our recommended brand by default. Use this field if you prefer a specific oil or filter.
                                </p>
                                <InputError message={errors.oil_preference_notes} />
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

                {/* Oil spec preview — shown immediately after VIN decode */}
                {decoded && (
                    <DashboardCard>
                        <DashboardCardHeader
                            title={
                                <span className="flex items-center gap-2">
                                    <FlaskConical className="h-4 w-4 text-gold-400" />
                                    Oil Service Specifications
                                </span>
                            }
                            subtitle={
                                oilSpec
                                    ? `OEM fitment data for ${data.year} ${data.make} ${data.model}`
                                    : undefined
                            }
                        />
                        <DashboardCardContent>
                            {oilSpec ? (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between border-b border-white/5 py-3">
                                        <span className="text-slate-400">🛢️ Oil Grade</span>
                                        <span className="rounded-md bg-gold-500/10 px-2 py-0.5 font-mono text-sm font-bold text-gold-300 ring-1 ring-gold-500/30">
                                            {oilSpec.oil_grade}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-white/5 py-3">
                                        <span className="text-slate-400">🛢️ Oil Capacity</span>
                                        <span className="font-semibold text-white">{oilSpec.oil_capacity_quarts} quarts</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-white/5 py-3">
                                        <span className="text-slate-400">Oil Type</span>
                                        <span className={`text-sm font-semibold ${oilSpec.supports_synthetic ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {oilSpec.supports_synthetic ? '✓ Full Synthetic Recommended' : 'Conventional'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <span className="text-slate-400">🔩 Oil Filter (OEM)</span>
                                        <div className="text-right">
                                            <div className="inline-flex items-center gap-1.5 rounded-md border border-gold-500/30 bg-gold-500/10 px-2.5 py-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Part #</span>
                                                <span className="font-mono text-sm font-bold tracking-wider text-gold-300">
                                                    {oilSpec.oil_filter_part_no}
                                                </span>
                                            </div>
                                            {oilSpec.oil_filter_brand && (
                                                <p className="mt-1 text-xs text-slate-500">{oilSpec.oil_filter_brand}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 py-6 text-center">
                                    <FlaskConical className="h-7 w-7 text-slate-600" />
                                    <p className="text-sm font-medium text-slate-300">No fitment data on file</p>
                                    <p className="text-xs text-slate-500">
                                        Your technician will verify the correct oil filter and grade on-site for this vehicle.
                                    </p>
                                </div>
                            )}
                        </DashboardCardContent>
                    </DashboardCard>
                )}
            </div>
        </UserLayout>
    );
}
