import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Menu } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { type SharedData } from '@/types';

const navItems = [
    { label: 'Dashboard', route: 'admin.dashboard' },
    { label: 'Bookings', route: 'admin.bookings.index' },
    { label: 'Customers', route: 'admin.customers.index' },
    { label: 'Vehicles', route: 'admin.vehicles.index' },
    { label: 'Technicians', route: 'admin.technicians.index' },
    { label: 'Routes', route: 'admin.routes.index' },
];

export function AdminHeader() {
    const { auth } = usePage<SharedData>().props;
    const admin = auth.admin;
    const getInitials = useInitials();

    if (!admin) {
        return null;
    }

    const handleLogout = (): void => {
        router.post(route('admin.logout'));
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                <Link href={route('admin.dashboard')} className="flex items-center">
                    <AppLogo className="h-16 w-auto" />
                </Link>

                <nav className="hidden items-center gap-1 xl:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.route}
                            href={route(item.route)}
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-ml-gold"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-auto items-center gap-2 p-2 text-gray-900 hover:bg-amber-50">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-ml-gold text-ml-black">{getInitials(admin.name)}</AvatarFallback>
                            </Avatar>
                            <span className="hidden text-sm font-medium md:inline">{admin.name}</span>
                            <Menu className="size-4 xl:hidden" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 border-gray-200 bg-gray-50" align="end">
                        <DropdownMenuLabel className="text-gray-600">{admin.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-amber-50" />
                        <div className="xl:hidden">
                            {navItems.map((item) => (
                                <DropdownMenuItem key={item.route} asChild>
                                    <Link href={route(item.route)} className="text-gray-600">{item.label}</Link>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator className="bg-amber-50" />
                        </div>
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-gray-600">
                            <LogOut className="mr-2 size-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
