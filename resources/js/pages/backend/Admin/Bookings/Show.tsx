import { Form, Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Wrench } from 'lucide-react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

interface Recommendation {
    part_type_label: string;
    part_name: string;
    specification: string | null;
    quantity: number;
    estimated_price: string | number | null;
    notes: string | null;
}

interface Booking {
    id: number;
    status: string;
    status_label: string;
    payment_status: string;
    payment_status_label: string;
    paid_at: string | null;
    scheduled_at: string;
    completed_at: string | null;
    service_address: string;
    service_city: string;
    service_state: string;
    service_zip: string;
    latitude: number | null;
    longitude: number | null;
    total_price: string | number | null;
    customer_notes: string | null;
    technician_notes: string | null;
    route_order: number | null;
    customer: { id: number; name: string; email: string; phone: string | null } | null;
    vehicle: { id: number; display_name: string; vin: string; mileage: number | null } | null;
    service: { id: number; name: string } | null;
    technician: { id: number; name: string } | null;
    recommendations: Recommendation[];
}

interface StatusOption {
    value: string;
    label: string;
}

interface ShowProps {
    booking: Booking;
    technicians: Array<{ id: number; name: string }>;
    statuses: StatusOption[];
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
    if (value == null || value === '') {
        return null;
    }

    return (
        <div className="flex justify-between border-b border-gray-200 py-3 last:border-0">
            <span className="text-gray-500">{label}</span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
}

export default function Show({ booking, technicians, statuses }: ShowProps) {
    const selectClass = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900';
    const textareaClass = 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400';
    const fullAddress = `${booking.service_address}, ${booking.service_city}, ${booking.service_state} ${booking.service_zip}`;

    return (
        <AdminLayout>
            <Head title={`Booking #${booking.id}`} />

            <div className="bg-white px-4 py-8 text-gray-900">
                <div className="container mx-auto max-w-5xl">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <Link href={route('admin.bookings.index')} className="inline-flex items-center gap-1 text-sm text-ml-gold hover:underline">
                                <ArrowLeft className="size-4" /> Back to bookings
                            </Link>
                            <h1 className="mt-2 text-3xl font-bold">Booking #{booking.id}</h1>
                            <p className="text-gray-500">{booking.service?.name} · {booking.customer?.name}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge className="border-amber-200 bg-amber-50 text-ml-gold">{booking.status_label}</Badge>
                            <Badge
                                className={
                                    booking.payment_status === 'paid'
                                        ? 'border-green-200 bg-green-50 text-green-700'
                                        : 'border-red-200 bg-red-50 text-red-700'
                                }
                            >
                                {booking.payment_status_label}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                                <CardHeader><CardTitle>Booking Details</CardTitle></CardHeader>
                                <CardContent>
                                    <DetailRow label="Scheduled" value={booking.scheduled_at} />
                                    <DetailRow label="Paid At" value={booking.paid_at} />
                                    <DetailRow label="Completed" value={booking.completed_at} />
                                    <DetailRow label="Customer" value={booking.customer?.name} />
                                    <DetailRow label="Email" value={booking.customer?.email} />
                                    <DetailRow label="Phone" value={booking.customer?.phone} />
                                    <DetailRow label="Vehicle" value={booking.vehicle?.display_name} />
                                    <DetailRow label="VIN" value={booking.vehicle?.vin} />
                                    <DetailRow label="Service" value={booking.service?.name} />
                                    <DetailRow label="Address" value={fullAddress} />
                                    <DetailRow label="Route Order" value={booking.route_order} />
                                    <DetailRow label="Total" value={booking.total_price != null ? `$${Number(booking.total_price).toFixed(2)}` : null} />
                                    <DetailRow label="Customer Notes" value={booking.customer_notes} />
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Wrench className="size-4 text-ml-gold" />
                                        Part Recommendations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {booking.recommendations.length === 0 ? (
                                        <p className="text-sm text-gray-400">No recommendations generated.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {booking.recommendations.map((rec, index) => (
                                                <div key={index} className="rounded-lg border border-gray-200 p-4">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="font-medium">{rec.part_name}</p>
                                                            <p className="text-xs text-ml-gold">{rec.part_type_label}</p>
                                                        </div>
                                                        {rec.estimated_price != null && (
                                                            <span className="text-ml-gold">${Number(rec.estimated_price).toFixed(2)}</span>
                                                        )}
                                                    </div>
                                                    {rec.specification && <p className="mt-1 text-sm text-gray-500">{rec.specification}</p>}
                                                    <p className="mt-1 text-xs text-gray-400">Qty: {rec.quantity}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-gray-200 bg-white text-gray-900 shadow-sm lg:col-span-1">
                            <CardHeader><CardTitle>Manage Booking</CardTitle></CardHeader>
                            <CardContent>
                                <Form
                                    action={route('admin.bookings.update', booking.id)}
                                    method="patch"
                                    className="space-y-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="status" className="text-gray-600">Status</Label>
                                                <select id="status" name="status" defaultValue={booking.status} required className={selectClass}>
                                                    {statuses.map((status) => (
                                                        <option key={status.value} value={status.value}>{status.label}</option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.status} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="technician_id" className="text-gray-600">Assign Technician</Label>
                                                <select
                                                    id="technician_id"
                                                    name="technician_id"
                                                    defaultValue={booking.technician?.id ?? ''}
                                                    className={selectClass}
                                                >
                                                    <option value="">Unassigned</option>
                                                    {technicians.map((tech) => (
                                                        <option key={tech.id} value={tech.id}>{tech.name}</option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.technician_id} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="technician_notes" className="text-gray-600">Technician Notes</Label>
                                                <Textarea
                                                    id="technician_notes"
                                                    name="technician_notes"
                                                    rows={4}
                                                    defaultValue={booking.technician_notes ?? ''}
                                                    className={textareaClass}
                                                />
                                                <InputError message={errors.technician_notes} />
                                            </div>

                                            <Button type="submit" disabled={processing} className="w-full ml-gold-gradient border-0 font-bold text-ml-black">
                                                {processing ? 'Updating...' : 'Update Booking'}
                                            </Button>
                                        </>
                                    )}
                                </Form>

                                {booking.customer && (
                                    <Button
                                        variant="outline"
                                        className="mt-4 w-full border-amber-200 text-gray-900 hover:bg-amber-50"
                                        onClick={() => router.visit(route('admin.customers.show', booking.customer!.id))}
                                    >
                                        View Customer
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
