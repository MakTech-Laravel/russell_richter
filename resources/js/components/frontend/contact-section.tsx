import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import { BrandMark } from '@/components/brand';
import { MOBILE_LUBE } from '@/lib/mobile-lube';
import { Button } from '@/components/ui/button';

export function ContactSection() {
    return (
        <section id="contact" className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-5xl">
                    <div className="ml-card overflow-hidden rounded-2xl">
                        <div className="grid lg:grid-cols-2">
                            <div className="p-8 md:p-12">
                                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ml-gold">
                                    Get In Touch
                                </p>
                                <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                                    Book Your Mobile Oil Change
                                </h2>
                                <p className="mb-8 text-gray-600">
                                    Ready to skip the waiting room? Contact us today to schedule your on-site service anywhere in Victoria County.
                                </p>

                                <div className="flex flex-col gap-6">
                                    <a
                                        href={MOBILE_LUBE.phoneHref}
                                        className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:border-amber-200"
                                    >
                                        <div className="flex size-12 items-center justify-center rounded-lg bg-amber-50">
                                            <Phone className="size-5 text-ml-gold" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-gray-400">Call or Text</p>
                                            <p className="text-lg font-semibold text-gray-900">{MOBILE_LUBE.phone}</p>
                                        </div>
                                    </a>

                                    <a
                                        href={MOBILE_LUBE.emailHref}
                                        className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:border-amber-200"
                                    >
                                        <div className="flex size-12 items-center justify-center rounded-lg bg-amber-50">
                                            <Mail className="size-5 text-ml-gold" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-gray-400">Email</p>
                                            <p className="text-lg font-semibold text-gray-900">{MOBILE_LUBE.email}</p>
                                        </div>
                                    </a>

                                    <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
                                        <div className="flex size-12 items-center justify-center rounded-lg bg-amber-50">
                                            <MapPin className="size-5 text-ml-gold" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-gray-400">Service Area</p>
                                            <p className="text-lg font-semibold text-gray-900">{MOBILE_LUBE.serviceArea}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
                                        <div className="flex size-12 items-center justify-center rounded-lg bg-amber-50">
                                            <Clock className="size-5 text-ml-gold" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-gray-400">Hours</p>
                                            <p className="text-lg font-semibold text-gray-900">{MOBILE_LUBE.hours}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center border-t border-gray-200 bg-gray-50 p-8 text-center md:p-12 lg:border-t-0 lg:border-l">
                                <BrandMark className="mb-8 h-auto max-h-56 w-full max-w-md" />
                                <h3 className="mb-2 text-2xl font-bold italic text-gray-900">
                                    {MOBILE_LUBE.tagline}
                                </h3>
                                <p className="mb-8 max-w-sm text-gray-500">
                                    {MOBILE_LUBE.subtitle}
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="ml-gold-gradient border-0 px-8 font-bold text-ml-black hover:opacity-90"
                                    >
                                        <a href={MOBILE_LUBE.phoneHref}>Call Now</a>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="lg"
                                        className="border-amber-300 bg-transparent px-8 text-gray-900 hover:bg-amber-50 hover:text-ml-gold"
                                    >
                                        <a href={MOBILE_LUBE.emailHref}>Email Us</a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
