import { MOBILE_LUBE } from '@/lib/mobile-lube';

export function UserFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-gray-200 bg-white py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
                    <div className="text-center text-sm text-gray-500 md:text-left">
                        © {currentYear} {MOBILE_LUBE.name}. All rights reserved.
                    </div>
                    <a href={MOBILE_LUBE.emailHref} className="text-sm text-gray-500 hover:text-gray-900">
                        {MOBILE_LUBE.email}
                    </a>
                </div>
            </div>
        </footer>
    );
}
