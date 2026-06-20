import {
    Battery,
    CircleDot,
    Droplets,
    Filter,
    Truck,
    Wrench,
} from 'lucide-react';

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
        <section id="services" className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ml-gold">
                        What We Offer
                    </p>
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        Mobile Maintenance Services
                    </h2>
                    <p className="text-gray-600">
                        Professional vehicle care delivered wherever you are — home, office, or job site.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                        const Icon = iconMap[service.icon];

                        return (
                            <div key={service.title} className="ml-card group rounded-xl p-8">
                                <div className="mb-4 flex size-14 items-center justify-center rounded-lg bg-amber-50 transition-colors group-hover:bg-amber-100">
                                    <Icon className="size-7 text-ml-gold" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">{service.title}</h3>
                                <p className="text-sm leading-relaxed text-gray-500">{service.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
