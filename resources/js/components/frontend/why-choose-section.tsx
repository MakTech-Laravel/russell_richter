import {
    Clock,
    MapPin,
    Shield,
    Sparkles,
    Star,
    Truck,
} from 'lucide-react';

const iconList = [Truck, Clock, Shield, Sparkles, Star, MapPin];

interface WhyChooseSectionProps {
    items: ReadonlyArray<{
        title: string;
        description: string;
    }>;
}

export function WhyChooseSection({ items }: WhyChooseSectionProps) {
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ml-gold">
                        Why Mobile Lube
                    </p>
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        Why Choose Us
                    </h2>
                    <p className="text-gray-600">
                        Reliable mobile car care built around your schedule, not ours.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => {
                        const Icon = iconList[index % iconList.length];

                        return (
                            <div key={item.title} className="flex gap-4 rounded-xl border border-gray-200 p-6 transition-colors hover:border-amber-200">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                                    <Icon className="size-6 text-ml-gold" />
                                </div>
                                <div>
                                    <h3 className="mb-1 font-semibold text-gray-900">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
