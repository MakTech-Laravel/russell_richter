import { Link } from '@inertiajs/react';
import {
    Battery,
    CircleDot,
    Droplets,
    Filter,
    Truck,
    Wrench,
} from 'lucide-react';

import { FrontendSection } from '@/components/frontend/frontend-container';
import { SectionHeader } from '@/components/frontend/section-header';
import { register } from '@/routes';

const iconMap = {
    droplets: Droplets,
    wrench: Wrench,
    truck: Truck,
    filter: Filter,
    circle: CircleDot,
    battery: Battery,
} as const;

interface ServicesSectionProps {
    services: ReadonlyArray<{
        title: string;
        icon: keyof typeof iconMap;
        description: string;
    }>;
}

export function ServicesSection({ services }: ServicesSectionProps) {
    return (
        <FrontendSection id="services">
            <SectionHeader
                tag="Services Offered"
                title={
                    <>
                        Full <span className="text-gold-grad">auto care</span> in your driveway
                    </>
                }
                subtitle="We bring the shop to you. Every job uses high-quality parts and spill-free equipment, leaving your vehicle better than we found it."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
                {services.map((service) => {
                    const Icon = iconMap[service.icon];

                    return (
                        <div
                            key={service.title}
                            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-ink-800 to-ink-900 p-6 transition hover:-translate-y-1 hover:border-gold-500/40"
                        >
                            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gold-500/0 blur-2xl transition group-hover:bg-gold-500/20" />
                            <div className="relative">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-500/30 bg-gradient-to-br from-ink-700 to-ink-800 text-gold-400 transition group-hover:bg-gradient-to-br group-hover:from-gold-300 group-hover:to-gold-600 group-hover:text-ink-900">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="mt-5 text-lg font-bold uppercase tracking-wide text-white">
                                    {service.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-400">{service.description}</p>
                                <Link
                                    href={register()}
                                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-gold-400 hover:text-gold-300"
                                >
                                    Book service
                                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </FrontendSection>
    );
}
