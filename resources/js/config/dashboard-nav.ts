import {
    Calendar,
    Car,
    FileText,
    Gauge,
    History,
    LayoutDashboard,
    MapPin,
    PlusCircle,
    Route,
    Settings,
    Sparkles,
    User,
    Users,
    Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface DashboardNavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    match?: string[];
    badgeKey?: 'pending_bookings';
}

export const customerNav: DashboardNavItem[] = [
    { label: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, match: ['/dashboard'] },
    { label: 'My Vehicles', href: route('vehicles.index'), icon: Car, match: ['/vehicles'] },
    { label: 'Book Service', href: route('bookings.create'), icon: PlusCircle, match: ['/bookings/create'] },
    { label: 'My Bookings', href: route('bookings.index'), icon: Calendar, match: ['/bookings'], badgeKey: 'pending_bookings' },
    { label: 'Service History', href: route('service-history.index'), icon: History, match: ['/service-history'] },
    { label: 'Profile', href: route('user-profile.edit'), icon: User, match: ['/profile'] },
];

export const adminNav: DashboardNavItem[] = [
    { label: 'Overview', href: route('admin.dashboard'), icon: LayoutDashboard, match: ['/admin/dashboard'] },
    { label: 'All Bookings', href: route('admin.bookings.index'), icon: Calendar, match: ['/admin/bookings'], badgeKey: 'pending_bookings' },
    { label: 'Customers', href: route('admin.customers.index'), icon: Users, match: ['/admin/customers'] },
    { label: 'Vehicles', href: route('admin.vehicles.index'), icon: Car, match: ['/admin/vehicles'] },
    { label: 'Technicians', href: route('admin.technicians.index'), icon: Wrench, match: ['/admin/technicians'] },
    { label: 'Route Optimization', href: route('admin.routes.index'), icon: Route, match: ['/admin/routes'] },
];

export const technicianNav: DashboardNavItem[] = [
    { label: 'My Jobs', href: route('technician.jobs.index'), icon: LayoutDashboard, match: ['/technician/jobs'] },
];
