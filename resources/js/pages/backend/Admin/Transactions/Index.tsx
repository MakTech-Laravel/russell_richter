import { Head, Link } from '@inertiajs/react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    DashboardTable,
    StatusPill,
    dashboardTableHeadClass,
    dashboardTableRowClass,
} from '@/components/dashboard/dashboard-ui';
import AdminLayout from '@/layouts/admin-layout';

interface TransactionRow {
    id: number;
    amount: string | number;
    currency: string;
    status: string;
    status_label: string;
    customer: string | null;
    customer_email: string | null;
    service: string | null;
    booking_id: number;
    booking_route_key: string | null;
    stripe_payment_intent_id: string | null;
    paid_at: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTransactions {
    data: TransactionRow[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface IndexProps {
    transactions: PaginatedTransactions;
}

export default function Index({ transactions }: IndexProps) {
    return (
        <AdminLayout title="Transactions" subtitle="All Stripe payment transactions across the platform.">
            <Head title="Transactions" />

            <DashboardCard>
                <DashboardCardHeader title={`${transactions.total} transaction(s)`} />
                <DashboardCardContent>
                    {transactions.data.length === 0 ? (
                        <p className="text-sm text-slate-400">No transactions yet.</p>
                    ) : (
                        <>
                            <DashboardTable>
                                <thead>
                                    <tr className={dashboardTableHeadClass()}>
                                        <th className="pb-3 pr-4">Customer</th>
                                        <th className="pb-3 pr-4">Service</th>
                                        <th className="pb-3 pr-4">Amount</th>
                                        <th className="pb-3 pr-4">Status</th>
                                        <th className="pb-3 pr-4">Paid At</th>
                                        <th className="pb-3">Booking</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.map((tx) => (
                                        <tr key={tx.id} className={dashboardTableRowClass()}>
                                            <td className="py-3 pr-4">
                                                <p className="text-white">{tx.customer ?? '—'}</p>
                                                {tx.customer_email && (
                                                    <p className="text-xs text-slate-500">{tx.customer_email}</p>
                                                )}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-400">{tx.service ?? '—'}</td>
                                            <td className="py-3 pr-4 font-medium text-gold-300">
                                                ${Number(tx.amount).toFixed(2)} {tx.currency}
                                            </td>
                                            <td className="py-3 pr-4">
                                                <StatusPill
                                                    status={tx.status === 'succeeded' ? 'completed' : tx.status === 'pending' ? 'pending' : 'cancelled'}
                                                    label={tx.status_label}
                                                />
                                            </td>
                                            <td className="py-3 pr-4 text-slate-400">{tx.paid_at ?? tx.created_at}</td>
                                            <td className="py-3">
                                                <Link
                                                    href={route('admin.bookings.show', tx.booking_route_key ?? tx.booking_id)}
                                                    className="text-gold-400 hover:underline"
                                                >
                                                    #{tx.booking_id}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </DashboardTable>

                            {transactions.last_page > 1 && (
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {transactions.links.map((link, i) =>
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`rounded-lg px-3 py-1.5 text-sm ${link.active ? 'bg-gold-500 text-ink-900' : 'border border-white/10 text-slate-400 hover:text-white'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={i}
                                                className="rounded-lg px-3 py-1.5 text-sm text-slate-600"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ),
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </DashboardCardContent>
            </DashboardCard>
        </AdminLayout>
    );
}
