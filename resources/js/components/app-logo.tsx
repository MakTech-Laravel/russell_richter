import { BrandMark } from '@/components/brand';
import { cn } from '@/lib/utils';

interface AppLogoProps {
    className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
    return <BrandMark className={cn('h-16 w-auto max-w-[300px]', className)} />;
}
