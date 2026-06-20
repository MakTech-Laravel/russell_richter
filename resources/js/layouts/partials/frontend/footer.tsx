import { Link } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { MOBILE_LUBE, NAV_LINKS } from '@/lib/mobile-lube';

export function FrontendFooter() {
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block">
                            <AppLogo className="h-14 w-auto" />
                        </Link>
                        <p className="mt-4 text-sm leading-relaxed text-gray-500">
                            {MOBILE_LUBE.subtitle}
                        </p>
                        <Button
                            asChild
                            className="mt-4 ml-gold-gradient border-0 font-bold text-ml-black hover:opacity-90"
                        >
                            <a href="#contact">Book Your Service</a>
                        </Button>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ml-gold">
                            Quick Links
                        </h4>
                        <nav className="flex flex-col gap-2">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-gray-500 transition-colors hover:text-ml-gold"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ml-gold">
                            Services
                        </h4>
                        <nav className="flex flex-col gap-2 text-sm text-gray-500">
                            <a href="#pricing" className="transition-colors hover:text-ml-gold">Full Synthetic Oil Change</a>
                            <a href="#pricing" className="transition-colors hover:text-ml-gold">Conventional Oil Change</a>
                            <a href="#pricing" className="transition-colors hover:text-ml-gold">Diesel Oil Change</a>
                            <a href="#pricing" className="transition-colors hover:text-ml-gold">Filter Replacement</a>
                            <a href="#fleet" className="transition-colors hover:text-ml-gold">Fleet Services</a>
                        </nav>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ml-gold">
                            Contact
                        </h4>
                        <div className="flex flex-col gap-3 text-sm text-gray-500">
                            <a href={MOBILE_LUBE.phoneHref} className="flex items-center gap-2 transition-colors hover:text-ml-gold">
                                <Phone className="size-4 shrink-0 text-ml-gold" />
                                {MOBILE_LUBE.phone}
                            </a>
                            <a href={MOBILE_LUBE.emailHref} className="flex items-center gap-2 transition-colors hover:text-ml-gold">
                                <Mail className="size-4 shrink-0 text-ml-gold" />
                                {MOBILE_LUBE.email}
                            </a>
                            <span className="flex items-start gap-2">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-ml-gold" />
                                {MOBILE_LUBE.serviceArea}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 bg-gray-50">
                <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row">
                    <p className="text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} {MOBILE_LUBE.name}. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-400">
                        {MOBILE_LUBE.domain} · {MOBILE_LUBE.hours}
                    </p>
                </div>
            </div>
        </footer>
    );
}
