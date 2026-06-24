import { Form, Head, router } from '@inertiajs/react';
import { Check, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
    DashboardEmptyState,
    StatusPill,
    dashboardInputClass,
    dashboardLabelClass,
    dashboardSelectClass,
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
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

interface ServiceItem {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    service_type: string;
    service_type_label: string;
    base_price: string | number;
    price_label: string | null;
    included_quarts: number;
    additional_quart_price: string | number | null;
    features: string[];
    addon_note: string | null;
    is_popular: boolean;
    is_active: boolean;
    sort_order: number;
    bookings_count: number;
}

interface IndexProps {
    services: ServiceItem[];
}

type ModalState =
    | { mode: 'create' }
    | { mode: 'edit'; service: ServiceItem };

function featuresToText(features: string[]): string {
    return features.join('\n');
}

function ServiceFormFields({
    service,
    errors,
}: {
    service?: ServiceItem;
    errors: Record<string, string>;
}) {
    const isCreate = !service;

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="name" className={dashboardLabelClass()}>
                        Name
                    </label>
                    <Input
                        id="name"
                        name="name"
                        required
                        defaultValue={service?.name}
                        className={dashboardInputClass()}
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="service_type" className={dashboardLabelClass()}>
                        Type
                    </label>
                    <select
                        id="service_type"
                        name="service_type"
                        className={dashboardSelectClass()}
                        defaultValue={service?.service_type ?? 'package'}
                    >
                        <option value="package">Package</option>
                        <option value="addon">Add-on</option>
                    </select>
                    <InputError message={errors.service_type} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="base_price" className={dashboardLabelClass()}>
                        Base Price ($)
                    </label>
                    <Input
                        id="base_price"
                        name="base_price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        defaultValue={service?.base_price}
                        className={dashboardInputClass()}
                    />
                    <InputError message={errors.base_price} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="price_label" className={dashboardLabelClass()}>
                        Price Label (add-ons)
                    </label>
                    <Input
                        id="price_label"
                        name="price_label"
                        placeholder="$25 install + filter cost"
                        defaultValue={service?.price_label ?? ''}
                        className={dashboardInputClass()}
                    />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="features" className={dashboardLabelClass()}>
                        Features (one per line)
                    </label>
                    <Textarea
                        id="features"
                        name="features"
                        rows={4}
                        defaultValue={service ? featuresToText(service.features) : ''}
                        className={dashboardInputClass()}
                    />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="addon_note" className={dashboardLabelClass()}>
                        Add-on Note
                    </label>
                    <Input
                        id="addon_note"
                        name="addon_note"
                        defaultValue={service?.addon_note ?? ''}
                        className={dashboardInputClass()}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="sort_order" className={dashboardLabelClass()}>
                        Sort Order
                    </label>
                    <Input
                        id="sort_order"
                        name="sort_order"
                        type="number"
                        min="0"
                        defaultValue={service?.sort_order ?? 0}
                        className={dashboardInputClass()}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="included_quarts" className={dashboardLabelClass()}>
                        Included Quarts
                    </label>
                    <Input
                        id="included_quarts"
                        name="included_quarts"
                        type="number"
                        min="0"
                        defaultValue={service?.included_quarts ?? 6}
                        className={dashboardInputClass()}
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-5 pt-1">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                        type="checkbox"
                        name="is_popular"
                        value="1"
                        defaultChecked={service?.is_popular ?? false}
                        className="rounded border-white/20"
                    />
                    Most Popular
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                        type="checkbox"
                        name="is_active"
                        value="1"
                        defaultChecked={isCreate ? true : service?.is_active}
                        className="rounded border-white/20"
                    />
                    Active
                </label>
            </div>
        </>
    );
}

function ServicePackageModal({
    state,
    onClose,
}: {
    state: ModalState;
    onClose: () => void;
}) {
    const isEdit = state.mode === 'edit';
    const service = isEdit ? state.service : undefined;

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-ink-900 text-white sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {isEdit ? 'Edit Service' : 'Add Service'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {isEdit
                            ? 'Update package details shown on the website and booking flow.'
                            : 'Create a new pricing package or add-on for the website.'}
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action={
                        isEdit
                            ? route('admin.services.update', service!.id)
                            : route('admin.services.store')
                    }
                    method="post"
                    className="space-y-5"
                    onSuccess={onClose}
                >
                    {({ processing, errors }) => (
                        <>
                            {isEdit && <input type="hidden" name="_method" value="patch" />}
                            <ServiceFormFields service={service} errors={errors} />
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
                                            : 'Create Service'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="ml-btn-outline inline-flex px-5"
                                >
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

function AddServiceButton({
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
                {isLarge ? 'Add Service' : (
                    <>
                        <span className="hidden sm:inline">Add Service</span>
                        <span className="sm:hidden">Add</span>
                    </>
                )}
            </span>
        </button>
    );
}

function ServicePackageCard({
    service,
    onEdit,
}: {
    service: ServiceItem;
    onEdit: (service: ServiceItem) => void;
}) {
    return (
        <article
            className={cn(
                'flex h-full flex-col overflow-hidden rounded-2xl border bg-ink-900/50 shadow-lg shadow-black/20 transition hover:border-white/15',
                service.is_popular
                    ? 'border-gold-500/40 ring-1 ring-gold-500/20'
                    : 'border-white/5',
            )}
        >
            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <StatusPill status="pending" label={service.service_type_label} />
                            {service.is_popular && (
                                <StatusPill status="confirmed" label="Popular" />
                            )}
                            <StatusPill
                                status={service.is_active ? 'completed' : 'cancelled'}
                                label={service.is_active ? 'Active' : 'Inactive'}
                            />
                        </div>
                        <h3 className="mt-3 text-base font-bold text-white">{service.name}</h3>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                        <button
                            type="button"
                            onClick={() => onEdit(service)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:border-gold-500/40 hover:text-gold-400"
                            aria-label={`Edit ${service.name}`}
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        {service.bookings_count === 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Delete this service?')) {
                                        router.delete(route('admin.services.destroy', service.id));
                                    }
                                }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 text-red-400 transition hover:bg-red-500/10"
                                aria-label={`Delete ${service.name}`}
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <p className="mt-3 text-2xl font-black text-gold-300">
                    ${Number(service.base_price).toFixed(2)}
                    {service.price_label && (
                        <span className="ml-2 text-sm font-medium text-slate-400">
                            {service.price_label}
                        </span>
                    )}
                </p>

                {service.features.length > 0 && (
                    <ul className="mt-4 flex-1 space-y-1.5">
                        {service.features.slice(0, 5).map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-xs text-slate-400">
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" />
                                <span>{feature}</span>
                            </li>
                        ))}
                        {service.features.length > 5 && (
                            <li className="text-xs text-slate-500">
                                +{service.features.length - 5} more
                            </li>
                        )}
                    </ul>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-white/5 bg-ink-950/40 px-5 py-3">
                <span className="text-xs text-slate-500">{service.bookings_count} booking(s)</span>
                <button
                    type="button"
                    onClick={() => onEdit(service)}
                    className="text-xs font-semibold uppercase tracking-wider text-gold-400 hover:text-gold-300"
                >
                    Edit
                </button>
            </div>
        </article>
    );
}

export default function Index({ services }: IndexProps) {
    const [modal, setModal] = useState<ModalState | null>(null);

    return (
        <AdminLayout
            title="Service Packages"
            subtitle="Manage pricing packages and add-on services shown on the website."
            actions={<AddServiceButton onClick={() => setModal({ mode: 'create' })} />}
        >
            <Head title="Service Packages" />

            {services.length === 0 ? (
                <DashboardEmptyState
                    icon={Package}
                    title="No services yet"
                    description="Create your first pricing package or add-on to display on the website."
                    action={<AddServiceButton size="large" onClick={() => setModal({ mode: 'create' })} />}
                />
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {services.map((service) => (
                        <ServicePackageCard
                            key={service.id}
                            service={service}
                            onEdit={(item) => setModal({ mode: 'edit', service: item })}
                        />
                    ))}
                </div>
            )}

            {modal && <ServicePackageModal state={modal} onClose={() => setModal(null)} />}
        </AdminLayout>
    );
}
