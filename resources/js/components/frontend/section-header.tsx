import * as React from 'react';

interface SectionHeaderProps {
    tag: string;
    title: React.ReactNode;
    subtitle?: string;
    align?: 'left' | 'center';
}

export function SectionHeader({ tag, title, subtitle, align = 'center' }: SectionHeaderProps) {
    return (
        <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gold-300">
                {tag}
            </div>
            <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                {title}
            </h2>
            {subtitle && <p className="mt-4 text-base leading-relaxed text-slate-400">{subtitle}</p>}
        </div>
    );
}
