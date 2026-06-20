import { Link } from '@inertiajs/react';
import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { MOBILE_LUBE, NAV_LINKS } from '@/lib/mobile-lube';
import { cn } from '@/lib/utils';

export function FrontendHeader() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = (): void => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 border-b transition-all duration-300',
                scrolled
                    ? 'border-gray-300 bg-white/95 backdrop-blur-md shadow-lg shadow-gray-200/50'
                    : 'border-transparent bg-white',
            )}
        >
            <div className="hidden border-b border-gray-200 bg-gray-50 py-2 md:block">
                <div className="container mx-auto flex items-center justify-between px-4 text-xs text-gray-500">
                    <span>{MOBILE_LUBE.serviceArea} · {MOBILE_LUBE.hours}</span>
                    <a href={MOBILE_LUBE.phoneHref} className="flex items-center gap-1.5 hover:text-ml-gold">
                        <Phone className="size-3" />
                        {MOBILE_LUBE.phone}
                    </a>
                </div>
            </div>

            <nav className="container mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center">
                    <AppLogo className="h-12 w-auto md:h-14" />
                </Link>

                <div className="hidden items-center gap-1 lg:flex">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-ml-gold"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <a
                        href={MOBILE_LUBE.phoneHref}
                        className="hidden items-center gap-2 text-sm font-medium text-gray-600 hover:text-ml-gold lg:flex"
                    >
                        <Phone className="size-4" />
                        {MOBILE_LUBE.phone}
                    </a>
                    <Button
                        asChild
                        className="ml-gold-gradient border-0 font-bold text-ml-black hover:opacity-90"
                    >
                        <Link href={route('register')}>Book Now</Link>
                    </Button>
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            className="flex size-10 items-center justify-center rounded-md text-ml-gold md:hidden"
                            aria-label="Open menu"
                        >
                            <Menu className="size-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="right" className="border-gray-300 bg-white p-0">
                        <div className="flex items-center justify-between border-b border-gray-200 p-4">
                            <AppLogo className="h-10 w-auto" />
                            <SheetClose asChild>
                                <button type="button" className="text-gray-600 hover:text-ml-gold" aria-label="Close menu">
                                    <X className="size-5" />
                                </button>
                            </SheetClose>
                        </div>
                        <div className="flex flex-col gap-1 p-4">
                            {NAV_LINKS.map((link) => (
                                <SheetClose asChild key={link.href}>
                                    <a
                                        href={link.href}
                                        className="rounded-md px-4 py-3 text-base font-medium text-gray-600 hover:bg-amber-50 hover:text-ml-gold"
                                    >
                                        {link.label}
                                    </a>
                                </SheetClose>
                            ))}
                            <SheetClose asChild>
                                <a
                                    href={MOBILE_LUBE.phoneHref}
                                    className="mt-4 flex items-center gap-2 rounded-md px-4 py-3 text-ml-gold"
                                >
                                    <Phone className="size-4" />
                                    {MOBILE_LUBE.phone}
                                </a>
                            </SheetClose>
                            <SheetClose asChild>
                                <Button
                                    asChild
                                    className="mt-2 ml-gold-gradient border-0 font-bold text-ml-black"
                                >
                                    <Link href={route('register')}>Create Account</Link>
                                </Button>
                            </SheetClose>
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>
        </header>
    );
}
