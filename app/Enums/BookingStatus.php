<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Assigned = 'assigned';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Confirmed => 'Confirmed',
            self::Assigned => 'Assigned',
            self::InProgress => 'In Progress',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
        };
    }

    public function workLabel(): string
    {
        return match ($this) {
            self::Pending => 'Work Pending',
            self::Confirmed => 'Scheduled',
            self::Assigned => 'Technician Assigned',
            self::InProgress => 'Work In Progress',
            self::Completed => 'Work Completed',
            self::Cancelled => 'Cancelled',
        };
    }

    public function workProgressStep(): int
    {
        return match ($this) {
            self::Pending, self::Confirmed => 1,
            self::Assigned => 2,
            self::InProgress => 3,
            self::Completed => 4,
            self::Cancelled => 0,
        };
    }

    public function isWorkDone(): bool
    {
        return $this === self::Completed;
    }

    public function isWorkPending(): bool
    {
        return in_array($this, [self::Pending, self::Confirmed, self::Assigned, self::InProgress], true);
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
