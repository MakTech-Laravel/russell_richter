import { TRUST_STATS } from '@/lib/mobile-lube';

import { FrontendSection } from '@/components/frontend/frontend-container';

import type { GoogleReviewSummary } from '@/components/frontend/testimonials-section';

interface TrustBarSectionProps {
    googleReviewSummary?: GoogleReviewSummary;
}

export function TrustBarSection({ googleReviewSummary }: TrustBarSectionProps) {
    const stats = TRUST_STATS.map((stat) => {
        if (stat.label === '& Operated') {
            return stat;
        }

        if (stat.label === 'Avg. Rating' && googleReviewSummary?.rating) {
            return {
                ...stat,
                value: `${googleReviewSummary.rating.toFixed(1)}★`,
            };
        }

        return stat;
    });

    return (
        <FrontendSection padding="compact" className="border-y border-white/5 bg-ink-800/50">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                        <div className="text-2xl font-black text-gold-grad sm:text-3xl md:text-4xl">{stat.value}</div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-[11px]">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </FrontendSection>
    );
}
