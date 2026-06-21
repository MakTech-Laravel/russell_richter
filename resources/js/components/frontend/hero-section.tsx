import { Link } from '@inertiajs/react';
import { Calendar, Check, Clock, Gauge, MapPin, Phone, Sparkles, User } from 'lucide-react';

import { BrandMark } from '@/components/brand';
import { FrontendSection } from '@/components/frontend/frontend-container';
import { MOBILE_LUBE } from '@/lib/mobile-lube';
import { register } from '@/routes';

export function HeroSection() {
    return (
        <FrontendSection id="home" padding="hero" className="overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-grid-gold opacity-30" />
                <div className="absolute -top-32 right-0 h-[520px] w-[520px] rounded-full bg-gold-500/15 blur-3xl" />
                <div className="absolute -bottom-20 left-0 h-[400px] w-[400px] rounded-full bg-gold-700/10 blur-3xl" />
            </div>

            <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
                <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gold-300">
                        <Sparkles className="h-3 w-3 shrink-0" /> #1 Mobile Oil Change in {MOBILE_LUBE.serviceArea}
                    </div>
                    <h1 className="mt-5 text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                        <span className="text-chrome">Clean. Fast.</span>
                        <br />
                        <span className="text-chrome">Reliable.</span>
                        <br />
                        <span className="text-gold-grad">We Come To You.</span>
                    </h1>
                    <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
                        Skip the waiting room. <span className="font-semibold text-white">{MOBILE_LUBE.name}</span>{' '}
                        delivers spill-free oil changes, filter replacement, battery service, and full vehicle care
                        right to your driveway, office, or job site.
                    </p>
                    <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                        <Link
                            href={register()}
                            className="ml-btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm uppercase tracking-wider"
                        >
                            <Calendar className="h-4 w-4" />
                            Book a Service
                        </Link>
                        <a
                            href={MOBILE_LUBE.phoneHref}
                            className="ml-btn-outline inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm uppercase tracking-wider"
                        >
                            <Phone className="h-4 w-4" />
                            {MOBILE_LUBE.phone}
                        </a>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs lg:justify-start">
                        <span className="flex items-center gap-1.5">
                            <Check className="h-4 w-4 text-gold-400" /> Spill-Free Tech
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Check className="h-4 w-4 text-gold-400" /> Same-Day Service
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Check className="h-4 w-4 text-gold-400" /> Quality Products
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Check className="h-4 w-4 text-gold-400" /> Experienced Techs
                        </span>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 p-2 shadow-2xl shadow-black/50">
                        <div className="relative flex h-[340px] flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-ink-700 via-ink-800 to-ink-900 sm:h-[400px] lg:h-[440px]">
                            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border-2 border-gold-500/30" />
                            <div className="pointer-events-none absolute right-10 top-10 h-32 w-32 rounded-full bg-gold-500/10 blur-2xl" />
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="h-40 w-40 rounded-full bg-gold-500/5 blur-3xl sm:h-52 sm:w-52" />
                            </div>

                            <div className="relative z-10 m-4 rounded-xl border border-white/10 bg-ink-900/90 p-3 backdrop-blur sm:m-6 sm:p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-gold-400">
                                            Next Appointment
                                        </div>
                                        <div className="mt-0.5 truncate text-sm font-bold text-white">
                                            Oil Change · 2018 F-150
                                        </div>
                                    </div>
                                    <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300 ring-1 ring-emerald-500/30">
                                        Confirmed
                                    </span>
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3 shrink-0 text-gold-400" /> Thu 10:00 AM
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3 shrink-0 text-gold-400" /> Victoria, TX
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User className="h-3 w-3 shrink-0 text-gold-400" /> Tech: Marcus
                                    </span>
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-1 items-center justify-center px-3 py-1 sm:px-5 sm:py-2">
                                <BrandMark className="h-auto max-h-32 w-auto max-w-[320px] opacity-95 mix-blend-lighten sm:max-h-36 sm:max-w-[380px] lg:max-h-44 lg:max-w-[440px]" />
                            </div>

                            <div className="relative z-10 grid grid-cols-3 gap-2 px-4 pb-4 sm:px-6 sm:pb-6">
                                {[
                                    { name: 'Oil', icon: Sparkles, val: '5W-30' },
                                    { name: 'Filter', icon: Gauge, val: 'OEM' },
                                    { name: 'Battery', icon: Check, val: 'Good' },
                                ].map((spec) => (
                                    <div
                                        key={spec.name}
                                        className="rounded-xl border border-gold-500/20 bg-ink-900/80 p-2.5 backdrop-blur sm:p-3"
                                    >
                                        <spec.icon className="h-4 w-4 text-gold-400" />
                                        <div className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:mt-2">
                                            {spec.name}
                                        </div>
                                        <div className="text-xs font-bold text-white sm:text-sm">{spec.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute -left-2 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-gold-500/30 bg-ink-900/90 px-3 py-2.5 shadow-xl backdrop-blur md:block lg:-left-4 lg:px-4 lg:py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-600 text-ink-900">
                                <Check className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gold-400">
                                    Spill-Free
                                </div>
                                <div className="text-xs text-white">Zero mess guarantee</div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-2 bottom-8 hidden rounded-2xl border border-gold-500/30 bg-ink-900/90 px-3 py-2.5 shadow-xl backdrop-blur md:block lg:-right-4 lg:bottom-10 lg:px-4 lg:py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gold-400">
                                    4.9 ★ Rated
                                </div>
                                <div className="text-xs text-white">200+ happy drivers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendSection>
    );
}
