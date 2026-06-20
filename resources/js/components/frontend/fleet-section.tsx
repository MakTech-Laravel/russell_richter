import { Building2, Mail, Phone, Truck } from 'lucide-react';

import { FrontendSection } from '@/components/frontend/frontend-container';
import { SectionHeader } from '@/components/frontend/section-header';
import { MOBILE_LUBE } from '@/lib/mobile-lube';

export function FleetSection() {
    return (
        <FrontendSection id="fleet">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900">
                <div className="grid lg:grid-cols-2">
                    <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
                        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-gold-500/30 bg-gradient-to-br from-ink-700 to-ink-800 text-gold-400">
                            <Truck className="size-7" />
                        </div>
                        <SectionHeader
                            align="left"
                            tag="Fleet Services"
                            title={
                                <>
                                    Custom <span className="text-gold-grad">fleet</span> maintenance plans
                                </>
                            }
                            subtitle="Keep your business vehicles running smoothly with tailored fleet pricing and scheduled on-site maintenance."
                        />
                        <ul className="mt-6 flex flex-col gap-2.5 text-sm text-slate-400">
                            <li className="flex items-center gap-2">
                                <Building2 className="size-4 shrink-0 text-gold-400" />
                                Company & fleet vehicle management
                            </li>
                            <li className="flex items-center gap-2">
                                <Truck className="size-4 shrink-0 text-gold-400" />
                                Cars, trucks, vans & light-duty diesel
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="size-4 shrink-0 text-gold-400" />
                                Flexible scheduling for your operations
                            </li>
                        </ul>
                    </div>

                    <div className="border-t border-white/5 bg-ink-900/50 p-6 md:p-10 lg:border-l lg:border-t-0 lg:p-12">
                        <h3 className="mb-6 text-xl font-bold uppercase tracking-wide text-white">
                            Request Fleet Pricing
                        </h3>
                        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <input type="text" placeholder="Company Name" className="ml-auth-input" />
                                <input type="text" placeholder="Contact Name" className="ml-auth-input" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <input type="tel" placeholder="Phone" className="ml-auth-input" />
                                <input type="email" placeholder="Email" className="ml-auth-input" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <input type="number" placeholder="Number of Vehicles" className="ml-auth-input" />
                                <input type="text" placeholder="Vehicle Types" className="ml-auth-input" />
                            </div>
                            <textarea
                                placeholder="Notes or special requirements"
                                rows={3}
                                className="ml-auth-input resize-none"
                            />
                            <a
                                href={MOBILE_LUBE.emailHref}
                                className="ml-btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-bold uppercase tracking-wider"
                            >
                                <Mail className="size-4" />
                                Send Fleet Inquiry
                            </a>
                        </form>
                    </div>
                </div>
            </div>
        </FrontendSection>
    );
}
