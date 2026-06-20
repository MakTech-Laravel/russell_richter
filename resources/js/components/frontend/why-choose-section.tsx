import { Calendar, Clock, Droplets, MapPin, Shield, Sparkles, Wrench } from 'lucide-react';

import { FrontendSection } from '@/components/frontend/frontend-container';
import { SectionHeader } from '@/components/frontend/section-header';

const iconList = [MapPin, Clock, Droplets, Shield, Sparkles, Wrench, Calendar, Shield] as const;

interface WhyChooseSectionProps {
    items: ReadonlyArray<{
        title: string;
        description: string;
    }>;
}

export function WhyChooseSection({ items }: WhyChooseSectionProps) {
    return (
        <FrontendSection id="why">
            <SectionHeader
                tag="Why Mobile Lube"
                title={
                    <>
                        Built for drivers who <span className="text-gold-grad">value their time</span>
                    </>
                }
                subtitle="From single-vehicle owners to enterprise fleets, our service model is faster, cleaner, and more transparent than a traditional shop."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
                {items.map((item, index) => {
                    const Icon = iconList[index % iconList.length];

                    return (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-white/5 bg-ink-800/60 p-5 transition hover:border-gold-500/30"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 text-ink-900 shadow-lg shadow-gold-700/30">
                                <Icon className="h-5 w-5" />
                            </div>
                            <h4 className="mt-4 text-base font-bold uppercase tracking-wide text-white">
                                {item.title}
                            </h4>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.description}</p>
                        </div>
                    );
                })}
            </div>
        </FrontendSection>
    );
}
