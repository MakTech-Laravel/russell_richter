import { Link, router, usePage } from '@inertiajs/react';
import { Calendar, Car, History, LayoutDashboard, Menu } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { type SharedData } from '@/types';

const navItems = [
    { label: 'Dashboard', href: 'dashboard', icon: LayoutDashboard },
    { label: 'My Vehicles', href: 'vehicles.index', icon: Car },
    { label: 'Bookings', href: 'bookings.index', icon: Calendar },
    { label: 'Service History', href: 'service-history.index', icon: History },
];

interface UserHeaderProps {
    showProfileMenu?: boolean;
}

export function UserHeader({ showProfileMenu = true }: UserHeaderProps) {
    const { auth } = usePage<SharedData>().props;

    const handleLogout = (): void => {
        router.post(route('logout'));
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                <Link href={route('dashboard')} className="flex items-center">
                    <AppLogo className="h-12 w-auto" />
                </Link>

                <nav className="hidden items-center gap-1 lg:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={route(item.href)}
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-ml-gold"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {showProfileMenu ? (
                    <div className="flex items-center gap-3">
                        <Button asChild className="hidden md:inline-flex ml-gold-gradient border-0 font-bold text-ml-black hover:opacity-90">
                            <Link href={route('bookings.create')}>Book Service</Link>
                        </Button>
                        <div className="hidden md:flex">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex h-auto items-center gap-2 p-2 text-gray-900 hover:bg-amber-50">
                                        <UserInfo user={auth.user} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 border-gray-200 bg-gray-50 p-2" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="md:hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="text-ml-gold">
                                        <Menu className="size-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 border-gray-200 bg-gray-50 p-2" align="end">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={route(item.href)}
                                            className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-ml-gold"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ) : (
                    <Button variant="ghost" className="text-ml-gold" onClick={handleLogout}>
                        Log out
                    </Button>
                )}
            </div>
        </header>
    );
}
