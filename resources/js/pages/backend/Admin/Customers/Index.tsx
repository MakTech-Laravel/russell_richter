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
        <AdminLayout
            title="Customers"
            subtitle={`${customers.total} registered customer(s)`}
            actions={
                <Form action={route('admin.customers.index')} method="get" className="flex w-full max-w-md gap-2">
                    <Input
                        name="search"
                        defaultValue={filters.search}
                        placeholder="Search name, email, phone..."
                        className={dashboardInputClass()}
                    />
                    <button type="submit" className="ml-btn-outline inline-flex shrink-0">
                        <Search className="h-4 w-4" />
                    </button>
                </Form>
            }
        >
            <Head title="Customers" />

            <DashboardCard>
                <DashboardCardHeader title="Customer List" />
                <DashboardCardContent>
                    {customers.data.length === 0 ? (
                        <p className="text-sm text-slate-400">No customers found.</p>
                    ) : (
                        <DashboardTable>
                            <thead>
                                <tr className={dashboardTableHeadClass()}>
                                    <th className="pb-3 pr-4">Name</th>
                                    <th className="pb-3 pr-4">Email</th>
                                    <th className="pb-3 pr-4">Phone</th>
                                    <th className="pb-3 pr-4">City</th>
                                    <th className="pb-3 pr-4">Vehicles</th>
                                    <th className="pb-3 pr-4">Bookings</th>
                                    <th className="pb-3">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.data.map((customer) => (
                                    <tr key={customer.id} className={dashboardTableRowClass()}>
                                        <td className="py-3 pr-4">
                                            <Link href={route('admin.customers.show', customer.id)} className="font-medium text-gold-400 hover:underline">
                                                {customer.name}
                                            </Link>
                                        </td>
                                        <td className="py-3 pr-4 text-slate-400">{customer.email}</td>
                                        <td className="py-3 pr-4 text-slate-400">{customer.phone ?? '—'}</td>
                                        <td className="py-3 pr-4 text-slate-400">{customer.city ?? '—'}</td>
                                        <td className="py-3 pr-4 text-slate-400">{customer.vehicles_count}</td>
                                        <td className="py-3 pr-4 text-slate-400">{customer.bookings_count}</td>
                                        <td className="py-3 text-slate-400">{customer.created_at ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </DashboardTable>
                    )}

                    {customers.last_page > 1 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {customers.links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        preserveScroll
                                        className={link.active ? 'ml-btn-primary ml-btn-sm' : 'ml-btn-outline ml-btn-sm'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="ml-btn-outline ml-btn-sm cursor-not-allowed opacity-40"
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
