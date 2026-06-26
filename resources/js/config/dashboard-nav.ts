import {
    Calendar,
    Car,
    CreditCard,
    Database,
    FileText,
    Gauge,
    HelpCircle,
    History,
    LayoutDashboard,
    Mail,
    MapPin,
    Package,
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
    badgeKey?: 'pending_bookings' | 'unread_contact_messages';
}

export const customerNav: DashboardNavItem[] = [
    { label: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, match: ['/dashboard'] },
    { label: 'My Vehicles', href: route('vehicles.index'), icon: Car, match: ['/vehicles'] },
    { label: 'Book Service', href: route('bookings.create'), icon: PlusCircle, match: ['/bookings/create'] },
    { label: 'My Bookings', href: route('bookings.index'), icon: Calendar, match: ['/bookings'], badgeKey: 'pending_bookings' },
    { label: 'Transactions', href: route('transactions.index'), icon: CreditCard, match: ['/transactions'] },
    { label: 'Service History', href: route('service-history.index'), icon: History, match: ['/service-history'] },
    { label: 'Profile', href: route('user-profile.edit'), icon: User, match: ['/profile'] },
];

export const adminNav: DashboardNavItem[] = [
    { label: 'Overview', href: route('admin.dashboard'), icon: LayoutDashboard, match: ['/admin/dashboard'] },
    { label: 'All Bookings', href: route('admin.bookings.index'), icon: Calendar, match: ['/admin/bookings'], badgeKey: 'pending_bookings' },
    { label: 'Service Packages', href: route('admin.services.index'), icon: Package, match: ['/admin/services'] },
    { label: 'Transactions', href: route('admin.transactions.index'), icon: CreditCard, match: ['/admin/transactions'] },
    { label: 'Customers', href: route('admin.customers.index'), icon: Users, match: ['/admin/customers'] },
    { label: 'Contact Inbox', href: route('admin.contacts.index'), icon: Mail, match: ['/admin/contacts'], badgeKey: 'unread_contact_messages' },
    { label: 'Vehicles', href: route('admin.vehicles.index'), icon: Car, match: ['/admin/vehicles'] },
    { label: 'Technicians', href: route('admin.technicians.index'), icon: Wrench, match: ['/admin/technicians'] },
    { label: 'Route Optimization', href: route('admin.routes.index'), icon: Route, match: ['/admin/routes'] },
    { label: 'Oil Fitments', href: route('admin.oil-fitments.index'), icon: Database, match: ['/admin/oil-fitments'] },
    { label: 'FAQ', href: route('admin.faqs.index'), icon: HelpCircle, match: ['/admin/faqs'] },
];

export const technicianNav: DashboardNavItem[] = [
    { label: 'My Jobs', href: route('technician.jobs.index'), icon: LayoutDashboard, match: ['/technician/jobs'] },
    { label: 'Job History', href: route('technician.jobs.history'), icon: History, match: ['/technician/jobs/history'] },
];
