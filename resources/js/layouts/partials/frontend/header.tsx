import { Link } from '@inertiajs/react';
import { Calendar, Clock, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';

import { FullLogo } from '@/components/brand';
import { FrontendContainer } from '@/components/frontend/frontend-container';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { MOBILE_LUBE, NAV_LINKS } from '@/lib/mobile-lube';
import { cn } from '@/lib/utils';
import { login, register } from '@/routes';

const SECTION_IDS = NAV_LINKS.map((link) => link.href.replace('#', ''));

function navLinkClass(isActive: boolean, mobile = false): string {
    return cn(
        'relative transition-colors',
        mobile
            ? cn(
                'border-b border-white/5 py-3',
                isActive ? 'text-gold-400' : 'text-slate-300 hover:text-gold-400',
            )
            : cn(
                'py-1 after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:rounded-full after:bg-gold-400 after:transition-opacity',
                isActive
                    ? 'text-gold-400 after:opacity-100'
                    : 'text-slate-300 hover:text-gold-400 after:opacity-0',
            ),
    );
}

export function FrontendHeader() {
    const [open, setOpen] = useState(false);
    const activeSection = useScrollSpy(SECTION_IDS);

    return (
        <div className="sticky top-0 z-50" data-frontend-header>
            <div className="bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-ink-900">
                <FrontendContainer className="flex items-center justify-between gap-3 py-1.5 text-[11px] font-bold uppercase tracking-widest">
                    <span className="flex min-w-0 items-center gap-1.5 truncate">
                        <MapPin className="h-3 w-3 shrink-0" /> Servicing {MOBILE_LUBE.serviceArea}
                    </span>
                    <span className="hidden shrink-0 items-center gap-4 sm:flex">
                        <a href={MOBILE_LUBE.phoneHref} className="flex items-center gap-1.5 hover:opacity-80">
                            <Phone className="h-3 w-3" /> {MOBILE_LUBE.phone}
                        </a>
                        <a href={MOBILE_LUBE.emailHref} className="flex items-center gap-1.5 hover:opacity-80">
                            <Mail className="h-3 w-3" /> {MOBILE_LUBE.email}
                        </a>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> {MOBILE_LUBE.hours}
                        </span>
                    </span>
                </FrontendContainer>
            </div>

            <header className="border-b border-white/5 bg-ink-900/95 shadow-lg shadow-black/20 backdrop-blur-md">
                <FrontendContainer className="flex items-center justify-between gap-4 py-4">
                    <Link href="/" className="shrink-0">
                        <FullLogo />
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-wider xl:gap-8 lg:flex">
                        {NAV_LINKS.map((link) => {
                            const sectionId = link.href.replace('#', '');
                            const isActive = activeSection === sectionId;

                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={navLinkClass(isActive)}
                                    aria-current={isActive ? 'true' : undefined}
                                >
                                    {link.label}
                                </a>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href={login()}
                            className="ml-btn-ghost hidden rounded-lg px-3 py-2 text-sm font-semibold md:inline-flex"
                        >
                            Sign in
                        </Link>
                        <Link
                            href={register()}
                            className="ml-btn-primary inline-flex h-10 items-center gap-2 rounded-lg px-3 text-xs font-bold uppercase tracking-wider sm:px-4 sm:text-sm"
                        >
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span className="hidden sm:inline">Book Now</span>
                            <span className="sm:hidden">Book</span>
                        </Link>
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
                            onClick={() => setOpen((value) => !value)}
                            aria-label={open ? 'Close menu' : 'Open menu'}
                            aria-expanded={open}
                        >
                            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </FrontendContainer>

                {open && (
                    <div className="border-t border-white/5 bg-ink-900 lg:hidden">
                        <FrontendContainer className="py-3">
                            <nav className="flex flex-col text-sm font-semibold uppercase tracking-wider">
                                {NAV_LINKS.map((link) => {
                                    const sectionId = link.href.replace('#', '');
                                    const isActive = activeSection === sectionId;

                                    return (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className={navLinkClass(isActive, true)}
                                            aria-current={isActive ? 'true' : undefined}
                                            onClick={() => setOpen(false)}
                                        >
                                            {link.label}
                                        </a>
                                    );
                                })}
                                <Link
                                    href={login()}
                                    className="py-3 text-slate-300 transition hover:text-gold-400"
                                    onClick={() => setOpen(false)}
                                >
                                    Sign in
                                </Link>
                                <a
                                    href={MOBILE_LUBE.emailHref}
                                    className="flex items-center gap-2 py-3 text-gold-400"
                                >
                                    <Mail className="h-4 w-4" />
                                    {MOBILE_LUBE.email}
                                </a>
                                <a
                                    href={MOBILE_LUBE.phoneHref}
                                    className="flex items-center gap-2 py-3 text-gold-400"
                                >
                                    <Phone className="h-4 w-4" />
                                    {MOBILE_LUBE.phone}
                                </a>
                            </nav>
                        </FrontendContainer>
                    </div>
                )}
            </header>
        </div>
    );
}
