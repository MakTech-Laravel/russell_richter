import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const WORK_STEPS = [
    { step: 1, label: 'Pending' },
    { step: 2, label: 'Assigned' },
    { step: 3, label: 'In Progress' },
    { step: 4, label: 'Completed' },
] as const;

interface BookingWorkProgressProps {
    status: string;
    workStatusLabel: string;
    workProgressStep: number;
    workIsDone: boolean;
    compact?: boolean;
    className?: string;
}

export function BookingWorkProgress({
    status,
    workStatusLabel,
    workProgressStep,
    workIsDone,
    compact = false,
    className,
}: BookingWorkProgressProps) {
    const isCancelled = status === 'cancelled';

    if (isCancelled) {
        return (
            <div className={cn('rounded-xl border border-slate-500/30 bg-slate-500/10 px-4 py-3', className)}>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Work Status</p>
                <p className="mt-1 text-sm font-semibold text-slate-300">Cancelled</p>
            </div>
        );
    }

    if (compact) {
        const percent = workIsDone ? 100 : Math.max(8, (workProgressStep / WORK_STEPS.length) * 100);

        return (
            <div className={cn('space-y-2', className)}>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Work Status</span>
                    <span
                        className={cn(
                            'text-[11px] font-semibold',
                            workIsDone || workProgressStep > 1 ? 'text-emerald-400' : 'text-gold-400',
                        )}
                    >
                        {workStatusLabel}
                    </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-500',
                            workProgressStep > 1 || workIsDone
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                : 'bg-gradient-to-r from-gold-500 to-gold-400',
                        )}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={cn('rounded-2xl border border-white/5 bg-ink-900/40 p-5', className)}>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Work Status</p>
                    <p
                        className={cn(
                            'mt-1 text-lg font-bold',
                            workIsDone || workProgressStep > 1 ? 'text-emerald-400' : 'text-gold-300',
                        )}
                    >
                        {workStatusLabel}
                    </p>
                </div>
                {workIsDone && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                        <Check className="h-3.5 w-3.5" />
                        Done
                    </span>
                )}
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2">
                {WORK_STEPS.map((item) => {
                    const isPast = workProgressStep > item.step || (workIsDone && item.step === 4);
                    const isCurrent = workProgressStep === item.step && !workIsDone;
                    const showCheck = isPast || isCurrent;
                    const isReached = showCheck;

                    return (
                        <div key={item.step} className="flex flex-col items-center gap-2 text-center">
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition',
                                    isReached
                                        ? cn(
                                            'border-emerald-500/40 bg-emerald-500/20 text-emerald-300',
                                            isCurrent && 'ring-2 ring-emerald-400/25',
                                        )
                                        : 'border-white/10 bg-ink-800 text-slate-500',
                                )}
                            >
                                {showCheck ? <Check className="h-4 w-4" /> : item.step}
                            </div>
                            <span
                                className={cn(
                                    'text-[10px] font-semibold uppercase leading-tight tracking-wide',
                                    showCheck ? 'text-slate-200' : 'text-slate-500',
                                )}
                            >
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500',
                        workProgressStep > 1 || workIsDone
                            ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300'
                            : 'bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300',
                    )}
                    style={{
                        width: `${workIsDone ? 100 : Math.max(12, (workProgressStep / WORK_STEPS.length) * 100)}%`,
                    }}
                />
            </div>
        </div>
    );
}
