import { TESTIMONIALS } from '@/lib/mobile-lube';

import { FrontendSection } from '@/components/frontend/frontend-container';
import { SectionHeader } from '@/components/frontend/section-header';

export function TestimonialsSection() {
    return (
        <FrontendSection>
            <SectionHeader
                tag="Customer Reviews"
                title={
                    <>
                        What your <span className="text-gold-grad">neighbors</span> say
                    </>
                }
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-14">
                {TESTIMONIALS.map((review) => (
                    <div
                        key={review.name}
                        className="relative rounded-2xl border border-white/5 bg-gradient-to-br from-ink-800 to-ink-900 p-5 sm:p-6"
                    >
                        <div className="flex text-gold-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 1.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.3 2.7 1-5.8L1.5 7.6l5.9-.8z" />
                                </svg>
                            ))}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300">&ldquo;{review.text}&rdquo;</p>
                        <div className="mt-4 flex items-center gap-3 border-t border-white/5 pt-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-sm font-bold text-ink-900">
                                {review.name
                                    .split(' ')
                                    .map((part) => part[0])
                                    .join('')}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">{review.name}</div>
                                <div className="text-[11px] text-slate-500">{review.date}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </FrontendSection>
    );
}
