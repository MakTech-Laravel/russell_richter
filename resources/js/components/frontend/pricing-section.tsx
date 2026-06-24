import { Link, usePage } from '@inertiajs/react';
import { Check } from 'lucide-react';

import { FrontendSection } from '@/components/frontend/frontend-container';
import { SectionHeader } from '@/components/frontend/section-header';
import { register } from '@/routes';
import type { SharedData } from '@/types';

interface PricingSectionProps {
    packages: ReadonlyArray<{
        id: number;
        name: string;
        price: number;
        popular: boolean;
        features: ReadonlyArray<string>;
    }>;
    addOns: ReadonlyArray<{
        id: number;
        name: string;
        price: string;
        note: string | null;
    }>;
}

function bookingHref(serviceId: number, isAuthenticated: boolean): string {
    if (isAuthenticated) {
        return `${route('bookings.create')}?service_id=${serviceId}`;
    }

    return register();
}

export function PricingSection({ packages, addOns }: PricingSectionProps) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = Boolean(auth.user);

    return (
        <FrontendSection
            id="pricing"
            className="border-y border-white/5 bg-gradient-to-b from-ink-900 via-ink-800/40 to-ink-900"
        >
            <SectionHeader
                tag="Transparent Pricing"
                title={
                    <>
                        Honest rates, <span className="text-gold-grad">no surprises</span>
                    </>
                }
                subtitle="What you see is what you pay. No upselling, no waiting-room fees, no hidden labor charges."
            />
            <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-3">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 ${pkg.popular
                                ? 'border-gold-500/60 bg-gradient-to-b from-gold-500/10 via-ink-800 to-ink-900 shadow-[0_0_60px_-15px_rgba(255,184,32,0.4)]'
                                : 'border-white/10 bg-ink-800'
                            }`}
                    >
                        {pkg.popular && (
                            <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink-900 sm:right-6 sm:top-6">
                                Most Popular
                            </div>
                        )}
                        <h3 className="pr-24 text-sm font-bold uppercase tracking-widest text-gold-400">{pkg.name}</h3>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white sm:text-5xl">${pkg.price}</span>
                            <span className="text-sm text-slate-400">/ service</span>
                        </div>
                        <ul className="mt-6 flex-1 space-y-2.5 text-sm text-slate-300">
                            {pkg.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={bookingHref(pkg.id, isAuthenticated)}
                            className={`mt-7 flex h-10 items-center justify-center rounded-lg text-sm font-bold uppercase tracking-wider ${pkg.popular ? 'ml-btn-primary' : 'ml-btn-outline'
                                }`}
                        >
                            Book this service
                        </Link>
                    </div>
                ))}
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-ink-800 p-5 sm:p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gold-400">Other services offered</h3>
                <div className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                    {addOns.map((addon) => (
                        <div
                            key={addon.id}
                            className="flex flex-col gap-1 border-b border-white/5 py-2 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <span className="text-sm text-slate-300">{addon.name}</span>
                                {addon.note && <p className="text-[10px] text-slate-500">{addon.note}</p>}
                            </div>
                            <span className="text-sm font-bold text-gold-300">{addon.price}</span>
                        </div>
                    ))}
                </div>
            </div>
        </FrontendSection>
    );
}
