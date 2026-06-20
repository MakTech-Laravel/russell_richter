import { HOW_IT_WORKS } from '@/lib/mobile-lube';

import { FrontendSection } from '@/components/frontend/frontend-container';
import { SectionHeader } from '@/components/frontend/section-header';

export function HowItWorksSection() {
    return (
        <FrontendSection className="border-y border-white/5 bg-ink-900">
            <SectionHeader
                tag="How It Works"
                title={
                    <>
                        Service in <span className="text-gold-grad">three simple steps</span>
                    </>
                }
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-14">
                {HOW_IT_WORKS.map((step, index) => (
                    <div
                        key={step.num}
                        className="relative rounded-2xl border border-white/5 bg-gradient-to-b from-ink-800 to-ink-900 p-6 sm:p-8"
                    >
                        <div className="text-5xl font-black text-gold-grad opacity-90 sm:text-6xl">{step.num}</div>
                        <h3 className="mt-4 text-lg font-bold uppercase tracking-wide text-white sm:text-xl">
                            {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
                        {index < HOW_IT_WORKS.length - 1 && (
                            <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gold-500/40 md:block" />
                        )}
                    </div>
                ))}
            </div>
        </FrontendSection>
    );
}
