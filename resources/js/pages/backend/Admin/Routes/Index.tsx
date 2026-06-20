import { Form, Head, router } from '@inertiajs/react';
import { MapPin, Route, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

interface Technician {
    id: number;
    name: string;
}

interface RouteStop {
    id: number;
    route_order: number | null;
    customer: string | null;
    vehicle: string | null;
    service: string | null;
    address: string;
    scheduled_at: string;
    status: string;
    latitude: number | null;
    longitude: number | null;
}

interface IndexProps {
    technicians: Technician[];
    selectedTechnicianId: number | null;
    date: string;
    routes: RouteStop[];
}

export default function Index({ technicians, selectedTechnicianId, date, routes }: IndexProps) {
    const selectClass = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900';
    const inputClass = 'border-gray-300 bg-white text-gray-900';

    const applyFilters = (technicianId: string, selectedDate: string): void => {
        router.get(route('admin.routes.index'), {
            technician_id: technicianId || undefined,
            date: selectedDate,
        }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Route Planning" />

            <div className="bg-white px-4 py-8 text-gray-900">
                <div className="container mx-auto">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Route Planning</h1>
                            <p className="text-gray-500">View and optimize technician routes by date.</p>
                        </div>
                        {selectedTechnicianId && (
                            <Form action={route('admin.routes.optimize')} method="post">
                                <input type="hidden" name="technician_id" value={selectedTechnicianId} />
                                <input type="hidden" name="date" value={date} />
                                <Button type="submit" className="ml-gold-gradient border-0 font-bold text-ml-black">
                                    <Zap className="size-4" /> Optimize Route
                                </Button>
                            </Form>
                        )}
                    </div>

                    <Card className="mb-6 border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="technician_id" className="text-gray-600">Technician</Label>
                                    <select
                                        id="technician_id"
                                        value={selectedTechnicianId ?? ''}
                                        onChange={(e) => applyFilters(e.target.value, date)}
                                        className={selectClass}
                                    >
                                        {technicians.map((tech) => (
                                            <option key={tech.id} value={tech.id}>{tech.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-gray-600">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={date}
                                        onChange={(e) => applyFilters(String(selectedTechnicianId ?? ''), e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Route className="size-4 text-ml-gold" />
                                Route Stops ({routes.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {routes.length === 0 ? (
                                <p className="text-sm text-gray-400">No stops scheduled for this technician on the selected date.</p>
                            ) : (
                                <div className="space-y-4">
                                    {routes.map((stop, index) => (
                                        <div key={stop.id} className="flex gap-4 rounded-lg border border-gray-200 p-4">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-sm font-bold text-ml-gold">
                                                {stop.route_order ?? index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-start justify-between gap-2">
                                                    <div>
                                                        <p className="font-medium">{stop.customer ?? 'Customer'}</p>
                                                        <p className="text-sm text-gray-500">{stop.service} · {stop.vehicle}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-ml-gold">{stop.scheduled_at}</span>
                                                        <Badge className="border-amber-200 bg-amber-50 text-ml-gold">{stop.status}</Badge>
                                                    </div>
                                                </div>
                                                <p className="mt-2 flex items-center gap-1 text-sm text-gray-400">
                                                    <MapPin className="size-3" /> {stop.address}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
