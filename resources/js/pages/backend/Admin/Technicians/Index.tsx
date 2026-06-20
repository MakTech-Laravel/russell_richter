import { Form, Head } from '@inertiajs/react';
import { Plus, UserCheck, UserX } from 'lucide-react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import AdminLayout from '@/layouts/admin-layout';

interface Technician {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    bookings_count: number;
}

interface IndexProps {
    technicians: Technician[];
}

export default function Index({ technicians }: IndexProps) {
    const inputClass = 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400';

    return (
        <AdminLayout>
            <Head title="Technicians" />

            <div className="bg-white px-4 py-8 text-gray-900">
                <div className="container mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Technicians</h1>
                        <p className="text-gray-500">Manage field technicians and assignments.</p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="border-gray-200 bg-white text-gray-900 shadow-sm lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="size-4 text-ml-gold" />
                                    Add Technician
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form action={route('admin.technicians.store')} method="post" className="space-y-4">
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-gray-600">Name</Label>
                                                <Input id="name" name="name" required className={inputClass} />
                                                <InputError message={errors.name} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-gray-600">Email</Label>
                                                <Input id="email" name="email" type="email" required className={inputClass} />
                                                <InputError message={errors.email} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-gray-600">Phone</Label>
                                                <Input id="phone" name="phone" className={inputClass} />
                                                <InputError message={errors.phone} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-gray-600">Password</Label>
                                                <PasswordInput id="password" name="password" required className={inputClass} />
                                                <InputError message={errors.password} />
                                            </div>
                                            <Button type="submit" disabled={processing} className="w-full ml-gold-gradient border-0 font-bold text-ml-black">
                                                {processing ? 'Creating...' : 'Create Technician'}
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 bg-white text-gray-900 shadow-sm lg:col-span-2">
                            <CardHeader><CardTitle>Technician List</CardTitle></CardHeader>
                            <CardContent>
                                {technicians.length === 0 ? (
                                    <p className="text-sm text-gray-400">No technicians yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {technicians.map((tech) => (
                                            <div key={tech.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium">{tech.name}</p>
                                                        <Badge className={tech.is_active ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}>
                                                            {tech.is_active ? (
                                                                <><UserCheck className="size-3" /> Active</>
                                                            ) : (
                                                                <><UserX className="size-3" /> Inactive</>
                                                            )}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{tech.email}</p>
                                                    {tech.phone && <p className="text-xs text-gray-400">{tech.phone}</p>}
                                                    <p className="mt-1 text-xs text-ml-gold">{tech.bookings_count} booking(s)</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
