import { useState } from 'react';

import { FrontendSection } from '@/components/frontend/frontend-container';
import { SectionHeader } from '@/components/frontend/section-header';

interface FaqSectionProps {
    items: ReadonlyArray<{
        question: string;
        answer: string;
    }>;
}

export function FaqSection({ items }: FaqSectionProps) {
    const [open, setOpen] = useState<number>(0);

    return (
        <FrontendSection id="faq" narrow>
            <SectionHeader
                tag="FAQ"
                title={
                    <>
                        Frequently asked <span className="text-gold-grad">questions</span>
                    </>
                }
            />
            <div className="mt-10 space-y-3 sm:mt-12">
                {items.map((item, index) => (
                    <div key={item.question} className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
                        <button
                            type="button"
                            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                            onClick={() => setOpen(open === index ? -1 : index)}
                        >
                            <span className="text-sm font-bold text-white sm:text-base">{item.question}</span>
                            <div
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-gold-400 transition-transform ${open === index ? 'rotate-45' : ''}`}
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                                </svg>
                            </div>
                        </button>
                        {open === index && (
                            <div className="border-t border-white/5 px-4 py-4 text-sm leading-relaxed text-slate-300 sm:px-5">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </FrontendSection>
    );
}
