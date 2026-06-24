import * as React from 'react';

import { cn } from '@/lib/utils';

type StatTone = 'gold' | 'emerald' | 'amber' | 'sky' | 'rose' | 'violet';

const statToneClass: Record<StatTone, string> = {
    gold: 'from-gold-300 to-gold-600 text-ink-900',
    emerald: 'from-emerald-400 to-emerald-600 text-white',
    amber: 'from-amber-400 to-amber-600 text-ink-900',
    sky: 'from-sky-400 to-sky-600 text-white',
    rose: 'from-rose-400 to-rose-600 text-white',
    violet: 'from-violet-400 to-violet-600 text-white',
};

export function DashboardStat({
    label,
    value,
    trend,
    icon: Icon,
    tone = 'gold',
}: {
    label: string;
    value: React.ReactNode;
    trend?: string;
    icon: React.ComponentType<{ className?: string }>;
    tone?: StatTone;
}) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-ink-800 p-5 shadow-lg shadow-black/20">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold-500/5 blur-2xl" />
            <div className="relative flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="mt-2 text-3xl font-black text-white">{value}</p>
                    {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
                </div>
                <div
                    className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md shadow-black/30',
                        statToneClass[tone],
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

export function DashboardCard({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('rounded-2xl border border-white/5 bg-ink-800 shadow-lg shadow-black/20', className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function DashboardCardHeader({
    title,
    subtitle,
    actions,
}: {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-white/5 px-5 py-4">
            <div>
                <h3 className="text-base font-bold text-white">{title}</h3>
                {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}

export function DashboardCardContent({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('p-5', className)} {...props}>
            {children}
        </div>
    );
}

const statusClassMap: Record<string, string> = {
    pending: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
    confirmed: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
    assigned: 'bg-violet-500/15 text-violet-300 ring-violet-500/30',
    in_progress: 'bg-gold-500/15 text-gold-300 ring-gold-500/30',
    completed: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
    cancelled: 'bg-slate-500/15 text-slate-400 ring-slate-500/30',
    paid: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
    unpaid: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
};

export function StatusPill({ status, label }: { status: string; label?: string }) {
    const normalized = status.toLowerCase().replace(/\s+/g, '_');
    const display = label ?? status.replace(/_/g, ' ');

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ring-1 ring-inset',
                statusClassMap[normalized] ?? 'bg-slate-500/15 text-slate-300 ring-slate-500/30',
            )}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {display}
        </span>
    );
}

export function DashboardEmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-500/20 bg-gold-500/10 text-gold-400">
                <Icon className="h-7 w-7" />
            </div>
            <div>
                <p className="text-lg font-bold text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-400">{description}</p>
            </div>
            {action}
        </div>
    );
}

export function DashboardTable({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn('overflow-x-auto', className)}>
            <table className="w-full text-sm">{children}</table>
        </div>
    );
}

export function dashboardRowLinkClass(): string {
    return 'block rounded-xl border border-white/5 bg-ink-900/40 p-4 transition hover:border-gold-500/30 hover:bg-ink-900/70';
}

export function dashboardSelectClass(): string {
    return 'rounded-lg border border-white/10 bg-ink-800 px-3 py-2 text-sm text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30';
}

export function dashboardInputClass(): string {
    return 'w-full rounded-lg border border-white/10 bg-ink-800 px-3 py-2 text-sm text-white placeholder:text-slate-50/40 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30';
}

export function dashboardLabelClass(): string {
    return 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400';
}

export function dashboardTableHeadClass(): string {
    return 'border-b border-white/5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500';
}

export function dashboardTableRowClass(): string {
    return 'border-b border-white/5 last:border-0 hover:bg-white/[0.02]';
}

export function dashboardButtonPrimaryClass(): string {
    return 'ml-btn-primary';
}

export function dashboardButtonOutlineClass(): string {
    return 'ml-btn-outline';
}

export function dashboardButtonIconClass(): string {
    return 'ml-btn-icon';
}

export function dashboardButtonIconDangerClass(): string {
    return 'ml-btn-icon-danger';
}

export function DashboardLink({ className, ...props }: React.ComponentProps<'a'>) {
    return <a className={cn('text-gold-400 hover:text-gold-300 hover:underline', className)} {...props} />;
}
