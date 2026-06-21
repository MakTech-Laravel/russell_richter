import { Head, Link, useForm } from '@inertiajs/react';

import { authInputClass, AuthField } from '@/components/auth/auth-field';
import { BrandMark, FullLogo } from '@/components/brand';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Spinner } from '@/components/ui/spinner';
import { home } from '@/routes';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.login.store'));
    };

    return (
        <div className="flex min-h-screen bg-carbon">
            <Head title="Admin Login" />

            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
                <Link
                    href={home()}
                    className="mb-8 inline-flex w-max items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-gold-400"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to home
                </Link>

                <FullLogo />

                <h1 className="mt-8 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                    Admin <span className="text-gold-grad">portal</span>
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                    Sign in to manage bookings, technicians, routes, and shop operations.
                </p>

                <form onSubmit={submit} className="mt-8 max-w-md space-y-4">
                    <AuthField id="email" label="Email" error={errors.email}>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                            placeholder="admin@mobilelube.co"
                            className={authInputClass()}
                        />
                    </AuthField>

                    <AuthField id="password" label="Password" error={errors.password}>
                        <PasswordInput
                            id="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
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
                        {processing ? <Spinner className="h-4 w-4" /> : 'Admin sign in'}
                    </button>
                </form>
            </div>

            <div className="relative hidden w-1/2 overflow-hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900" />
                <div className="absolute inset-0 bg-grid-gold opacity-30" />
                <div className="relative flex h-full flex-col items-center justify-center p-12 text-center">
                    <BrandMark className="h-auto max-h-64 w-full max-w-lg drop-shadow-[0_8px_40px_rgba(255,184,32,0.45)]" />
                    <h2 className="mt-8 text-3xl font-black uppercase text-white">
                        Shop <span className="text-gold-grad">operations</span>
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                        Manage bookings, assign technicians, optimize routes, and oversee your mobile service fleet.
                    </p>
                </div>
            </div>
        </div>
    );
}
