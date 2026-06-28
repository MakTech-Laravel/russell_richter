import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, FlaskConical } from 'lucide-react';

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
    oil_preference_notes: string | null;
    display_name: string;
    decoded_at: string | null;
}

interface OilSpec {
    oil_grade: string;
    oil_capacity_quarts: number;
    oil_filter_part_no: string;
    oil_filter_brand: string | null;
    supports_synthetic: boolean;
}

interface ShowProps {
    vehicle: Vehicle;
    oilSpec: OilSpec | null;
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

export default function Show({ vehicle, oilSpec }: ShowProps) {
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

                {/* Oil Service Spec Card */}
                <DashboardCard>
                    <DashboardCardHeader
                        title={
                            <span className="flex items-center gap-2">
                                <FlaskConical className="h-4 w-4 text-gold-400" />
                                Oil Service Specifications
                            </span>
                        }
                        subtitle={oilSpec ? `OEM fitment data for your ${vehicle.display_name}` : undefined}
                    />
                    <DashboardCardContent>
                        {oilSpec ? (
                            <div className="space-y-1">
                                {/* Oil Grade */}
                                <div className="flex items-center justify-between border-b border-white/5 py-3">
                                    <span className="text-slate-400">🛢️ Oil Grade</span>
                                    <span className="rounded-md bg-gold-500/10 px-2 py-0.5 font-mono text-sm font-bold text-gold-300 ring-1 ring-gold-500/30">
                                        {oilSpec.oil_grade}
                                    </span>
                                </div>

                                {/* Oil Capacity */}
                                <div className="flex items-center justify-between border-b border-white/5 py-3">
                                    <span className="text-slate-400">🛢️ Oil Capacity</span>
                                    <span className="font-semibold text-white">
                                        {oilSpec.oil_capacity_quarts} quarts
                                    </span>
                                </div>

                                {/* Synthetic */}
                                <div className="flex items-center justify-between border-b border-white/5 py-3">
                                    <span className="text-slate-400">Oil Type</span>
                                    <span className={`text-sm font-semibold ${oilSpec.supports_synthetic ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {oilSpec.supports_synthetic ? '✓ Full Synthetic Recommended' : 'Conventional'}
                                    </span>
                                </div>

                                {/* Oil Filter */}
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
                            <div className="flex flex-col items-center gap-3 py-6 text-center">
                                <FlaskConical className="h-8 w-8 text-slate-600" />
                                <div>
                                    <p className="text-sm font-medium text-slate-300">No fitment data on file</p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Your technician will verify the correct oil filter and grade on-site.
                                        {vehicle.year && vehicle.make && vehicle.model && (
                                            <span> ({vehicle.year} {vehicle.make} {vehicle.model})</span>
                                        )}
                                    </p>
                                </div>
                                <Link href={route('bookings.create')} className="ml-btn-primary inline-flex text-sm">
                                    Book Service Anyway
                                </Link>
                            </div>
                        )}
                        {vehicle.oil_preference_notes && (
                            <div className="mt-4 rounded-xl border border-gold-500/20 bg-gold-500/5 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-gold-400">Your Oil &amp; Filter Preferences</p>
                                <p className="mt-2 text-sm text-slate-300">{vehicle.oil_preference_notes}</p>
                            </div>
                        )}
                    </DashboardCardContent>
                </DashboardCard>

                <Link href={route('bookings.create')} className="ml-btn-primary inline-flex">
                    Book Service for This Vehicle
                </Link>
            </div>
        </UserLayout>
    );
}
