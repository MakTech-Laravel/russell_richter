import { BrandMark } from '@/components/brand';
import { cn } from '@/lib/utils';

interface AppLogoIconProps {
    className?: string;
}

export default function AppLogoIcon({ className }: AppLogoIconProps) {
    return <BrandMark className={cn('h-10 w-auto max-w-[160px]', className)} />;
}
