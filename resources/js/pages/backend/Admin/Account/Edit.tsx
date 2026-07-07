import { Form, Head, usePage } from '@inertiajs/react';
import { KeyRound, User } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    dashboardInputClass,
    dashboardLabelClass,
} from '@/components/dashboard/dashboard-ui';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import AdminLayout from '@/layouts/admin-layout';
import { type SharedData } from '@/types';

interface AdminAccount {
    name: string;
    email: string;
}

interface EditProps {
    admin: AdminAccount;
}

export default function Edit({ admin }: EditProps) {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

    return (
        <AdminLayout title="Account" subtitle="Manage your admin profile and security">
            <Head title="Account Settings" />

            <div className="mx-auto max-w-2xl space-y-6">
                <DashboardCard>
                    <DashboardCardHeader
                        title={
                            <span className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gold-400" />
                                Profile Information
                            </span>
                        }
                    />
                    <DashboardCardContent>
                        <Form
                            action={route('admin.account.update')}
                            method="post"
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <input type="hidden" name="_method" value="patch" />
                                    <div className="space-y-2">
                                        <label htmlFor="name" className={dashboardLabelClass()}>Name</label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            defaultValue={admin.name}
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
                                            defaultValue={admin.email}
                                            className={dashboardInputClass()}
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="ml-btn-primary inline-flex"
                                    >
                                        {processing ? 'Saving...' : 'Save Profile'}
                                    </button>
                                </>
                            )}
                        </Form>
                    </DashboardCardContent>
                </DashboardCard>

                <DashboardCard>
                    <DashboardCardHeader
                        title={
                            <span className="flex items-center gap-2">
                                <KeyRound className="h-4 w-4 text-gold-400" />
                                Change Password
                            </span>
                        }
                    />
                    <DashboardCardContent>
                        <Form
                            action={route('admin.account.password.update')}
                            method="post"
                            className="space-y-5"
                            resetOnSuccess
                        >
                            {({ processing, errors }) => (
                                <>
                                    <input type="hidden" name="_method" value="put" />
                                    <div className="space-y-2">
                                        <label htmlFor="password" className={dashboardLabelClass()}>
                                            New Password
                                        </label>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            autoComplete="new-password"
                                            className={dashboardInputClass()}
                                        />
                                        <InputError message={errors.password} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="password_confirmation" className={dashboardLabelClass()}>
                                            Confirm New Password
                                        </label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            required
                                            autoComplete="new-password"
                                            className={dashboardInputClass()}
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="ml-btn-primary inline-flex"
                                    >
                                        {processing ? 'Updating...' : 'Update Password'}
                                    </button>
                                </>
                            )}
                        </Form>
                    </DashboardCardContent>
                </DashboardCard>
            </div>
        </AdminLayout>
    );
}
