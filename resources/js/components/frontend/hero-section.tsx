import { Link } from '@inertiajs/react';
import {
    Battery,
    CircleDot,
    Droplets,
    Filter,
    Truck,
    Wrench,
} from 'lucide-react';

import { MOBILE_LUBE } from '@/lib/mobile-lube';
import { Button } from '@/components/ui/button';

const iconMap = {
    droplets: Droplets,
    wrench: Wrench,
    truck: Truck,
    filter: Filter,
    circle: CircleDot,
    battery: Battery,
} as const;

interface HeroSectionProps {
    services: ReadonlyArray<{
        title: string;
        icon: keyof typeof iconMap;
        description: string;
    }>;
}

export function HeroSection({ services }: HeroSectionProps) {
    return (
        <section id="home" className="relative ml-hero-gradient overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />

            <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-32">
                <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-ml-gold animate-fadeInUp">
                        {MOBILE_LUBE.tagline}
                    </p>

                    <h1 className="mb-6 text-4xl font-bold italic leading-tight text-gray-900 md:text-5xl lg:text-6xl animate-fadeInUp delay-100">
                        Clean, Fast, Reliable{' '}
                        <span className="text-ml-gold">Mobile Oil Change</span>{' '}
                        Service
                    </h1>

                    <p className="mb-8 max-w-2xl text-lg text-gray-600 md:text-xl animate-fadeInUp delay-200">
                        {MOBILE_LUBE.subtitle}
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row animate-fadeInUp delay-300">
                        <Button
                            asChild
                            size="lg"
                            className="ml-gold-gradient border-0 px-8 font-bold text-ml-black hover:opacity-90"
                        >
                            <Link href={route('register')}>Create Account & Book</Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-amber-300 bg-transparent px-8 text-gray-900 hover:bg-amber-50 hover:text-ml-gold"
                        >
                            <Link href={route('login')}>Customer Login</Link>
                        </Button>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 animate-fadeInUp delay-400">
                        <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-ml-gold" />
                            {MOBILE_LUBE.serviceArea}
                        </span>
                        <span className="hidden sm:inline text-ml-gold/40">|</span>
                        <span>{MOBILE_LUBE.hours}</span>
                    </div>
                </div>

                <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {services.slice(0, 3).map((service, index) => {
                        const Icon = iconMap[service.icon];

                        return (
                            <div
                                key={service.title}
                                className="ml-card rounded-xl p-6 animate-fadeInUp"
                                style={{ animationDelay: `${500 + index * 100}ms` }}
                            >
                                <Icon className="mb-3 size-8 text-ml-gold" />
                                <h3 className="mb-2 font-semibold text-gray-900">{service.title}</h3>
                                <p className="text-sm text-gray-500">{service.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
