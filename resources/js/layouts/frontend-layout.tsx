import * as React from 'react';

import { FrontendFooter } from '@/layouts/partials/frontend/footer';
import { FrontendHeader } from '@/layouts/partials/frontend/header';

interface FrontendLayoutProps {
    children: React.ReactNode;
}

export default function FrontendLayout({ children }: FrontendLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
            <FrontendHeader />
            <main className="flex flex-1 flex-col">{children}</main>
            <FrontendFooter />
        </div>
    );
}
