import { Form, Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, User } from 'lucide-react';
import { useState } from 'react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardEmptyState,
    DashboardTable,
    StatusPill,
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
import { cn } from '@/lib/utils';

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

type ModalState =
    | { mode: 'create' }
    | { mode: 'edit'; technician: Technician };

function AddTechnicianButton({
    onClick,
    size = 'default',
}: {
    onClick: () => void;
    size?: 'default' | 'large';
}) {
    const isLarge = size === 'large';

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-gold-400/35 font-bold uppercase tracking-[0.14em] text-ink-900',
                'bg-gradient-to-b from-[#ffe08a] via-gold-400 to-[#c97a00]',
                'shadow-[0_4px_18px_-4px_rgba(255,184,32,0.55),inset_0_1px_0_rgba(255,255,255,0.45)]',
                'transition-all duration-200 hover:-translate-y-px hover:border-gold-300/60',
                'hover:shadow-[0_10px_28px_-6px_rgba(255,184,32,0.7),inset_0_1px_0_rgba(255,255,255,0.55)]',
                'active:translate-y-0 active:shadow-[0_4px_14px_-4px_rgba(255,184,32,0.5)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900',
                isLarge ? 'h-12 px-6 text-sm' : 'h-10 px-4 text-[11px]',
            )}
        >
            <span
                className={cn(
                    'relative flex shrink-0 items-center justify-center rounded-lg bg-ink-900/15 ring-1 ring-ink-900/10 transition group-hover:bg-ink-900/20',
                    isLarge ? 'h-7 w-7' : 'h-6 w-6',
                )}
            >
                <Plus className={cn(isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5')} strokeWidth={2.5} />
            </span>
            <span className="relative whitespace-nowrap">
                {isLarge ? 'Add Technician' : (
                    <>
                        <span className="hidden sm:inline">Add Technician</span>
                        <span className="sm:hidden">Add</span>
                    </>
                )}
            </span>
        </button>
    );
}

function TechnicianFormFields({
    technician,
    errors,
}: {
    technician?: Technician;
    errors: Record<string, string>;
}) {
    const isCreate = !technician;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="name" className={dashboardLabelClass()}>Name</label>
                <Input
                    id="name"
                    name="name"
                    required
                    defaultValue={technician?.name}
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
                    defaultValue={technician?.email}
                    className={dashboardInputClass()}
                />
                <InputError message={errors.email} />
            </div>
            <div className="space-y-2">
                <label htmlFor="phone" className={dashboardLabelClass()}>Phone</label>
                <Input
                    id="phone"
                    name="phone"
                    defaultValue={technician?.phone ?? ''}
                    className={dashboardInputClass()}
                />
                <InputError message={errors.phone} />
            </div>
            <div className="space-y-2">
                <label htmlFor="password" className={dashboardLabelClass()}>
                    Password {isCreate ? '' : '(leave blank to keep current)'}
                </label>
                <PasswordInput
                    id="password"
                    name="password"
                    required={isCreate}
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
                    required={isCreate}
                    className={dashboardInputClass()}
                />
                <InputError message={errors.password_confirmation} />
            </div>
            {!isCreate && (
                <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                        type="checkbox"
                        name="is_active"
                        value="1"
                        defaultChecked={technician?.is_active}
                        className="rounded border-white/20"
                    />
                    Active
                </label>
            )}
        </div>
    );
}

function TechnicianModal({
    state,
    onClose,
}: {
    state: ModalState;
    onClose: () => void;
}) {
    const isEdit = state.mode === 'edit';
    const technician = isEdit ? state.technician : undefined;

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-ink-900 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {isEdit ? 'Edit Technician' : 'Add Technician'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {isEdit
                            ? 'Update technician details and portal access.'
                            : 'Create a new field technician account for job assignments.'}
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action={
                        isEdit
                            ? route('admin.technicians.update', technician!.id)
                            : route('admin.technicians.store')
                    }
                    method="post"
                    className="space-y-5"
                    resetOnSuccess={['password', 'password_confirmation']}
                    onSuccess={onClose}
                >
                    {({ processing, errors }) => (
                        <>
                            {isEdit && <input type="hidden" name="_method" value="patch" />}
                            <TechnicianFormFields technician={technician} errors={errors} />
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="ml-btn-primary inline-flex flex-1 justify-center"
                                >
                                    {processing
                                        ? 'Saving...'
                                        : isEdit
                                            ? 'Save Changes'
                                            : 'Create Technician'}
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

function TechnicianRowActions({
    technician,
    onEdit,
}: {
    technician: Technician;
    onEdit: (technician: Technician) => void;
}) {
    return (
        <div className="flex items-center justify-end gap-1.5">
            <button
                type="button"
                onClick={() => onEdit(technician)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:border-gold-500/40 hover:text-gold-400"
                aria-label={`Edit ${technician.name}`}
            >
                <Pencil className="h-3.5 w-3.5" />
            </button>
            {technician.bookings_count === 0 && (
                <button
                    type="button"
                    onClick={() => {
                        if (confirm('Delete this technician?')) {
                            router.delete(route('admin.technicians.destroy', technician.id));
                        }
                    }}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 text-red-400 transition hover:bg-red-500/10"
                    aria-label={`Delete ${technician.name}`}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}

export default function Index({ technicians }: IndexProps) {
    const [modal, setModal] = useState<ModalState | null>(null);

    return (
        <AdminLayout
            title="Technicians"
            subtitle={`${technicians.length} field technician(s)`}
            actions={<AddTechnicianButton onClick={() => setModal({ mode: 'create' })} />}
        >
            <Head title="Technicians" />

            {technicians.length === 0 ? (
                <DashboardEmptyState
                    icon={User}
                    title="No technicians yet"
                    description="Add your first field technician to start assigning bookings."
                    action={<AddTechnicianButton size="large" onClick={() => setModal({ mode: 'create' })} />}
                />
            ) : (
                <DashboardCard>
                    <DashboardCardHeader title="Technician List" />
                    <DashboardCardContent>
                        <DashboardTable>
                            <thead>
                                <tr className={dashboardTableHeadClass()}>
                                    <th className="pb-3 pr-4">Name</th>
                                    <th className="pb-3 pr-4">Email</th>
                                    <th className="pb-3 pr-4">Phone</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3 pr-4">Bookings</th>
                                    <th className="pb-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {technicians.map((technician) => (
                                    <tr key={technician.id} className={dashboardTableRowClass()}>
                                        <td className="py-3 pr-4 font-medium text-white">{technician.name}</td>
                                        <td className="py-3 pr-4 text-slate-400">{technician.email}</td>
                                        <td className="py-3 pr-4 text-slate-400">{technician.phone ?? '—'}</td>
                                        <td className="py-3 pr-4">
                                            <StatusPill
                                                status={technician.is_active ? 'completed' : 'cancelled'}
                                                label={technician.is_active ? 'Active' : 'Inactive'}
                                            />
                                        </td>
                                        <td className="py-3 pr-4 text-slate-400">{technician.bookings_count}</td>
                                        <td className="py-3 text-right">
                                            <TechnicianRowActions
                                                technician={technician}
                                                onEdit={(item) => setModal({ mode: 'edit', technician: item })}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </DashboardTable>
                    </DashboardCardContent>
                </DashboardCard>
            )}

            {modal && <TechnicianModal state={modal} onClose={() => setModal(null)} />}
        </AdminLayout>
    );
}
