import { Form, usePage } from '@inertiajs/react';

import { authInputClass, AuthField } from '@/components/auth/auth-field';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { SharedData } from '@/types';

export default function Login() {
    const { features } = usePage<SharedData>().props;

    return (
        <AuthLayout
            title={
                <>
                    Welcome <span className="text-gold-grad">back</span>
                </>
            }
            description="Sign in to manage your vehicles, bookings and service history."
            context="login"
            headTitle="Customer sign in"
            backHref={route('sign-in')}
        >
            <Form {...store.form()} resetOnSuccess={['password']} className="space-y-4">
                {({ processing, errors }) => (
                    <>
                        <AuthField id="email" label="Email" error={errors.email}>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={authInputClass()}
                            />
                        </AuthField>

                        <AuthField
                            id="password"
                            label="Password"
                            error={errors.password}
                            action={
                                features.canResetPassword ? (
                                    <TextLink href={request()} className="text-xs font-semibold text-gold-400">
                                        Forgot?
                                    </TextLink>
                                ) : undefined
                            }
                        >
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                placeholder="••••••••"
                                className={authInputClass()}
                            />
                        </AuthField>

                        <button
                            type="submit"
                            disabled={processing}
                            className="ml-btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm uppercase tracking-wider disabled:opacity-50"
                        >
                            {processing ? <Spinner className="h-4 w-4" /> : 'Sign in'}
                        </button>
                    </>
                )}
            </Form>

            <p className="mt-6 text-center text-xs text-slate-500">
                Need an account?{' '}
                <TextLink href={register()} className="font-bold text-gold-400">
                    Create one free
                </TextLink>
            </p>
        </AuthLayout>
    );
}
