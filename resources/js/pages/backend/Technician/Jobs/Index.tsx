import { Form, Head, router } from '@inertiajs/react';
import { CheckCircle, LogOut, MapPin, Play, Wrench } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Recommendation {
    part_type_label: string;
    part_name: string;
    specification: string | null;
}

interface Job {
    id: number;
    route_order: number | null;
    status: string;
    scheduled_at: string;
    customer: string | null;
    customer_phone: string | null;
    vehicle: string | null;
    service: string | null;
    address: string;
    customer_notes: string | null;
    recommendations: Recommendation[];
}

interface IndexProps {
    technician: { name: string; email: string };
    jobs: Job[];
}

export default function Index({ technician, jobs }: IndexProps) {
    const handleLogout = (): void => {
        router.post(route('technician.logout'));
    };

    return (
        <div className="flex min-h-screen flex-col bg-white text-gray-900">
            <Head title="My Jobs" />

            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
                <div className="container mx-auto flex items-center justify-between px-4 py-3">
                    <AppLogo className="h-10 w-auto" />
                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-gray-500 sm:inline">{technician.name}</span>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-ml-gold hover:bg-amber-50">
                            <LogOut className="size-4" /> Log out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto flex-1 px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">My Jobs</h1>
                    <p className="text-gray-500">{jobs.length} active job(s) assigned to you.</p>
                </div>

                {jobs.length === 0 ? (
                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                            <CheckCircle className="size-12 text-ml-gold/40" />
                            <div>
                                <p className="text-lg font-medium">All caught up!</p>
                                <p className="text-sm text-gray-400">No active jobs assigned right now.</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {jobs.map((job, index) => (
                            <Card key={job.id} className="border-gray-200 bg-white text-gray-900 shadow-sm">
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-sm font-bold text-ml-gold">
                                            {job.route_order ?? index + 1}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{job.service ?? 'Service'}</CardTitle>
                                            <p className="text-sm text-gray-500">{job.customer} · {job.vehicle}</p>
                                        </div>
                                    </div>
                                    <Badge className="border-amber-200 bg-amber-50 text-ml-gold">{job.status}</Badge>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2 text-sm text-gray-500 sm:grid-cols-2">
                                        <span>Scheduled: {job.scheduled_at}</span>
                                        {job.customer_phone && (
                                            <a href={`tel:${job.customer_phone}`} className="text-ml-gold hover:underline">
                                                {job.customer_phone}
                                            </a>
                                        )}
                                    </div>

                                    <p className="flex items-start gap-2 text-sm text-gray-600">
                                        <MapPin className="mt-0.5 size-4 shrink-0 text-ml-gold" />
                                        {job.address}
                                    </p>

                                    {job.customer_notes && (
                                        <p className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                                            <strong className="text-gray-600">Customer notes:</strong> {job.customer_notes}
                                        </p>
                                    )}

                                    {job.recommendations.length > 0 && (
                                        <div>
                                            <p className="mb-2 flex items-center gap-1 text-sm font-medium text-ml-gold">
                                                <Wrench className="size-4" /> Recommended Parts
                                            </p>
                                            <div className="space-y-2">
                                                {job.recommendations.map((rec, recIndex) => (
                                                    <div key={recIndex} className="rounded border border-gray-200 px-3 py-2 text-sm">
                                                        <span className="font-medium">{rec.part_name}</span>
                                                        <span className="text-gray-400"> · {rec.part_type_label}</span>
                                                        {rec.specification && (
                                                            <p className="text-xs text-gray-400">{rec.specification}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <Form action={route('technician.jobs.update', job.id)} method="patch">
                                            <input type="hidden" name="status" value="in_progress" />
                                            <Button type="submit" variant="outline" className="border-amber-200 text-gray-900 hover:bg-amber-50">
                                                <Play className="size-4" /> Start Job
                                            </Button>
                                        </Form>
                                        <Form action={route('technician.jobs.update', job.id)} method="patch">
                                            <input type="hidden" name="status" value="completed" />
                                            <Button type="submit" className="ml-gold-gradient border-0 font-bold text-ml-black">
                                                <CheckCircle className="size-4" /> Complete Job
                                            </Button>
                                        </Form>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
