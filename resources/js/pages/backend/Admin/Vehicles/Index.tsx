import { Form, Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <AdminLayout>
            <Head title="Vehicles" />

            <div className="bg-white px-4 py-8 text-gray-900">
                <div className="container mx-auto">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">All Vehicles</h1>
                            <p className="text-gray-500">{vehicles.total} vehicle(s) registered</p>
                        </div>
                        <Form action={route('admin.vehicles.index')} method="get" className="flex w-full max-w-md gap-2">
                            <Input
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Search VIN, make, model..."
                                className="border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                            />
                            <Button type="submit" variant="outline" className="shrink-0 border-amber-200 text-gray-900 hover:bg-amber-50">
                                <Search className="size-4" />
                            </Button>
                        </Form>
                    </div>

                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader><CardTitle>Vehicle Registry</CardTitle></CardHeader>
                        <CardContent>
                            {vehicles.data.length === 0 ? (
                                <p className="text-sm text-gray-400">No vehicles found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-left text-gray-500">
                                                <th className="pb-3 pr-4 font-medium">Vehicle</th>
                                                <th className="pb-3 pr-4 font-medium">VIN</th>
                                                <th className="pb-3 pr-4 font-medium">Mileage</th>
                                                <th className="pb-3 pr-4 font-medium">Customer</th>
                                                <th className="pb-3 font-medium">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vehicles.data.map((vehicle) => (
                                                <tr key={vehicle.id} className="border-b border-ml-gold/5 last:border-0">
                                                    <td className="py-3 pr-4 font-medium">{vehicle.display_name}</td>
                                                    <td className="py-3 pr-4 font-mono text-xs text-gray-600">{vehicle.vin}</td>
                                                    <td className="py-3 pr-4 text-gray-600">
                                                        {vehicle.mileage != null ? `${vehicle.mileage.toLocaleString()} mi` : '—'}
                                                    </td>
                                                    <td className="py-3 pr-4 text-gray-600">{vehicle.customer ?? '—'}</td>
                                                    <td className="py-3 text-gray-600">{vehicle.customer_email ?? '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {vehicles.last_page > 1 && (
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {vehicles.links.map((link, index) => (
                                        link.url ? (
                                            <Button
                                                key={index}
                                                asChild
                                                size="sm"
                                                variant={link.active ? 'default' : 'outline'}
                                                className={link.active ? 'ml-gold-gradient border-0 text-ml-black' : 'border-amber-200 text-gray-900 hover:bg-amber-50'}
                                            >
                                                <Link href={link.url} preserveScroll dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Button>
                                        ) : (
                                            <Button key={index} size="sm" variant="outline" disabled className="border-amber-200 text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
