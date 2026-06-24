import { useMemo, useState } from 'react';

import { dashboardInputClass, dashboardLabelClass } from '@/components/dashboard/dashboard-ui';
import InputError from '@/components/input-error';
import {
    minScheduleDate,
    minScheduleTime,
    parseScheduleValue,
    toScheduleValue,
} from '@/lib/datetime-local';
import { cn } from '@/lib/utils';

interface BookingScheduleFieldProps {
    defaultValue?: string | null;
    error?: string;
}

const pickerInputClass = cn(
    dashboardInputClass(),
    '[color-scheme:dark]',
    '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
    '[&::-webkit-calendar-picker-indicator]:opacity-90',
    '[&::-webkit-calendar-picker-indicator]:invert',
    '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
);

export function BookingScheduleField({ defaultValue, error }: BookingScheduleFieldProps) {
    const initial = useMemo(() => parseScheduleValue(defaultValue), [defaultValue]);
    const [date, setDate] = useState(initial.date);
    const [time, setTime] = useState(initial.time);

    const scheduledAt = date && time ? toScheduleValue(date, time) : '';
    const minimumDate = minScheduleDate();
    const minimumTime = date ? minScheduleTime(date) : undefined;

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
                        onChange={(event) => {
                            const nextDate = event.target.value;
                            setDate(nextDate);

                            const nextMinTime = minScheduleTime(nextDate);
                            if (nextMinTime && time < nextMinTime) {
                                setTime(nextMinTime);
                            }
                        }}
                        className={pickerInputClass}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="scheduled_time" className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Time
                    </label>
                    <input
                        id="scheduled_time"
                        type="time"
                        value={time}
                        min={minimumTime}
                        step={60}
                        required
                        onChange={(event) => setTime(event.target.value)}
                        className={pickerInputClass}
                    />
                </div>
            </div>
           
            <InputError message={error} />
        </div>
    );
}
