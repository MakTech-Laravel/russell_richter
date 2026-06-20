import { Form, Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    StatusPill,
    dashboardInputClass,
    dashboardLabelClass,
} from '@/components/dashboard/dashboard-ui';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import AdminLayout from '@/layouts/admin-layout';

interface Technician {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    bookings_count: number;
}

interface IndexProps {
    technicians: Technician[];
}

export default function Index({ technicians }: IndexProps) {
    return (
        <AdminLayout
            title="Technicians"
            subtitle="Manage field technicians and assignments."
        >
            <Head title="Technicians" />

            <div className="grid gap-6 lg:grid-cols-3">
                <DashboardCard className="lg:col-span-1">
                    <DashboardCardHeader
                        title={
                            <span className="flex items-center gap-2">
                                <Plus className="h-4 w-4 text-gold-400" />
                                Add Technician
                            </span>
                        }
                    />
                    <DashboardCardContent>
                        <Form action={route('admin.technicians.store')} method="post" className="space-y-4">
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <label htmlFor="name" className={dashboardLabelClass()}>Name</label>
                                        <Input id="name" name="name" required className={dashboardInputClass()} />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className={dashboardLabelClass()}>Email</label>
                                        <Input id="email" name="email" type="email" required className={dashboardInputClass()} />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className={dashboardLabelClass()}>Phone</label>
                                        <Input id="phone" name="phone" className={dashboardInputClass()} />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="password" className={dashboardLabelClass()}>Password</label>
                                        <PasswordInput id="password" name="password" required className={dashboardInputClass()} />
                                        <InputError message={errors.password} />
                                    </div>
                                    <button type="submit" disabled={processing} className="ml-btn-primary inline-flex w-full justify-center">
                                        {processing ? 'Creating...' : 'Create Technician'}
                                    </button>
                                </>
                            )}
                        </Form>
                    </DashboardCardContent>
                </DashboardCard>

                <DashboardCard className="lg:col-span-2">
                    <DashboardCardHeader title="Technician List" />
                    <DashboardCardContent>
                        {technicians.length === 0 ? (
                            <p className="text-sm text-slate-400">No technicians yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {technicians.map((tech) => (
                                    <div key={tech.id} className="flex flex-col gap-3 rounded-xl border border-white/5 bg-ink-900/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-white">{tech.name}</p>
                                                <StatusPill
                                                    status={tech.is_active ? 'completed' : 'cancelled'}
                                                    label={tech.is_active ? 'Active' : 'Inactive'}
                                                />
                                            </div>
                                            <p className="text-sm text-slate-400">{tech.email}</p>
                                            {tech.phone && <p className="text-xs text-slate-500">{tech.phone}</p>}
                                            <p className="mt-1 text-xs text-gold-400">{tech.bookings_count} booking(s)</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </DashboardCardContent>
                </DashboardCard>
            </div>
        </AdminLayout>
    );
}
