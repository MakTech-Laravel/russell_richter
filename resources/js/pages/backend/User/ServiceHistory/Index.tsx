import { Head, Link } from '@inertiajs/react';
import { CheckCircle, History } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';

interface HistoryItem {
    id: number;
    completed_at: string | null;
    scheduled_at: string;
    total_price: string | number | null;
    vehicle: string | null;
    service: string | null;
    technician: string | null;
    recommendations_count: number;
}

interface IndexProps {
    history: HistoryItem[];
}

export default function Index({ history }: IndexProps) {
    return (
        <UserLayout>
            <Head title="Service History" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Service History</h1>
                    <p className="text-gray-500">View your completed mobile service appointments.</p>
                </div>

                {history.length === 0 ? (
                    <Card className="border-gray-200 bg-white text-gray-900 shadow-sm">
                        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                            <History className="size-12 text-ml-gold/40" />
                            <div>
                                <p className="text-lg font-medium">No completed services yet</p>
                                <p className="text-sm text-gray-400">Your service history will appear here after your first appointment.</p>
                            </div>
                            <Button asChild className="ml-gold-gradient border-0 font-bold text-ml-black">
                                <Link href={route('bookings.create')}>Book Service</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <Link key={item.id} href={route('bookings.show', item.id)} className="block">
                                <Card className="border-gray-200 bg-white text-gray-900 shadow-sm transition-colors hover:border-amber-200">
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div>
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <CheckCircle className="size-4 text-ml-gold" />
                                                {item.service ?? 'Service'}
                                            </CardTitle>
                                            <p className="text-sm text-gray-500">{item.vehicle}</p>
                                        </div>
                                        {item.total_price != null && (
                                            <span className="text-lg font-bold text-ml-gold">
                                                ${Number(item.total_price).toFixed(2)}
                                            </span>
                                        )}
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span>Completed: {item.completed_at ?? item.scheduled_at}</span>
                                        {item.technician && <span>Technician: {item.technician}</span>}
                                        {item.recommendations_count > 0 && (
                                            <span>{item.recommendations_count} part recommendation(s)</span>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
