import { Form, Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardTable,
    dashboardInputClass,
    dashboardLabelClass,
    dashboardTableHeadClass,
    dashboardTableRowClass,
} from '@/components/dashboard/dashboard-ui';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import AdminLayout from '@/layouts/admin-layout';

interface CustomerRow {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address_line: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
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

function CustomerFormFields({
    customer,
    errors,
}: {
    customer: CustomerRow;
    errors: Record<string, string>;
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="name" className={dashboardLabelClass()}>Name</label>
                <Input
                    id="name"
                    name="name"
                    required
                    defaultValue={customer.name}
                    className={dashboardInputClass()}
                />
                <InputError message={errors.name} />
            </div>
            <div className="space-y-2">
                <label htmlFor="email" className={dashboardLabelClass()}>Email</label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    defaultValue={customer.email}
                    className={dashboardInputClass()}
                />
                <InputError message={errors.email} />
            </div>
            <div className="space-y-2">
                <label htmlFor="phone" className={dashboardLabelClass()}>Phone</label>
                <Input
                    id="phone"
                    name="phone"
                    defaultValue={customer.phone ?? ''}
                    className={dashboardInputClass()}
                />
                <InputError message={errors.phone} />
            </div>
            <div className="space-y-2">
                <label htmlFor="address_line" className={dashboardLabelClass()}>Address</label>
                <Input
                    id="address_line"
                    name="address_line"
                    defaultValue={customer.address_line ?? ''}
                    className={dashboardInputClass()}
                />
                <InputError message={errors.address_line} />
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-2">
                    <label htmlFor="city" className={dashboardLabelClass()}>City</label>
                    <Input
                        id="city"
                        name="city"
                        defaultValue={customer.city ?? ''}
                        className={dashboardInputClass()}
                    />
                    <InputError message={errors.city} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="state" className={dashboardLabelClass()}>State</label>
                    <Input
                        id="state"
                        name="state"
                        defaultValue={customer.state ?? ''}
                        className={dashboardInputClass()}
                    />
                    <InputError message={errors.state} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="zip" className={dashboardLabelClass()}>Zip</label>
                    <Input
                        id="zip"
                        name="zip"
                        defaultValue={customer.zip ?? ''}
                        className={dashboardInputClass()}
                    />
                    <InputError message={errors.zip} />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="password" className={dashboardLabelClass()}>
                    New Password (leave blank to keep current)
                </label>
                <PasswordInput
                    id="password"
                    name="password"
                    className={dashboardInputClass()}
                />
                <InputError message={errors.password} />
            </div>
            <div className="space-y-2">
                <label htmlFor="password_confirmation" className={dashboardLabelClass()}>
                    Confirm Password
                </label>
                <PasswordInput
                    id="password_confirmation"
                    name="password_confirmation"
                    className={dashboardInputClass()}
                />
                <InputError message={errors.password_confirmation} />
            </div>
        </div>
    );
}

function CustomerEditModal({
    customer,
    onClose,
}: {
    customer: CustomerRow;
    onClose: () => void;
}) {
    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-ink-900 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">Edit Customer</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Update customer details or reset their portal password.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action={route('admin.customers.update', customer.id)}
                    method="post"
                    className="space-y-5"
                    resetOnSuccess={['password', 'password_confirmation']}
                    onSuccess={onClose}
                >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="_method" value="patch" />
                            <CustomerFormFields customer={customer} errors={errors} />
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="ml-btn-primary inline-flex flex-1 justify-center"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" onClick={onClose} className="ml-btn-outline inline-flex px-5">
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function CustomerRowActions({
    customer,
    onEdit,
}: {
    customer: CustomerRow;
    onEdit: (customer: CustomerRow) => void;
}) {
    return (
        <div className="flex items-center justify-end gap-1.5">
            <Link
                href={route('admin.customers.show', customer.id)}
                className="ml-btn-icon"
                aria-label={`View ${customer.name}`}
            >
                <Eye className="h-3.5 w-3.5" />
            </Link>
            <button
                type="button"
                onClick={() => onEdit(customer)}
                className="ml-btn-icon"
                aria-label={`Edit ${customer.name}`}
            >
                <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
                type="button"
                onClick={() => {
                    if (confirm(`Delete ${customer.name}? This will also remove their vehicles and bookings.`)) {
                        router.delete(route('admin.customers.destroy', customer.id));
                    }
                }}
                className="ml-btn-icon-danger"
                aria-label={`Delete ${customer.name}`}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

export default function Index({ customers, filters }: IndexProps) {
    const [editingCustomer, setEditingCustomer] = useState<CustomerRow | null>(null);

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
                                    <th className="pb-3 pr-4">Joined</th>
                                    <th className="pb-3 text-right">Actions</th>
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
                                        <td className="py-3 pr-4 text-slate-400">{customer.created_at ?? '—'}</td>
                                        <td className="py-3 text-right">
                                            <CustomerRowActions
                                                customer={customer}
                                                onEdit={setEditingCustomer}
                                            />
                                        </td>
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

            {editingCustomer && (
                <CustomerEditModal
                    customer={editingCustomer}
                    onClose={() => setEditingCustomer(null)}
                />
            )}
        </AdminLayout>
    );
}
