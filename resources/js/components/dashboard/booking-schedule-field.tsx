import { useEffect, useMemo, useState } from 'react';

import { dashboardInputClass, dashboardLabelClass, dashboardSelectClass } from '@/components/dashboard/dashboard-ui';
import InputError from '@/components/input-error';
import { parseScheduleValue, toScheduleValue } from '@/lib/datetime-local';
import { cn } from '@/lib/utils';

interface BookingScheduleFieldProps {
    defaultValue?: string | null;
    error?: string;
    bookingId?: number;
}

const pickerInputClass = cn(
    dashboardInputClass(),
    '[color-scheme:dark]',
    '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
    '[&::-webkit-calendar-picker-indicator]:opacity-90',
    '[&::-webkit-calendar-picker-indicator]:invert',
    '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
);

function formatSlotLabel(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function BookingScheduleField({ defaultValue, error, bookingId }: BookingScheduleFieldProps) {
    const initial = useMemo(() => parseScheduleValue(defaultValue), [defaultValue]);
    const [date, setDate] = useState(initial.date);
    const [time, setTime] = useState(initial.time);
    const [slots, setSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsError, setSlotsError] = useState<string | null>(null);

    const scheduledAt = date && time ? toScheduleValue(date, time) : '';
    const minimumDate = new Date().toISOString().slice(0, 10);

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
        <div className="space-y-2">
            <span className={dashboardLabelClass()}>Date &amp; Time</span>
            <input type="hidden" name="scheduled_at" value={scheduledAt} />
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="scheduled_date" className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Date
                    </label>
                    <input
                        id="scheduled_date"
                        type="date"
                        value={date}
                        min={minimumDate}
                        required
                        onChange={(event) => setDate(event.target.value)}
                        className={pickerInputClass}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="scheduled_time" className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Time
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
            </div>
            {!loadingSlots && slots.length === 0 && (
                <p className="text-xs text-slate-500">
                    No open slots on this date. Appointments include a 30-minute buffer between visits.
                </p>
            )}
            <InputError message={slotsError ?? error} />
        </div>
    );
}
