import { Head, Link } from '@inertiajs/react';
import * as React from 'react';

import AppLogo from '@/components/app-logo';
import { login, register } from '@/routes';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    context?: 'login' | 'register';
    showHeader?: boolean;
    showFooter?: boolean;
}

export default function AuthLayout({
    children,
    title,
    description,
    context = 'login',
}: AuthLayoutProps) {
    const isRegisterView = context === 'register';
    const ctaHref = isRegisterView ? login() : register();
    const ctaLabel = isRegisterView ? 'Return to login' : 'Create account';
    const ctaPrompt = isRegisterView ? 'Already have an account?' : 'New to Mobile Lube?';

    const highlights = [
        {
            title: 'Book On-Site Service',
            description: 'Schedule oil changes and maintenance at your home, office, or job site.',
        },
        {
            title: 'Manage Your Vehicles',
            description: 'Save VIN-based vehicle records and get personalized part recommendations.',
        },
        {
            title: 'Track Service History',
            description: 'View completed services, bookings, and upcoming appointments anytime.',
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-gray-50 text-gray-900">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-32 top-12 h-80 w-80 rounded-full bg-amber-100/80 blur-[120px]" />
                <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-amber-50 blur-[140px]" />
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-2 py-12 lg:px-10">
                <main className="relative w-full max-w-6xl overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-xl">
                    <Head title={title} />

                    <div className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-ml-gold/60 to-transparent" />

                    <div className="grid gap-10 px-2 py-2 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-12">
                        <section className="flex flex-col gap-8 rounded-3xl border border-gray-100 bg-gray-50 p-6 lg:p-8">
                            <header className="space-y-5">
                                <AppLogo className="h-14 w-auto" />
                                <div className="space-y-2 text-balance">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ml-gold">
                                        Mobile Lube Customer Portal
                                    </p>
                                    <h1 className="text-3xl font-semibold leading-tight md:text-4xl">{title}</h1>
                                    <p className="text-lg text-gray-600">{description}</p>
                                </div>
                            </header>

                            <div className="space-y-3">
                                {highlights.map((highlight) => (
                                    <div
                                        key={highlight.title}
                                        className="rounded-xl border border-gray-200 bg-white p-4"
                                    >
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ml-gold">
                                            {highlight.title}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600">{highlight.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
                                <p className="text-gray-600">{ctaPrompt}</p>
                                <Link
                                    href={ctaHref}
                                    className="rounded-full ml-gold-gradient px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-ml-black"
                                >
                                    {ctaLabel}
                                </Link>
                            </div>
                        </section>

                        <section className="relative flex items-center">
                            <div className="w-full rounded-3xl border border-gray-100 bg-white p-2 shadow-sm">
                                {children}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
