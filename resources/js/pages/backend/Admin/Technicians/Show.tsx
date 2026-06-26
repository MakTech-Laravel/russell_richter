import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    StatusPill,
    dashboardRowLinkClass,
} from '@/components/dashboard/dashboard-ui';
import AdminLayout from '@/layouts/admin-layout';

interface Technician {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    is_active: boolean;
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
    technician: Technician;
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

export default function Show({ technician, bookings }: ShowProps) {
    const fullAddress = [technician.address, technician.city, technician.state, technician.zip]
        .filter(Boolean)
        .join(', ');

    return (
        <AdminLayout
            title={technician.name}
            subtitle={technician.is_active ? 'Active Technician' : 'Inactive Technician'}
        >
            <Head title={technician.name} />

            <div className="mx-auto max-w-4xl space-y-4">
                <Link
                    href={route('admin.technicians.index')}
                    className="inline-flex items-center gap-1 text-sm text-gold-400 hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to technicians
                </Link>

                <div className="grid gap-6 lg:grid-cols-2">
                    <DashboardCard>
                        <DashboardCardHeader title="Contact Information" />
                        <DashboardCardContent>
                            <DetailRow label="Email" value={technician.email} />
                            <DetailRow label="Phone" value={technician.phone} />
                            <DetailRow label="Status" value={technician.is_active ? 'Active' : 'Inactive'} />
                        </DashboardCardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <DashboardCardHeader
                            title={
                                <span className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gold-400" />
                                    Location
                                </span>
                            }
                        />
                        <DashboardCardContent>
                            {fullAddress ? (
                                <>
                                    <DetailRow label="Address" value={technician.address} />
                                    <DetailRow label="City" value={technician.city} />
                                    <DetailRow label="State" value={technician.state} />
                                    <DetailRow label="Zip" value={technician.zip} />
                                </>
                            ) : (
                                <p className="text-sm text-slate-400">No address on file.</p>
                            )}
                        </DashboardCardContent>
                    </DashboardCard>

                    <DashboardCard className="lg:col-span-2">
                        <DashboardCardHeader
                            title={
                                <span className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gold-400" />
                                    Assigned Bookings ({bookings.length})
                                </span>
                            }
                        />
                        <DashboardCardContent>
                            {bookings.length === 0 ? (
                                <p className="text-sm text-slate-400">No bookings assigned yet.</p>
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
                                                    <p className="font-medium text-white">
                                                        {booking.service ?? 'Service'}
                                                    </p>
                                                    <p className="text-sm text-slate-400">
                                                        {booking.vehicle} · {booking.scheduled_at}
                                                    </p>
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
