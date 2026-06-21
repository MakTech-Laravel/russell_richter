import { MOBILE_LUBE } from '@/lib/mobile-lube';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
    className?: string;
}

export function BrandMark({ className = 'h-14 w-auto max-w-[240px]' }: BrandLogoProps) {
    return (
        <img
            src={MOBILE_LUBE.logoPath}
            alt={MOBILE_LUBE.logoAlt}
            className={cn('h-auto object-contain', className)}
        />
    );
}

export function FullLogo({ className = '' }: BrandLogoProps) {
    return <BrandMark className={cn('h-16 w-auto max-w-[280px] sm:max-w-[340px]', className)} />;
}

export function CompactLogo({ className = '' }: BrandLogoProps) {
    return <BrandMark className={cn('h-11 w-auto max-w-[220px]', className)} />;
}
