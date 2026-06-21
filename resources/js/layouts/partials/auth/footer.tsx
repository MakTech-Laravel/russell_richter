import { Link } from '@inertiajs/react';

import AppLogo from '@/components/app-logo';
import { MOBILE_LUBE, NAV_LINKS } from '@/lib/mobile-lube';

export function AuthFooter() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-6 py-12 md:px-8">
                <div className="grid grid-cols-1 gap-12 xl:grid-cols-3">
                    <div className="flex flex-col gap-4">
                        <AppLogo />
                        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                            {MOBILE_LUBE.name} delivers spill-free oil changes and mobile vehicle care across{' '}
                            {MOBILE_LUBE.serviceArea}. {MOBILE_LUBE.tagline}.
                        </p>
                        <a href={MOBILE_LUBE.emailHref} className="text-sm text-muted-foreground hover:text-foreground">
                            {MOBILE_LUBE.email}
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:col-span-2">
                        <FooterSection
                            title="Services"
                            links={[
                                { label: 'Oil Change', href: '/#services' },
                                { label: 'Pricing', href: '/#pricing' },
                                { label: 'Fleet', href: '/#fleet' },
                            ]}
                        />
                        <FooterSection
                            title="Company"
                            links={NAV_LINKS.map((link) => ({ label: link.label, href: `/${link.href}` }))}
                        />
                        <FooterSection
                            title="Contact"
                            links={[
                                { label: MOBILE_LUBE.phone, href: MOBILE_LUBE.phoneHref },
                                { label: MOBILE_LUBE.email, href: MOBILE_LUBE.emailHref },
                                { label: 'Book Now', href: '/register' },
                            ]}
                        />
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} {MOBILE_LUBE.name}. All rights reserved.
                    </p>
                    <a href={MOBILE_LUBE.emailHref} className="text-xs text-muted-foreground hover:text-foreground">
                        {MOBILE_LUBE.email}
                    </a>
                </div>
            </div>
        </footer>
    );
}

function FooterSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h3>
            <ul className="flex flex-col gap-2">
                {links.map((link) => (
                    <li key={link.label}>
                        <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
