import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FaqSectionProps {
    items: ReadonlyArray<{
        question: string;
        answer: string;
    }>;
}

export function FaqSection({ items }: FaqSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="ml-section-dark py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ml-gold">
                        FAQ
                    </p>
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600">
                        Everything you need to know about our mobile oil change service.
                    </p>
                </div>

                <div className="mx-auto flex max-w-3xl flex-col gap-3">
                    {items.map((item, index) => (
                        <Collapsible
                            key={item.question}
                            open={openIndex === index}
                            onOpenChange={(open) => setOpenIndex(open ? index : null)}
                        >
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                                <CollapsibleTrigger className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-amber-50">
                                    <span className="pr-4 font-semibold text-gray-900">{item.question}</span>
                                    <ChevronDown
                                        className={`size-5 shrink-0 text-ml-gold transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                                    />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <p className="border-t border-gray-200 px-6 py-4 text-sm leading-relaxed text-gray-600">
                                        {item.answer}
                                    </p>
                                </CollapsibleContent>
                            </div>
                        </Collapsible>
                    ))}
                </div>
            </div>
        </section>
    );
}
