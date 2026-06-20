import * as React from 'react';

import { cn } from '@/lib/utils';

export function FrontendContainer({
    children,
    className,
    as: Component = 'div',
}: {
    children: React.ReactNode;
    className?: string;
    as?: 'div' | 'nav' | 'header' | 'footer';
}) {
    return <Component className={cn('container mx-auto px-4 md:px-6', className)}>{children}</Component>;
}

type SectionPadding = 'default' | 'compact' | 'hero' | 'none';

const paddingClasses: Record<SectionPadding, string> = {
    default: 'py-16 md:py-20 lg:py-24',
    compact: 'py-10 md:py-12',
    hero: 'py-12 sm:py-16 md:py-20 lg:py-28',
    none: '',
};

export function FrontendSection({
    id,
    children,
    className,
    containerClassName,
    padding = 'default',
    narrow = false,
}: {
    id?: string;
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    padding?: SectionPadding;
    narrow?: boolean;
}) {
    return (
        <section
            id={id}
            className={cn('relative', id && 'scroll-mt-28 md:scroll-mt-32', paddingClasses[padding], className)}
        >
            <FrontendContainer className={containerClassName}>
                <div className={cn(narrow && 'mx-auto max-w-4xl')}>{children}</div>
            </FrontendContainer>
        </section>
    );
}
