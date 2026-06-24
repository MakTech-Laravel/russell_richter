import { Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';

import { FrontendSection } from '@/components/frontend/frontend-container';
import { register } from '@/routes';

export function CtaSection() {
    return (
        <FrontendSection padding="compact" className="overflow-hidden border-y border-gold-500/20">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-900 via-gold-900/30 to-ink-900" />
            <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-30" />
            <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gold-300">
                        <Calendar className="h-3 w-3" /> Get Started Today
                    </div>
                    <h2 className="mt-3 text-2xl font-black uppercase leading-tight text-white sm:text-3xl lg:text-4xl xl:text-5xl">
                        Book your <span className="text-gold-grad">mobile service</span> online
                    </h2>
                    <p className="mt-3 text-sm text-slate-300 sm:text-base">
                        Create an account to manage vehicles and bookings, or sign in to access your customer portal.
                    </p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col lg:items-stretch">
                    <Link
                        href={register()}
                        className="ml-btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm uppercase tracking-wider"
                    >
                        <Calendar className="h-4 w-4" />
                        Book a Service
                    </Link>
                    <Link
                        href={route('sign-in')}
                        className="ml-btn-outline inline-flex h-12 items-center justify-center rounded-lg px-6 text-sm uppercase tracking-wider"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </FrontendSection>
    );
}
