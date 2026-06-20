import { Link } from '@inertiajs/react';

export function UserFooter() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="mt-auto border-t border-gray-200 bg-white py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                    <div className="text-center text-sm text-gray-500 md:text-left">
                        © {currentYear} Mobile Lube, LLC. All rights reserved.
                    </div>
                    {/* <div className="flex gap-6">
                        <Link
                            href="/privacy"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Contact
                        </Link>
                    </div> */}
                </div>
            </div>
        </footer>
    );
}
