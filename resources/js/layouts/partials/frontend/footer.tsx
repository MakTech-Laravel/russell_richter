import { Link } from '@inertiajs/react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import { FullLogo } from '@/components/brand';
import { FrontendContainer } from '@/components/frontend/frontend-container';
import { MOBILE_LUBE, NAV_LINKS } from '@/lib/mobile-lube';

export function FrontendFooter() {
    return (
        <footer className="border-t border-white/5 bg-ink-900">
            <FrontendContainer className="py-12 md:py-16">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <Link href="/">
                            <FullLogo />
                        </Link>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                            {MOBILE_LUBE.name} delivers spill-free oil changes, filters, batteries, and full vehicle
                            care to your driveway across {MOBILE_LUBE.serviceArea}.
                        </p>
                        <div className="mt-5 space-y-2.5 text-sm text-slate-300">
                            <a href={MOBILE_LUBE.phoneHref} className="flex items-center gap-2 hover:text-gold-300">
                                <Phone className="h-4 w-4 shrink-0 text-gold-400" /> {MOBILE_LUBE.phone}
                            </a>
                            <a href={MOBILE_LUBE.emailHref} className="flex items-center gap-2 hover:text-gold-300">
                                <Mail className="h-4 w-4 shrink-0 text-gold-400" /> {MOBILE_LUBE.email}
                            </a>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 shrink-0 text-gold-400" /> {MOBILE_LUBE.serviceArea}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 shrink-0 text-gold-400" /> {MOBILE_LUBE.hours}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400">Services</h4>
                        <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                            <li>
                                <a href="#services" className="hover:text-gold-300">
                                    Oil Change
                                </a>
                            </li>
                            <li>
                                <a href="#services" className="hover:text-gold-300">
                                    Filter Replacement
                                </a>
                            </li>
                            <li>
                                <a href="#services" className="hover:text-gold-300">
                                    Battery
                                </a>
                            </li>
                            <li>
                                <a href="#services" className="hover:text-gold-300">
                                    Tire Rotation
                                </a>
                            </li>
                            <li>
                                <a href="#fleet" className="hover:text-gold-300">
                                    Fleet
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="lg:col-span-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400">Company</h4>
                        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-slate-400 sm:grid-cols-1">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a href={link.href} className="hover:text-gold-300">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row">
                    <div>
                        &copy; {new Date().getFullYear()} {MOBILE_LUBE.name}. All rights reserved.
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
                        {/* <span>{MOBILE_LUBE.domain}</span> */}
                        <a href={MOBILE_LUBE.emailHref} className="hover:text-gold-300">
                            {MOBILE_LUBE.email}
                        </a>
                    </div>
                </div>
            </FrontendContainer>
        </footer>
    );
}
