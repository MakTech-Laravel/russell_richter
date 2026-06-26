import { Form, Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardTable,
    StatusPill,
    dashboardInputClass,
    dashboardSelectClass,
    dashboardTableHeadClass,
    dashboardTableRowClass,
} from '@/components/dashboard/dashboard-ui';
import AdminLayout from '@/layouts/admin-layout';

interface ContactMessageRow {
    id: number;
    route_key: string;
    company_name: string | null;
    contact_name: string;
    email: string;
    phone: string | null;
    vehicle_count: number | null;
    vehicle_types: string | null;
    message: string;
    message_excerpt: string;
    is_unread: boolean;
    read_at: string | null;
    created_at: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedContactMessages {
    data: ContactMessageRow[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface IndexProps {
    contactMessages: PaginatedContactMessages;
    filters: { search: string; status: string };
}

export default function Index({ contactMessages, filters }: IndexProps) {
    return (
        <AdminLayout
            title="Contact Inbox"
            subtitle={`${contactMessages.total} inquiry/inquiries`}
            actions={
                <Form action={route('admin.contacts.index')} method="get" className="flex flex-wrap gap-2">
                   
                    <select name="status" defaultValue={filters.status} className={dashboardSelectClass()}>
                        <option value="all">All</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                    </select>
                    
                </Form>
            }
        >
            <Head title="Contact Inbox" />

            <DashboardCard>
                <DashboardCardHeader title="All Contact Requests" subtitle="The latest frontend inquiries are listed here." />
                <DashboardCardContent>
                    {contactMessages.data.length === 0 ? (
                        <p className="text-sm text-slate-400">No contact messages found.</p>
                    ) : (
                        <DashboardTable>
                            <thead>
                                <tr className={dashboardTableHeadClass()}>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3 pr-4">Contact</th>
                                    <th className="pb-3 pr-4">Company</th>
                                    <th className="pb-3 pr-4">Email</th>
                                    <th className="pb-3 pr-4">Vehicles</th>
                                    <th className="pb-3 pr-4">Message</th>
                                    <th className="pb-3">Received</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contactMessages.data.map((contactMessage) => (
                                    <tr
                                        key={contactMessage.id}
                                        className={dashboardTableRowClass() + ' cursor-pointer'}
                                        onClick={() => router.visit(route('admin.contacts.show', contactMessage.route_key))}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                router.visit(route('admin.contacts.show', contactMessage.route_key));
                                            }
                                        }}
                                        tabIndex={0}
                                        role="link"
                                        aria-label={`View contact request from ${contactMessage.contact_name}`}
                                    >
                                        <td className="py-3 pr-4">
                                            <StatusPill status={contactMessage.is_unread ? 'pending' : 'completed'} label={contactMessage.is_unread ? 'Unread' : 'Read'} />
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div className="text-white">{contactMessage.contact_name}</div>
                                            {contactMessage.phone && <div className="text-xs text-slate-500">{contactMessage.phone}</div>}
                                        </td>
                                        <td className="py-3 pr-4 text-slate-400">{contactMessage.company_name ?? '—'}</td>
                                        <td className="py-3 pr-4 text-slate-400">{contactMessage.email}</td>
                                        <td className="py-3 pr-4 text-slate-400">
                                            {contactMessage.vehicle_count ?? '—'}
                                            {contactMessage.vehicle_types ? <div className="text-xs text-slate-500">{contactMessage.vehicle_types}</div> : null}
                                        </td>
                                        <td className="py-3 pr-4 text-slate-400">{contactMessage.message_excerpt}</td>
                                        <td className="py-3 text-slate-400">{contactMessage.created_at ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </DashboardTable>
                    )}

                    {contactMessages.last_page > 1 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {contactMessages.links.map((link, index) =>
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