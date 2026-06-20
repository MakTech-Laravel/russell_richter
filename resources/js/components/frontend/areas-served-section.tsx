import { MapPin, Wrench } from 'lucide-react';

import { FrontendSection } from '@/components/frontend/frontend-container';
import { SectionHeader } from '@/components/frontend/section-header';
import { MOBILE_LUBE, SERVICE_AREAS } from '@/lib/mobile-lube';

export function AreasServedSection() {
    return (
        <FrontendSection
            id="areas"
            className="border-y border-white/5 bg-gradient-to-b from-ink-900 via-ink-800/30 to-ink-900"
        >
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
                <div>
                    <SectionHeader
                        align="left"
                        tag="Areas We Serve"
                        title={
                            <>
                                Currently serving{' '}
                                <span className="text-gold-grad">{MOBILE_LUBE.serviceArea}</span>
                            </>
                        }
                        subtitle="Fast, reliable mobile service across the region. Don't see your city? Reach out — we're expanding fast."
                    />
                    <div className="mt-8 flex flex-wrap gap-2">
                        {SERVICE_AREAS.map((area) => (
                            <span
                                key={area}
                                className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/5 px-3 py-1.5 text-xs font-semibold text-gold-200"
                            >
                                <MapPin className="h-3 w-3 text-gold-400" /> {area}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10 bg-ink-900 sm:h-72 lg:h-80">
                    <div className="absolute inset-0 bg-grid-gold opacity-40" />
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 320">
                        <path
                            d="M 30 200 Q 130 150 230 220 T 380 240"
                            stroke="#f5a000"
                            strokeWidth="2"
                            fill="none"
                            opacity="0.5"
                            strokeDasharray="6 4"
                        />
                        <path
                            d="M 200 20 Q 230 130 180 220 T 150 310"
                            stroke="#f5a000"
                            strokeWidth="2"
                            fill="none"
                            opacity="0.5"
                            strokeDasharray="6 4"
                        />
                        <path
                            d="M 50 60 Q 200 100 350 70"
                            stroke="#f5a000"
                            strokeWidth="2"
                            fill="none"
                            opacity="0.5"
                            strokeDasharray="6 4"
                        />
                    </svg>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="relative inline-flex">
                            <div className="absolute inset-0 animate-ping rounded-full bg-gold-400/40" />
                            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-ink-900 ring-4 ring-ink-900">
                                <Wrench className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-2 inline-block rounded-md bg-ink-800/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold-300 backdrop-blur">
                            Mobile Lube HQ
                        </div>
                    </div>
                    {[
                        { x: 18, y: 25 },
                        { x: 78, y: 30 },
                        { x: 22, y: 70 },
                        { x: 82, y: 72 },
                        { x: 50, y: 18 },
                        { x: 50, y: 82 },
                    ].map((point, index) => (
                        <div key={index} className="absolute" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
                            <div className="h-3 w-3 rounded-full bg-gold-400 ring-2 ring-ink-900 shadow-[0_0_10px_rgba(255,184,32,0.6)]" />
                        </div>
                    ))}
                </div>
            </div>
        </FrontendSection>
    );
}
