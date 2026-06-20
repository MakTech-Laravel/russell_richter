import { Building2, Mail, Phone, Truck } from 'lucide-react';

import { MOBILE_LUBE } from '@/lib/mobile-lube';
import { Button } from '@/components/ui/button';

export function FleetSection() {
    return (
        <section id="fleet" className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl">
                    <div className="ml-card overflow-hidden rounded-2xl">
                        <div className="grid lg:grid-cols-2">
                            <div className="flex flex-col justify-center p-8 md:p-12">
                                <div className="mb-4 flex size-14 items-center justify-center rounded-lg bg-amber-50">
                                    <Truck className="size-7 text-ml-gold" />
                                </div>
                                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ml-gold">
                                    Fleet Services
                                </p>
                                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                    Custom Fleet Maintenance Plans
                                </h2>
                                <p className="mb-6 text-gray-600">
                                    Keep your business vehicles running smoothly with tailored fleet pricing and scheduled on-site maintenance. Contact us for a customized quote.
                                </p>
                                <ul className="mb-8 flex flex-col gap-2 text-sm text-gray-500">
                                    <li className="flex items-center gap-2">
                                        <Building2 className="size-4 text-ml-gold" />
                                        Company & fleet vehicle management
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Truck className="size-4 text-ml-gold" />
                                        Cars, trucks, vans & light-duty diesel
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Phone className="size-4 text-ml-gold" />
                                        Flexible scheduling for your operations
                                    </li>
                                </ul>
                            </div>

                            <div className="border-t border-gray-200 bg-gray-50 p-8 md:p-12 lg:border-t-0 lg:border-l">
                                <h3 className="mb-6 text-xl font-semibold text-gray-900">Request Fleet Pricing</h3>
                                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <input
                                            type="text"
                                            placeholder="Company Name"
                                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-ml-gold focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Contact Name"
                                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-ml-gold focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-ml-gold focus:outline-none"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-ml-gold focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <input
                                            type="number"
                                            placeholder="Number of Vehicles"
                                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-ml-gold focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Vehicle Types"
                                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-ml-gold focus:outline-none"
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Notes or special requirements"
                                        rows={3}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-ml-gold focus:outline-none"
                                    />
                                    <Button
                                        asChild
                                        className="ml-gold-gradient border-0 font-bold text-ml-black hover:opacity-90"
                                    >
                                        <a href={MOBILE_LUBE.emailHref}>
                                            <Mail className="size-4" />
                                            Send Fleet Inquiry
                                        </a>
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
