import { Form, Head, router } from '@inertiajs/react';
import { HelpCircle, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    sort_order: number;
    is_active: boolean;
}

interface IndexProps {
    faqs: FaqItem[];
}

type ModalState =
    | { mode: 'create' }
    | { mode: 'edit'; faq: FaqItem };

function AddFaqButton({
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
            className={cn('ml-btn-primary', isLarge ? 'ml-btn-lg' : 'ml-btn-sm')}
        >
            <Plus className={cn(isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5')} strokeWidth={2.5} />
            {isLarge ? 'Add FAQ' : (
                <>
                    <span className="hidden sm:inline">Add FAQ</span>
                    <span className="sm:hidden">Add</span>
                </>
            )}
        </button>
    );
}

function FaqFormFields({
    faq,
    errors,
}: {
    faq?: FaqItem;
    errors: Record<string, string>;
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="question" className={dashboardLabelClass()}>Question</label>
                <Input
                    id="question"
                    name="question"
                    required
                    defaultValue={faq?.question}
                    className={dashboardInputClass()}
                />
                <InputError message={errors.question} />
            </div>
            <div className="space-y-2">
                <label htmlFor="answer" className={dashboardLabelClass()}>Answer</label>
                <Textarea
                    id="answer"
                    name="answer"
                    required
                    rows={4}
                    defaultValue={faq?.answer}
                    className={dashboardInputClass()}
                />
                <InputError message={errors.answer} />
            </div>
            <div className="space-y-2">
                <label htmlFor="sort_order" className={dashboardLabelClass()}>Sort Order</label>
                <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    min="0"
                    defaultValue={faq?.sort_order ?? 0}
                    className={dashboardInputClass()}
                />
                <InputError message={errors.sort_order} />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                    type="checkbox"
                    name="is_active"
                    value="1"
                    defaultChecked={faq !== undefined ? faq.is_active : true}
                    className="rounded border-white/20"
                />
                Active (shown on website)
            </label>
        </div>
    );
}

function FaqModal({
    state,
    onClose,
}: {
    state: ModalState;
    onClose: () => void;
}) {
    const isEdit = state.mode === 'edit';
    const faq = isEdit ? state.faq : undefined;

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-ink-900 text-white sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {isEdit ? 'Edit FAQ' : 'Add FAQ'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {isEdit
                            ? 'Update this frequently asked question shown on the website.'
                            : 'Add a new question and answer for the website FAQ section.'}
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action={isEdit ? route('admin.faqs.update', faq!.id) : route('admin.faqs.store')}
                    method="post"
                    className="space-y-5"
                    onSuccess={onClose}
                >
                    {({ processing, errors }) => (
                        <>
                            {isEdit && <input type="hidden" name="_method" value="patch" />}
                            <FaqFormFields faq={faq} errors={errors} />
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="ml-btn-primary inline-flex flex-1 justify-center"
                                >
                                    {processing ? 'Saving...' : isEdit ? 'Save Changes' : 'Create FAQ'}
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

export default function Index({ faqs }: IndexProps) {
    const [modal, setModal] = useState<ModalState | null>(null);

    return (
        <AdminLayout
            title="FAQ Management"
            subtitle={`${faqs.length} question(s) on the website`}
            actions={<AddFaqButton onClick={() => setModal({ mode: 'create' })} />}
        >
            <Head title="FAQ Management" />

            {faqs.length === 0 ? (
                <DashboardEmptyState
                    icon={HelpCircle}
                    title="No FAQs yet"
                    description="Add your first frequently asked question to display on the website."
                    action={<AddFaqButton size="large" onClick={() => setModal({ mode: 'create' })} />}
                />
            ) : (
                <DashboardCard>
                    <DashboardCardHeader title="FAQ List" />
                    <DashboardCardContent>
                        <DashboardTable>
                            <thead>
                                <tr className={dashboardTableHeadClass()}>
                                    <th className="pb-3 pr-4 w-8">#</th>
                                    <th className="pb-3 pr-4">Question</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faqs.map((faq, index) => (
                                    <tr key={faq.id} className={dashboardTableRowClass()}>
                                        <td className="py-3 pr-4 text-slate-500 text-sm">{index + 1}</td>
                                        <td className="py-3 pr-4">
                                            <p className="font-medium text-white text-sm">{faq.question}</p>
                                            <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{faq.answer}</p>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <StatusPill
                                                status={faq.is_active ? 'completed' : 'cancelled'}
                                                label={faq.is_active ? 'Active' : 'Inactive'}
                                            />
                                        </td>
                                        <td className="py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setModal({ mode: 'edit', faq })}
                                                    className="ml-btn-icon"
                                                    aria-label={`Edit FAQ`}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm('Delete this FAQ?')) {
                                                            router.delete(route('admin.faqs.destroy', faq.id));
                                                        }
                                                    }}
                                                    className="ml-btn-icon-danger"
                                                    aria-label={`Delete FAQ`}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </DashboardTable>
                    </DashboardCardContent>
                </DashboardCard>
            )}

            {modal && <FaqModal state={modal} onClose={() => setModal(null)} />}
        </AdminLayout>
    );
}
