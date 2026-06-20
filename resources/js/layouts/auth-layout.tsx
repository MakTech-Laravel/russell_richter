import { Head, Link } from '@inertiajs/react';
import * as React from 'react';

import { BrandMark, FullLogo } from '@/components/brand';
import { home } from '@/routes';
import { login, register } from '@/routes';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: React.ReactNode;
    description: string;
    context?: 'login' | 'register';
    headTitle: string;
    backHref?: string;
}

export default function AuthLayout({
    children,
    title,
    description,
    context = 'login',
    headTitle,
    backHref,
}: AuthLayoutProps) {
    const isRegisterView = context === 'register';
    const switchHref = isRegisterView ? login() : register();
    const switchLabel = isRegisterView ? 'Sign in' : 'Sign up free';
    const switchPrompt = isRegisterView ? 'Already have an account?' : "Don't have an account?";

    return (
        <div className="flex min-h-screen bg-carbon">
            <Head title={headTitle} />

            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
                <Link
                    href={backHref ?? home()}
                    className="mb-8 inline-flex w-max items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-gold-400"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to home
                </Link>

                <FullLogo />

                <h1 className="mt-8 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                    {title}
                </h1>
                <p className="mt-2 text-sm text-slate-400">{description}</p>

                <div className="mt-8 max-w-md">{children}</div>

                <p className="mt-6 text-sm text-slate-400">
                    {switchPrompt}{' '}
                    <Link href={switchHref} className="font-bold text-gold-400 hover:text-gold-300">
                        {switchLabel}
                    </Link>
                </p>
            </div>

            <div className="relative hidden w-1/2 overflow-hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900" />
                <div className="absolute inset-0 bg-grid-gold opacity-30" />
                <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-gold-500/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-gold-700/15 blur-3xl" />
                <div className="relative flex h-full flex-col items-center justify-center p-12">
                    <div className="absolute right-12 top-12">
                        <BrandMark className="h-12 w-12" />
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <BrandMark className="h-48 w-48 drop-shadow-[0_8px_40px_rgba(255,184,32,0.45)]" />
                        <h2 className="mt-8 text-4xl font-black uppercase leading-tight text-white">
                            <span className="text-chrome">Mobile</span>{' '}
                            <span className="text-gold-grad">Lube</span>
                        </h2>
                        <div className="mt-2 text-sm font-bold uppercase tracking-[0.4em] text-gold-400">
                            We Come To You
                        </div>
                        <blockquote className="mt-10 max-w-md text-lg font-medium leading-snug text-slate-300">
                            &ldquo;Booked an oil change in 60 seconds and was back to work before my coffee got
                            cold.&rdquo;
                        </blockquote>
                        <p className="mt-3 text-sm text-slate-500">— Sarah M., Honda owner</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
