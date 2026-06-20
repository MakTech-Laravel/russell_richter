import { Form, Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';

interface CustomerRow {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
    vehicles_count: number;
    bookings_count: number;
    created_at: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCustomers {
    data: CustomerRow[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface IndexProps {
    customers: PaginatedCustomers;
    filters: { search: string };
}

export default function Index({ customers, filters }: IndexProps) {
    return (
        <AdminLayout>
            <Head title="Customers" />

            <div className="bg-white px-4 py-8 text-gray-900">
                <div className="container mx-auto">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Customers</h1>
                            <p className="text-gray-500">{customers.total} registered customer(s)</p>
                        </div>
                        <Form
                            action={route('admin.customers.index')}
                            method="get"
                            className="flex w-full max-w-md gap-2"
                        >
                            <Input
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Search name, email, phone..."
                                className="border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                            />
                            <Button type="submit" variant="outline" className="shrink-0 border-amber-200 text-gray-900 hover:bg-amber-50">
                                <Search className="size-4" />
                            </Button>
                        </Form>
                    </div>

                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader>
                            <CardTitle>Customer List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {customers.data.length === 0 ? (
                                <p className="text-sm text-gray-400">No customers found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-left text-gray-500">
                                                <th className="pb-3 pr-4 font-medium">Name</th>
                                                <th className="pb-3 pr-4 font-medium">Email</th>
                                                <th className="pb-3 pr-4 font-medium">Phone</th>
                                                <th className="pb-3 pr-4 font-medium">City</th>
                                                <th className="pb-3 pr-4 font-medium">Vehicles</th>
                                                <th className="pb-3 pr-4 font-medium">Bookings</th>
                                                <th className="pb-3 font-medium">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customers.data.map((customer) => (
                                                <tr key={customer.id} className="border-b border-ml-gold/5 last:border-0">
                                                    <td className="py-3 pr-4">
                                                        <Link href={route('admin.customers.show', customer.id)} className="font-medium text-ml-gold hover:underline">
                                                            {customer.name}
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 pr-4 text-gray-600">{customer.email}</td>
                                                    <td className="py-3 pr-4 text-gray-600">{customer.phone ?? '—'}</td>
                                                    <td className="py-3 pr-4 text-gray-600">{customer.city ?? '—'}</td>
                                                    <td className="py-3 pr-4 text-gray-600">{customer.vehicles_count}</td>
                                                    <td className="py-3 pr-4 text-gray-600">{customer.bookings_count}</td>
                                                    <td className="py-3 text-gray-600">{customer.created_at ?? '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {customers.last_page > 1 && (
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {customers.links.map((link, index) => (
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
