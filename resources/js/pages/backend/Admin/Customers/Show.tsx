import { Form, Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Car, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    StatusPill,
    dashboardInputClass,
    dashboardLabelClass,
    dashboardRowLinkClass,
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

function CustomerEditModal({
    customer,
    onClose,
}: {
    customer: Customer;
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
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className={dashboardLabelClass()}>Name</label>
                                    <Input id="name" name="name" required defaultValue={customer.name} className={dashboardInputClass()} />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className={dashboardLabelClass()}>Email</label>
                                    <Input id="email" name="email" type="email" required defaultValue={customer.email} className={dashboardInputClass()} />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className={dashboardLabelClass()}>Phone</label>
                                    <Input id="phone" name="phone" defaultValue={customer.phone ?? ''} className={dashboardInputClass()} />
                                    <InputError message={errors.phone} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="address_line" className={dashboardLabelClass()}>Address</label>
                                    <Input id="address_line" name="address_line" defaultValue={customer.address_line ?? ''} className={dashboardInputClass()} />
                                    <InputError message={errors.address_line} />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-1 space-y-2">
                                        <label htmlFor="city" className={dashboardLabelClass()}>City</label>
                                        <Input id="city" name="city" defaultValue={customer.city ?? ''} className={dashboardInputClass()} />
                                        <InputError message={errors.city} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="state" className={dashboardLabelClass()}>State</label>
                                        <Input id="state" name="state" defaultValue={customer.state ?? ''} className={dashboardInputClass()} />
                                        <InputError message={errors.state} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="zip" className={dashboardLabelClass()}>Zip</label>
                                        <Input id="zip" name="zip" defaultValue={customer.zip ?? ''} className={dashboardInputClass()} />
                                        <InputError message={errors.zip} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="password" className={dashboardLabelClass()}>
                                        New Password (leave blank to keep current)
                                    </label>
                                    <PasswordInput id="password" name="password" className={dashboardInputClass()} />
                                    <InputError message={errors.password} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="password_confirmation" className={dashboardLabelClass()}>
                                        Confirm Password
                                    </label>
                                    <PasswordInput id="password_confirmation" name="password_confirmation" className={dashboardInputClass()} />
                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button type="submit" disabled={processing} className="ml-btn-primary inline-flex flex-1 justify-center">
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

export default function Show({ customer, vehicles, bookings }: ShowProps) {
    const [editing, setEditing] = useState(false);
    const fullAddress = [customer.address_line, customer.city, customer.state, customer.zip].filter(Boolean).join(', ');

    const handleDelete = (): void => {
        if (confirm(`Delete ${customer.name}? This will also remove their vehicles and bookings.`)) {
            router.delete(route('admin.customers.destroy', customer.id));
        }
    };

    return (
        <AdminLayout
            title={customer.name}
            subtitle={customer.email}
            actions={
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setEditing(true)} className="ml-btn-outline ml-btn-sm inline-flex">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </button>
                    <button type="button" onClick={handleDelete} className="ml-btn-outline ml-btn-sm inline-flex text-rose-400 hover:border-rose-500/40 hover:text-rose-300">
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                    </button>
                </div>
            }
        >
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

            {editing && <CustomerEditModal customer={customer} onClose={() => setEditing(false)} />}
        </AdminLayout>
    );
}
