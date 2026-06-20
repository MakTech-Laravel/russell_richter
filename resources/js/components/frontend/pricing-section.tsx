import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PricingSectionProps {
    packages: ReadonlyArray<{
        name: string;
        price: number;
        popular: boolean;
        features: ReadonlyArray<string>;
    }>;
    addOns: ReadonlyArray<{
        name: string;
        price: string;
        note: string | null;
    }>;
}

export function PricingSection({ packages, addOns }: PricingSectionProps) {
    return (
        <section id="pricing" className="ml-section-dark py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ml-gold">
                        Transparent Pricing
                    </p>
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        Service Packages
                    </h2>
                    <p className="text-gray-600">
                        Upfront pricing with no hidden fees. All services include on-site mobile delivery.
                    </p>
                </div>

                <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.name}
                            className={`relative flex flex-col rounded-xl p-8 ml-card ${pkg.popular ? 'ml-pricing-popular' : ''}`}
                        >
                            {pkg.popular && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full ml-gold-gradient px-4 py-1 text-xs font-bold uppercase text-ml-black">
                                    Most Popular
                                </span>
                            )}

                            <h3 className="mb-2 text-lg font-semibold text-gray-900">{pkg.name}</h3>
                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-ml-gold">${pkg.price}</span>
                            </div>

                            <ul className="mb-8 flex flex-1 flex-col gap-3">
                                {pkg.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                                        <Check className="mt-0.5 size-4 shrink-0 text-ml-gold" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                asChild
                                className={`w-full font-bold ${pkg.popular ? 'ml-gold-gradient border-0 text-ml-black hover:opacity-90' : 'border-amber-300 bg-transparent text-gray-900 hover:bg-amber-50 hover:text-ml-gold'}`}
                                variant={pkg.popular ? 'default' : 'outline'}
                            >
                                <a href="#contact">Book This Service</a>
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mx-auto mt-16 max-w-4xl">
                    <h3 className="mb-8 text-center text-2xl font-bold text-gray-900">Additional Services</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {addOns.map((addon) => (
                            <div
                                key={addon.name}
                                className="flex flex-col justify-between rounded-lg border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center"
                            >
                                <div>
                                    <h4 className="font-semibold text-gray-900">{addon.name}</h4>
                                    {addon.note && (
                                        <p className="mt-1 text-xs text-ml-gold/80">{addon.note}</p>
                                    )}
                                </div>
                                <p className="mt-2 text-lg font-bold text-ml-gold sm:mt-0">{addon.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
