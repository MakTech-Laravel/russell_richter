import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Mail } from 'lucide-react';

import { DashboardCard, DashboardCardContent, DashboardCardHeader, StatusPill } from '@/components/dashboard/dashboard-ui';
import AdminLayout from '@/layouts/admin-layout';

interface ContactMessageDetail {
    id: number;
    route_key: string;
    company_name: string | null;
    contact_name: string;
    email: string;
    phone: string | null;
    vehicle_count: number | null;
    vehicle_types: string | null;
    message: string;
    is_unread: boolean;
    read_at: string | null;
    created_at: string | null;
}

interface ShowProps {
    contactMessage: ContactMessageDetail;
}

function DetailItem({ label, value }: { label: string; value: string | number | null }) {
    return (
        <div className="rounded-xl border border-white/5 bg-ink-900/50 p-4">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</div>
            <div className="mt-1 text-sm text-white">{value ?? '—'}</div>
        </div>
    );
}

export default function Show({ contactMessage }: ShowProps) {
    return (
        <AdminLayout
            title="Contact Request"
            subtitle={`Inquiry from ${contactMessage.contact_name}`}
            actions={
                <Link href={route('admin.contacts.index')} className="ml-btn-outline inline-flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to inbox
                </Link>
            }
        >
            <Head title={`Contact Request - ${contactMessage.contact_name}`} />

            <div className="space-y-6">
                <DashboardCard>
                    <DashboardCardHeader
                        title={contactMessage.contact_name}
                        subtitle={contactMessage.company_name ?? 'No company name provided'}
                        actions={<StatusPill status={contactMessage.is_unread ? 'pending' : 'completed'} label={contactMessage.is_unread ? 'Unread' : 'Read'} />}
                    />
                    <DashboardCardContent>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <DetailItem label="Email" value={contactMessage.email} />
                            <DetailItem label="Phone" value={contactMessage.phone} />
                            <DetailItem label="Vehicle Count" value={contactMessage.vehicle_count} />
                            <DetailItem label="Received" value={contactMessage.created_at} />
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <DetailItem label="Vehicle Types" value={contactMessage.vehicle_types} />
                            <DetailItem label="Read At" value={contactMessage.read_at} />
                        </div>

                        <div className="mt-6 rounded-2xl border border-white/5 bg-ink-900/70 p-5">
                            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500">
                                <Mail className="h-4 w-4" /> Message
                            </div>
                            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{contactMessage.message}</p>
                        </div>
                    </DashboardCardContent>
                </DashboardCard>
            </div>
        </AdminLayout>
    );
}