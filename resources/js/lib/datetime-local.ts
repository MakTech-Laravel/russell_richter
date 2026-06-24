export function padTwo(value: number): string {
    return String(value).padStart(2, '0');
}

export function toDateInputValue(date: Date): string {
    return `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}-${padTwo(date.getDate())}`;
}

export function toTimeInputValue(date: Date): string {
    return `${padTwo(date.getHours())}:${padTwo(date.getMinutes())}`;
}

export function toDatetimeLocalValue(date: Date): string {
    return `${toDateInputValue(date)}T${toTimeInputValue(date)}`;
}

export function defaultBookingSchedule(): { date: string; time: string } {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(9, 0, 0, 0);

    return {
        date: toDateInputValue(date),
        time: toTimeInputValue(date),
    };
}

export function parseScheduleValue(value?: string | null): { date: string; time: string } {
    if (!value) {
        return defaultBookingSchedule();
    }

    const normalized = value.trim().replace(' ', 'T');
    const [datePart, timePart = '09:00'] = normalized.split('T');

    return {
        date: datePart,
        time: timePart.slice(0, 5),
    };
}

export function toScheduleValue(date: string, time: string): string {
    return `${date}T${time}`;
}

export function minScheduleDate(): string {
    return toDateInputValue(new Date());
}

export function minScheduleTime(selectedDate: string): string | undefined {
    if (selectedDate !== minScheduleDate()) {
        return undefined;
    }

    return toTimeInputValue(new Date());
}
