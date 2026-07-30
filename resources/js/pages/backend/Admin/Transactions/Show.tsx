import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';

import {
    DashboardCard,
    DashboardCardContent,
    DashboardCardHeader,
    StatusPill,
} from '@/components/dashboard/dashboard-ui';
import AdminLayout from '@/layouts/admin-layout';

interface TransactionDetails {
    id: number;
    invoice_number: string | null;
    amount: string | number;
    currency: string;
    status: string;
    status_label: string;
    customer: string | null;
    customer_email: string | null;
    customer_phone: string | null;
    service: string | null;
    booking_id: number;
    booking_route_key: string | null;
    stripe_payment_intent_id: string | null;
    stripe_checkout_session_id: string | null;
    paid_at: string | null;
    created_at: string;
    booking: {
        id: number;
        route_key: string;
        scheduled_at: string | null;
        status_label: string;
        payment_status_label: string;
        total_price: string | number | null;
        package_price: string | number | null;
        extra_quarts: number;
        extra_quarts_amount: string | number | null;
        extra_charge_amount: string | number | null;
        extra_charge_label: string | null;
        discount_percent: string | number | null;
        discount_amount: string | number | null;
        service_address: string;
        service_city: string;
        service_state: string;
        service_zip: string;
        vehicle: string | null;
    } | null;
}

interface ShowProps {
    transaction: TransactionDetails;
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
    if (value == null || value === '') {
        return null;
    }

    return (
        <div className="flex justify-between gap-4 border-b border-white/5 py-3 last:border-0">
            <span className="text-slate-400">{label}</span>
            <span className="text-right font-medium text-white">{value}</span>
        </div>
    );
}

export default function Show({ transaction }: ShowProps) {
    const booking = transaction.booking;

    const deleteTransaction = () => {
        if (!confirm('Delete this transaction? Use this for test records you no longer need.')) {
            return;
        }

        router.delete(route('admin.transactions.destroy', transaction.id));
    };

    return (
        <AdminLayout
            title={transaction.invoice_number ?? `Transaction #${transaction.id}`}
            subtitle="Full payment and booking details for accounting."
            actions={
                <StatusPill
                    status={transaction.status === 'succeeded' ? 'completed' : transaction.status === 'pending' ? 'pending' : 'cancelled'}
                    label={transaction.status_label}
                />
            }
        >
            <Head title={transaction.invoice_number ?? `Transaction #${transaction.id}`} />

            <div className="mx-auto max-w-4xl space-y-4">
                <Link href={route('admin.transactions.index')} className="inline-flex items-center gap-1 text-sm text-gold-400 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to transactions
                </Link>

                <div className="grid gap-6 lg:grid-cols-2">
                    <DashboardCard>
                        <DashboardCardHeader title="Transaction Details" />
                        <DashboardCardContent>
                            <DetailRow label="Invoice #" value={transaction.invoice_number ?? 'Pending'} />
                            <DetailRow label="Amount" value={`$${Number(transaction.amount).toFixed(2)} ${transaction.currency}`} />
                            <DetailRow label="Status" value={transaction.status_label} />
                            <DetailRow label="Customer" value={transaction.customer} />
                            <DetailRow label="Email" value={transaction.customer_email} />
                            <DetailRow label="Phone" value={transaction.customer_phone} />
                            <DetailRow label="Service" value={transaction.service} />
                            <DetailRow label="Paid At" value={transaction.paid_at} />
                            <DetailRow label="Created" value={transaction.created_at} />
                            <DetailRow label="Stripe PI" value={transaction.stripe_payment_intent_id} />
                            <DetailRow label="Checkout Session" value={transaction.stripe_checkout_session_id} />
                        </DashboardCardContent>
                    </DashboardCard>

                    <DashboardCard>
                        <DashboardCardHeader title="Related Booking" />
                        <DashboardCardContent>
                            {booking ? (
                                <>
                                    <DetailRow label="Booking" value={`#${booking.id}`} />
                                    <DetailRow label="Vehicle" value={booking.vehicle} />
                                    <DetailRow label="Scheduled" value={booking.scheduled_at} />
                                    <DetailRow label="Booking Status" value={booking.status_label} />
                                    <DetailRow label="Payment Status" value={booking.payment_status_label} />
                                    <DetailRow label="Package" value={booking.package_price != null ? `$${Number(booking.package_price).toFixed(2)}` : null} />
                                    <DetailRow
                                        label="Extra Quarts"
                                        value={
                                            booking.extra_quarts > 0
                                                ? `${booking.extra_quarts} ($${Number(booking.extra_quarts_amount ?? 0).toFixed(2)})`
                                                : null
                                        }
                                    />
                                    <DetailRow
                                        label={booking.extra_charge_label || 'Extra Charge'}
                                        value={
                                            Number(booking.extra_charge_amount ?? 0) > 0
                                                ? `$${Number(booking.extra_charge_amount).toFixed(2)}`
                                                : null
                                        }
                                    />
                                    <DetailRow
                                        label="Discount"
                                        value={
                                            Number(booking.discount_percent ?? 0) > 0
                                                ? `${Number(booking.discount_percent).toFixed(0)}% (−$${Number(booking.discount_amount ?? 0).toFixed(2)})`
                                                : null
                                        }
                                    />
                                    <DetailRow label="Total" value={booking.total_price != null ? `$${Number(booking.total_price).toFixed(2)}` : null} />
                                    <DetailRow
                                        label="Address"
                                        value={`${booking.service_address}, ${booking.service_city}, ${booking.service_state} ${booking.service_zip}`}
                                    />
                                    <Link
                                        href={route('admin.bookings.show', booking.route_key)}
                                        className="ml-btn-outline mt-4 inline-flex w-full justify-center"
                                    >
                                        Open Booking
                                    </Link>
                                </>
                            ) : (
                                <p className="text-sm text-slate-400">No related booking found.</p>
                            )}
                        </DashboardCardContent>
                    </DashboardCard>
                </div>

                <button type="button" onClick={deleteTransaction} className="ml-btn-outline inline-flex items-center gap-2 text-rose-300">
                    <Trash2 className="h-4 w-4" /> Delete test transaction
                </button>
            </div>
        </AdminLayout>
    );
}
