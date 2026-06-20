import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';

export default function Login() {
    const inputClass = 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400';

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-gray-900">
            <Head title="Technician Login" />

            <div className="mb-8">
                <AppLogo className="h-16 w-auto" />
            </div>

            <Card className="w-full max-w-md border-gray-200 bg-white text-gray-900 shadow-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Technician Portal</CardTitle>
                    <p className="text-sm text-gray-500">Sign in to view your assigned jobs.</p>
                </CardHeader>
                <CardContent>
                    <Form
                        action={route('technician.login.store')}
                        method="post"
                        resetOnSuccess={['password']}
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-600">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoFocus
                                        placeholder="technician@mobilelube.co"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.email} className="text-red-400" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-600">Password</Label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        placeholder="••••••••"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.password} className="text-red-400" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        value="1"
                                        className="rounded border-amber-200 bg-white text-ml-gold"
                                    />
                                    <Label htmlFor="remember" className="text-sm text-gray-500">Remember me</Label>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full ml-gold-gradient border-0 py-5 font-bold text-ml-black"
                                >
                                    {processing ? <Spinner className="size-4" /> : 'Sign In'}
                                </Button>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
