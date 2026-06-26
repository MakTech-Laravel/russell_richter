import { Form, Head, router } from '@inertiajs/react';
import { Database, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardEmptyState,
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
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

interface OilFitment {
    id: number;
    make: string;
    model: string;
    year_from: number;
    year_to: number;
    engine: string | null;
    oil_filter_part_no: string;
    oil_filter_brand: string | null;
    oil_grade: string;
    oil_capacity_quarts: string | number;
    supports_synthetic: boolean;
}

interface IndexProps {
    fitments: OilFitment[];
    filters: { search: string };
}

type ModalState =
    | { mode: 'create' }
    | { mode: 'edit'; fitment: OilFitment };

const OIL_GRADES = ['0W-16', '0W-20', '5W-20', '5W-30', '5W-40', '10W-30', '10W-40', '15W-40'];

function AddFitmentButton({ onClick, size = 'default' }: { onClick: () => void; size?: 'default' | 'large' }) {
    const isLarge = size === 'large';

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn('ml-btn-primary', isLarge ? 'ml-btn-lg' : 'ml-btn-sm')}
        >
            <Plus className={cn(isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5')} strokeWidth={2.5} />
            {isLarge ? 'Add Fitment' : (
                <>
                    <span className="hidden sm:inline">Add Fitment</span>
                    <span className="sm:hidden">Add</span>
                </>
            )}
        </button>
    );
}

function OilFitmentFormFields({ fitment, errors }: { fitment?: OilFitment; errors: Record<string, string> }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <label htmlFor="make" className={dashboardLabelClass()}>Make</label>
                    <Input id="make" name="make" required placeholder="Ford" defaultValue={fitment?.make} className={dashboardInputClass()} />
                    <InputError message={errors.make} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="model" className={dashboardLabelClass()}>Model</label>
                    <Input id="model" name="model" required placeholder="F-150" defaultValue={fitment?.model} className={dashboardInputClass()} />
                    <InputError message={errors.model} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <label htmlFor="year_from" className={dashboardLabelClass()}>Year From</label>
                    <Input id="year_from" name="year_from" type="number" required min={1990} max={2100} defaultValue={fitment?.year_from ?? new Date().getFullYear()} className={dashboardInputClass()} />
                    <InputError message={errors.year_from} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="year_to" className={dashboardLabelClass()}>Year To</label>
                    <Input id="year_to" name="year_to" type="number" required min={1990} max={2100} defaultValue={fitment?.year_to ?? new Date().getFullYear()} className={dashboardInputClass()} />
                    <InputError message={errors.year_to} />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="engine" className={dashboardLabelClass()}>
                    Engine <span className="text-slate-500">(leave blank = all engines)</span>
                </label>
                <Input id="engine" name="engine" placeholder="3.5L 6-Cylinder" defaultValue={fitment?.engine ?? ''} className={dashboardInputClass()} />
                <InputError message={errors.engine} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <label htmlFor="oil_filter_part_no" className={dashboardLabelClass()}>Filter Part #</label>
                    <Input id="oil_filter_part_no" name="oil_filter_part_no" required placeholder="FL-820-S" defaultValue={fitment?.oil_filter_part_no} className={cn(dashboardInputClass(), 'font-mono')} />
                    <InputError message={errors.oil_filter_part_no} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="oil_filter_brand" className={dashboardLabelClass()}>Filter Brand</label>
                    <Input id="oil_filter_brand" name="oil_filter_brand" placeholder="Motorcraft" defaultValue={fitment?.oil_filter_brand ?? ''} className={dashboardInputClass()} />
                    <InputError message={errors.oil_filter_brand} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <label htmlFor="oil_grade" className={dashboardLabelClass()}>Oil Grade</label>
                    <Input
                        id="oil_grade"
                        name="oil_grade"
                        required
                        list="oil-grades"
                        placeholder="5W-30"
                        defaultValue={fitment?.oil_grade}
                        className={dashboardInputClass()}
                    />
                    <datalist id="oil-grades">
                        {OIL_GRADES.map((g) => <option key={g} value={g} />)}
                    </datalist>
                    <InputError message={errors.oil_grade} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="oil_capacity_quarts" className={dashboardLabelClass()}>Capacity (qts)</label>
                    <Input id="oil_capacity_quarts" name="oil_capacity_quarts" type="number" required step="0.1" min="0.5" max="30" defaultValue={fitment?.oil_capacity_quarts ?? ''} className={dashboardInputClass()} />
                    <InputError message={errors.oil_capacity_quarts} />
                </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                    type="checkbox"
                    name="supports_synthetic"
                    value="1"
                    defaultChecked={fitment !== undefined ? fitment.supports_synthetic : true}
                    className="rounded border-white/20"
                />
                Supports full synthetic oil
            </label>
        </div>
    );
}

function OilFitmentModal({ state, onClose }: { state: ModalState; onClose: () => void }) {
    const isEdit = state.mode === 'edit';
    const fitment = isEdit ? state.fitment : undefined;

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-ink-900 text-white sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-white">{isEdit ? 'Edit Oil Fitment' : 'Add Oil Fitment'}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {isEdit
                            ? 'Update oil filter part number, grade, and capacity for this vehicle.'
                            : 'Add an oil fitment record so the recommendation engine can return exact part numbers.'}
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action={isEdit ? route('admin.oil-fitments.update', fitment!.id) : route('admin.oil-fitments.store')}
                    method="post"
                    className="space-y-5"
                    onSuccess={onClose}
                >
                    {({ processing, errors }) => (
                        <>
                            {isEdit && <input type="hidden" name="_method" value="patch" />}
                            <OilFitmentFormFields fitment={fitment} errors={errors} />
                            <div className="flex gap-3 pt-1">
                                <button type="submit" disabled={processing} className="ml-btn-primary inline-flex flex-1 justify-center">
                                    {processing ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Fitment'}
                                </button>
                                <button type="button" onClick={onClose} className="ml-btn-outline inline-flex px-5">Cancel</button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default function Index({ fitments, filters }: IndexProps) {
    const [modal, setModal] = useState<ModalState | null>(null);
    const [search, setSearch] = useState(filters.search);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('admin.oil-fitments.index'), { search }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout
            title="Oil Fitments"
            subtitle={`${fitments.length} vehicle fitment record(s) — used to auto-generate oil filter part numbers`}
            actions={<AddFitmentButton onClick={() => setModal({ mode: 'create' })} />}
        >
            <Head title="Oil Fitments" />

            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <div className="relative flex-1 max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search make, model, part #..."
                        className={cn(dashboardInputClass(), 'pl-9')}
                    />
                </div>
                <button type="submit" className="ml-btn-outline ml-btn-sm">Search</button>
                {filters.search && (
                    <button
                        type="button"
                        onClick={() => { setSearch(''); router.get(route('admin.oil-fitments.index')); }}
                        className="ml-btn-outline ml-btn-sm"
                    >
                        Clear
                    </button>
                )}
            </form>

            {fitments.length === 0 ? (
                <DashboardEmptyState
                    icon={Database}
                    title="No fitment records yet"
                    description="Add oil fitment records so the recommendation engine can return exact part numbers for vehicles."
                    action={<AddFitmentButton size="large" onClick={() => setModal({ mode: 'create' })} />}
                />
            ) : (
                <DashboardCard>
                    <DashboardCardHeader title="Fitment Records" />
                    <DashboardCardContent>
                        <div className="overflow-x-auto">
                            <DashboardTable>
                                <thead>
                                    <tr className={dashboardTableHeadClass()}>
                                        <th className="pb-3 pr-4">Make / Model</th>
                                        <th className="pb-3 pr-4">Years</th>
                                        <th className="pb-3 pr-4">Engine</th>
                                        <th className="pb-3 pr-4">Filter Part #</th>
                                        <th className="pb-3 pr-4">Grade</th>
                                        <th className="pb-3 pr-4">Qts</th>
                                        <th className="pb-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fitments.map((f) => (
                                        <tr key={f.id} className={dashboardTableRowClass()}>
                                            <td className="py-3 pr-4">
                                                <p className="font-medium text-white">{f.make}</p>
                                                <p className="text-xs text-slate-400">{f.model}</p>
                                            </td>
                                            <td className="py-3 pr-4 text-slate-400 text-sm">
                                                {f.year_from}–{f.year_to}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-400 text-sm">
                                                {f.engine ?? <span className="text-slate-600 italic">all engines</span>}
                                            </td>
                                            <td className="py-3 pr-4">
                                                <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-gold-300">
                                                    {f.oil_filter_part_no}
                                                </span>
                                                {f.oil_filter_brand && (
                                                    <p className="mt-0.5 text-xs text-slate-500">{f.oil_filter_brand}</p>
                                                )}
                                            </td>
                                            <td className="py-3 pr-4 font-mono text-sm text-white">{f.oil_grade}</td>
                                            <td className="py-3 pr-4 text-slate-400 text-sm">{Number(f.oil_capacity_quarts).toFixed(1)}</td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setModal({ mode: 'edit', fitment: f })}
                                                        className="ml-btn-icon"
                                                        aria-label="Edit fitment"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (confirm('Delete this fitment record?')) {
                                                                router.delete(route('admin.oil-fitments.destroy', f.id));
                                                            }
                                                        }}
                                                        className="ml-btn-icon-danger"
                                                        aria-label="Delete fitment"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </DashboardTable>
                        </div>
                    </DashboardCardContent>
                </DashboardCard>
            )}

            {modal && <OilFitmentModal state={modal} onClose={() => setModal(null)} />}
        </AdminLayout>
    );
}
