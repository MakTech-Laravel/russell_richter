import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Car } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    StatusPill,
    dashboardRowLinkClass,
} from '@/components/dashboard/dashboard-ui';
import AdminLayout from '@/layouts/admin-layout';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address_line: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
}

interface Vehicle {
    id: number;
    display_name: string;
    vin: string;
    mileage: number | null;
}

interface Booking {
    id: number;
    route_key: string;
    service: string | null;
    vehicle: string | null;
    status: string;
    scheduled_at: string;
}

interface ShowProps {
    customer: Customer;
    vehicles: Vehicle[];
    bookings: Booking[];
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
    if (!value) {
        return null;
    }

    return (
        <div className="flex justify-between border-b border-white/5 py-3 last:border-0">
            <span className="text-slate-400">{label}</span>
            <span className="font-medium text-white">{value}</span>
        </div>
    );
}

export default function Show({ customer, vehicles, bookings }: ShowProps) {
    const fullAddress = [customer.address_line, customer.city, customer.state, customer.zip].filter(Boolean).join(', ');

    return (
        <AdminLayout title={customer.name} subtitle={customer.email}>
            <Head title={customer.name} />

            <div className="mx-auto max-w-4xl space-y-4">
                <Link href={route('admin.customers.index')} className="inline-flex items-center gap-1 text-sm text-gold-400 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to customers
                </Link>

                <div className="grid gap-6 lg:grid-cols-2">
                    <DashboardCard>
                        <DashboardCardHeader title="Contact Information" />
                        <DashboardCardContent>
                            <DetailRow label="Email" value={customer.email} />
                            <DetailRow label="Phone" value={customer.phone} />
                            <DetailRow label="Address" value={fullAddress || null} />
                        </DashboardCardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <DashboardCardHeader
                            title={
                                <span className="flex items-center gap-2">
                                    <Car className="h-4 w-4 text-gold-400" />
                                    Vehicles ({vehicles.length})
                                </span>
                            }
                        />
                        <DashboardCardContent className="space-y-3">
                            {vehicles.length === 0 ? (
                                <p className="text-sm text-slate-400">No vehicles registered.</p>
                            ) : (
                                vehicles.map((vehicle) => (
                                    <div key={vehicle.id} className="rounded-xl border border-white/5 bg-ink-900/40 p-4">
                                        <p className="font-medium text-white">{vehicle.display_name}</p>
                                        <p className="text-xs text-slate-500">VIN: {vehicle.vin}</p>
                                        {vehicle.mileage != null && (
                                            <p className="text-xs text-slate-500">{vehicle.mileage.toLocaleString()} mi</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </DashboardCardContent>
                    </DashboardCard>

                    <DashboardCard className="lg:col-span-2">
                        <DashboardCardHeader
                            title={
                                <span className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gold-400" />
                                    Bookings ({bookings.length})
                                </span>
                            }
                        />
                        <DashboardCardContent>
                            {bookings.length === 0 ? (
                                <p className="text-sm text-slate-400">No bookings yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {bookings.map((booking) => (
                                        <Link
                                            key={booking.id}
                                            href={route('admin.bookings.show', booking.route_key)}
                                            className={dashboardRowLinkClass()}
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="font-medium text-white">{booking.service ?? 'Service'}</p>
                                                    <p className="text-sm text-slate-400">{booking.vehicle} · {booking.scheduled_at}</p>
                                                </div>
                                                <StatusPill status={booking.status} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </DashboardCardContent>
                    </DashboardCard>
                </div>
            </div>
        </AdminLayout>
    );
}
