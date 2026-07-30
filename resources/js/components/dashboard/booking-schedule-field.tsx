import { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';

import { dashboardLabelClass, dashboardSelectClass } from '@/components/dashboard/dashboard-ui';
import InputError from '@/components/input-error';
import { parseScheduleValue, toScheduleValue } from '@/lib/datetime-local';
import { cn } from '@/lib/utils';

import 'react-day-picker/style.css';

interface BookingScheduleFieldProps {
    defaultValue?: string | null;
    error?: string;
    bookingId?: number;
}

function formatSlotLabel(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

function toDateOnly(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
}

function toIsoDate(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function BookingScheduleField({ defaultValue, error, bookingId }: BookingScheduleFieldProps) {
    const initial = useMemo(() => parseScheduleValue(defaultValue), [defaultValue]);
    const [date, setDate] = useState(initial.date);
    const [time, setTime] = useState(initial.time);
    const [slots, setSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsError, setSlotsError] = useState<string | null>(null);

    const scheduledAt = date && time ? toScheduleValue(date, time) : '';
    const selectedDate = date ? toDateOnly(date) : undefined;
    const today = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        return now;
    }, []);

    useEffect(() => {
        if (!date) {
            setSlots([]);
            return;
        }

        const controller = new AbortController();

        async function loadSlots(): Promise<void> {
            setLoadingSlots(true);
            setSlotsError(null);

            try {
                const params = new URLSearchParams({ date });
                if (bookingId) {
                    params.set('booking_id', String(bookingId));
                }

                const response = await fetch(`${route('bookings.availability')}?${params.toString()}`, {
                    headers: { Accept: 'application/json' },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('Unable to load available times.');
                }

                const data = (await response.json()) as { slots: string[] };
                setSlots(data.slots);

                if (data.slots.length > 0) {
                    setTime((current) => (data.slots.includes(current) ? current : data.slots[0]));
                } else {
                    setTime('');
                }
            } catch (fetchError) {
                if (controller.signal.aborted) {
                    return;
                }

                setSlots([]);
                setTime('');
                setSlotsError(fetchError instanceof Error ? fetchError.message : 'Unable to load available times.');
            } finally {
                if (!controller.signal.aborted) {
                    setLoadingSlots(false);
                }
            }
        }

        void loadSlots();

        return () => controller.abort();
    }, [date, bookingId]);

    return (
        <div className="space-y-4">
            <span className={dashboardLabelClass()}>Pick a date &amp; time</span>
            <input type="hidden" name="scheduled_at" value={scheduledAt} />

            <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
                <div className="rounded-2xl border border-white/10 bg-ink-900/50 p-3">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(value) => {
                            if (!value) {
                                return;
                            }

                            setDate(toIsoDate(value));
                        }}
                        disabled={{ before: today, dayOfWeek: [0, 6] }}
                        className="text-slate-200"
                        classNames={{
                            today: 'text-gold-300 font-bold',
                            selected: 'bg-gold-500 text-ink-900 rounded-full',
                            disabled: 'text-slate-600 opacity-40',
                            chevron: 'fill-gold-400',
                        }}
                    />
                    <p className="mt-2 px-2 text-xs text-slate-500">Weekends unavailable · Mon–Fri service only</p>
                </div>

                <div className="space-y-3">
                    <div className="space-y-2">
                        <label htmlFor="scheduled_time" className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Available time slots {date ? `for ${date}` : ''}
                        </label>
                        <select
                            id="scheduled_time"
                            value={time}
                            required
                            disabled={loadingSlots || slots.length === 0}
                            onChange={(event) => setTime(event.target.value)}
                            className={dashboardSelectClass()}
                        >
                            {loadingSlots ? (
                                <option value="">Loading times...</option>
                            ) : slots.length === 0 ? (
                                <option value="">No times available</option>
                            ) : (
                                slots.map((slot) => (
                                    <option key={slot} value={slot}>
                                        {formatSlotLabel(slot)}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {slots.map((slot) => (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => setTime(slot)}
                                className={cn(
                                    'rounded-lg border px-3 py-2 text-sm transition-colors',
                                    time === slot
                                        ? 'border-gold-500 bg-gold-500/20 text-gold-300'
                                        : 'border-white/10 text-slate-300 hover:border-gold-500/40 hover:text-white',
                                )}
                            >
                                {formatSlotLabel(slot)}
                            </button>
                        ))}
                    </div>

                    {!loadingSlots && date && slots.length === 0 && (
                        <p className="text-xs text-slate-500">
                            No open slots on this date. Booked times (with a 30-minute buffer) are hidden so another customer cannot double-book.
                        </p>
                    )}
                </div>
            </div>

            <InputError message={slotsError ?? error} />
        </div>
    );
}
