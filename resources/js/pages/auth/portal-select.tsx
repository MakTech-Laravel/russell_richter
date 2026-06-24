import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Shield, User, Wrench } from 'lucide-react';

import { BrandMark, FullLogo } from '@/components/brand';
import { home } from '@/routes';

const PORTALS = [
    {
        key: 'customer',
        title: 'Customer',
        description: 'Manage vehicles, bookings, service history, and payments.',
        href: route('login'),
        icon: User,
        accent: 'from-sky-500/20 to-sky-500/5 border-sky-500/30 hover:border-sky-400/50',
        iconClass: 'text-sky-400',
    },
    {
        key: 'admin',
        title: 'Admin',
        description: 'Manage bookings, packages, technicians, routes, and transactions.',
        href: route('admin.login'),
        icon: Shield,
        accent: 'from-gold-500/20 to-gold-500/5 border-gold-500/40 hover:border-gold-400/60',
        iconClass: 'text-gold-400',
    },
    {
        key: 'technician',
        title: 'Technician',
        description: 'View assigned jobs, update status, and access route details.',
        href: route('technician.login'),
        icon: Wrench,
        accent: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-400/50',
        iconClass: 'text-emerald-400',
    },
] as const;

export default function PortalSelect() {
    return (
        <div className="flex min-h-screen bg-carbon">
            <Head title="Sign In" />

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
                    Choose your <span className="text-gold-grad">portal</span>
                </h1>
                <p className="mt-2 max-w-md text-sm text-slate-400">
                    Select how you want to sign in. Each role uses a separate secure login.
                </p>

                <div className="mt-8 flex max-w-md flex-col gap-3">
                    {PORTALS.map((portal) => {
                        const Icon = portal.icon;

                        return (
                            <Link
                                key={portal.key}
                                href={portal.href}
                                className={`group flex items-center gap-4 rounded-xl border bg-gradient-to-r p-4 transition ${portal.accent}`}
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-ink-900/60">
                                    <Icon className={`h-5 w-5 ${portal.iconClass}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold uppercase tracking-wider text-white">{portal.title}</p>
                                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{portal.description}</p>
                                </div>
                                <ChevronRight className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-gold-400" />
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="relative hidden w-1/2 overflow-hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900" />
                <div className="absolute inset-0 bg-grid-gold opacity-30" />
                <div className="relative flex h-full flex-col items-center justify-center p-12 text-center">
                    <BrandMark className="h-auto max-h-64 w-full max-w-lg drop-shadow-[0_8px_40px_rgba(255,184,32,0.45)]" />
                    <h2 className="mt-8 text-3xl font-black uppercase text-white">
                        One account, <span className="text-gold-grad">right door</span>
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                        Customers book service online. Admins run operations. Technicians complete jobs in the field.
                    </p>
                </div>
            </div>
        </div>
    );
}
