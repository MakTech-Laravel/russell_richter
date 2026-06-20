import { MOBILE_LUBE } from '@/lib/mobile-lube';
import { Button } from '@/components/ui/button';

export function AboutSection() {
    return (
        <section id="about" className="ml-section-dark py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ml-gold">
                            About Us
                        </p>
                        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                            Your Local Mobile Oil Change Company
                        </h2>
                        <div className="flex flex-col gap-4 text-gray-600">
                            <p>
                                Mobile Lube, LLC is a convenient, quick way to keep your vehicle — or entire fleet — in top running condition without ever leaving your location.
                            </p>
                            <p>
                                We deliver fast, essential mobile car maintenance performed at your home, office, or job site throughout Victoria County, Texas. Our focus is on professionalism, reliability, and exceptional customer service.
                            </p>
                            <p>
                                Whether you are a busy professional, a parent juggling schedules, or a business managing a fleet, Mobile Lube saves you time and eliminates the hassle of traditional shop visits.
                            </p>
                        </div>
                        <Button
                            asChild
                            className="mt-8 ml-gold-gradient border-0 font-bold text-ml-black hover:opacity-90"
                        >
                            <a href="#contact">Schedule Your Service</a>
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="ml-card rounded-2xl p-8">
                            <div className="mb-6 flex items-center justify-center">
                                <img
                                    src="/images/mobile-lube-logo.png"
                                    alt="Mobile Lube LLC"
                                    className="h-auto max-h-48 w-full max-w-sm object-contain"
                                />
                            </div>
                            <blockquote className="border-l-4 border-ml-gold pl-4 italic text-gray-600">
                                &ldquo;{MOBILE_LUBE.tagline} — {MOBILE_LUBE.subtitle}&rdquo;
                            </blockquote>
                            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
                                <div>
                                    <p className="text-2xl font-bold text-ml-gold">30 min</p>
                                    <p className="text-xs text-gray-400">Average service time</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-ml-gold">100%</p>
                                    <p className="text-xs text-gray-400">Mobile — we come to you</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
