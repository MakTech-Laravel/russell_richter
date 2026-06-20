import { Form, Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardTable,
    dashboardInputClass,
    dashboardTableHeadClass,
    dashboardTableRowClass,
} from '@/components/dashboard/dashboard-ui';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';

interface VehicleRow {
    id: number;
    display_name: string;
    vin: string;
    mileage: number | null;
    customer: string | null;
    customer_email: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedVehicles {
    data: VehicleRow[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface IndexProps {
    vehicles: PaginatedVehicles;
    filters: { search: string };
}

export default function Index({ vehicles, filters }: IndexProps) {
    return (
        <AdminLayout
            title="All Vehicles"
            subtitle={`${vehicles.total} vehicle(s) registered`}
            actions={
                <Form action={route('admin.vehicles.index')} method="get" className="flex w-full max-w-md gap-2">
                    <Input
                        name="search"
                        defaultValue={filters.search}
                        placeholder="Search VIN, make, model..."
                        className={dashboardInputClass()}
                    />
                    <button type="submit" className="ml-btn-outline inline-flex shrink-0">
                        <Search className="h-4 w-4" />
                    </button>
                </Form>
            }
        >
            <Head title="Vehicles" />

            <DashboardCard>
                <DashboardCardHeader title="Vehicle Registry" />
                <DashboardCardContent>
                    {vehicles.data.length === 0 ? (
                        <p className="text-sm text-slate-400">No vehicles found.</p>
                    ) : (
                        <DashboardTable>
                            <thead>
                                <tr className={dashboardTableHeadClass()}>
                                    <th className="pb-3 pr-4">Vehicle</th>
                                    <th className="pb-3 pr-4">VIN</th>
                                    <th className="pb-3 pr-4">Mileage</th>
                                    <th className="pb-3 pr-4">Customer</th>
                                    <th className="pb-3">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.data.map((vehicle) => (
                                    <tr key={vehicle.id} className={dashboardTableRowClass()}>
                                        <td className="py-3 pr-4 font-medium text-white">{vehicle.display_name}</td>
                                        <td className="py-3 pr-4 font-mono text-xs text-slate-400">{vehicle.vin}</td>
                                        <td className="py-3 pr-4 text-slate-400">
                                            {vehicle.mileage != null ? `${vehicle.mileage.toLocaleString()} mi` : '—'}
                                        </td>
                                        <td className="py-3 pr-4 text-slate-400">{vehicle.customer ?? '—'}</td>
                                        <td className="py-3 text-slate-400">{vehicle.customer_email ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </DashboardTable>
                    )}

                    {vehicles.last_page > 1 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {vehicles.links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        preserveScroll
                                        className={link.active ? 'ml-btn-primary px-3 py-1.5 text-xs' : 'ml-btn-outline px-3 py-1.5 text-xs'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="ml-btn-outline cursor-not-allowed px-3 py-1.5 text-xs opacity-40"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ),
                            )}
                        </div>
                    )}
                </DashboardCardContent>
            </DashboardCard>
        </AdminLayout>
    );
}
