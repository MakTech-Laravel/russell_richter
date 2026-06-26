import { useForm } from '@inertiajs/react';
import { Building2, Mail, Phone, Truck } from 'lucide-react';
import { FormEvent } from 'react';
import { FrontendSection } from '@/components/frontend/frontend-container';
import { SectionHeader } from '@/components/frontend/section-header';
import { MOBILE_LUBE } from '@/lib/mobile-lube';

export function FleetSection() {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        vehicle_count: '',
        vehicle_types: '',
        message: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        post(route('contact-messages.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

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
                        <form className="flex flex-col gap-4" onSubmit={submit}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        value={data.company_name}
                                        onChange={(event) => setData('company_name', event.target.value)}
                                        className="ml-auth-input"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Contact Name"
                                        value={data.contact_name}
                                        onChange={(event) => setData('contact_name', event.target.value)}
                                        className="ml-auth-input"
                                    />
                                    {errors.contact_name && <p className="mt-1 text-xs text-rose-400">{errors.contact_name}</p>}
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        value={data.phone}
                                        onChange={(event) => setData('phone', event.target.value)}
                                        className="ml-auth-input"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        className="ml-auth-input"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <input
                                        type="number"
                                        min={1}
                                        placeholder="Number of Vehicles"
                                        value={data.vehicle_count}
                                        onChange={(event) => setData('vehicle_count', event.target.value)}
                                        className="ml-auth-input"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Vehicle Types"
                                        value={data.vehicle_types}
                                        onChange={(event) => setData('vehicle_types', event.target.value)}
                                        className="ml-auth-input"
                                    />
                                </div>
                            </div>
                            <textarea
                                placeholder="Notes or special requirements"
                                rows={4}
                                value={data.message}
                                onChange={(event) => setData('message', event.target.value)}
                                className="ml-auth-input resize-none"
                            />
                            {errors.message && <p className="-mt-2 text-xs text-rose-400">{errors.message}</p>}

                            {recentlySuccessful && (
                                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                                    Thanks. Your request was sent successfully.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="ml-btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-bold uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Mail className="size-4" />
                                {processing ? 'Sending...' : 'Send Fleet Inquiry'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </FrontendSection>
    );
}
