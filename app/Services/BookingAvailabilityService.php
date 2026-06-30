<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Carbon\Carbon;
use Carbon\CarbonInterface;

class BookingAvailabilityService
{
    public function appointmentDurationMinutes(): int
    {
        return config('booking.appointment_duration_minutes');
    }

    public function bufferMinutes(): int
    {
        return config('booking.buffer_minutes');
    }

    public function blockedMinutes(): int
    {
        return $this->appointmentDurationMinutes() + $this->bufferMinutes();
    }

    public function isWithinBusinessHours(CarbonInterface $scheduledAt): bool
    {
        if (! in_array($scheduledAt->dayOfWeekIso, config('booking.business_days'), true)) {
            return false;
        }

        $start = $this->businessDayTime($scheduledAt, config('booking.business_hours.start'));
        $lastStart = $this->businessDayTime($scheduledAt, config('booking.business_hours.end'))
            ->subMinutes($this->appointmentDurationMinutes());

        return $scheduledAt->greaterThanOrEqualTo($start)
            && $scheduledAt->lessThanOrEqualTo($lastStart);
    }

    public function isSlotAvailable(CarbonInterface $scheduledAt, ?Booking $ignore = null): bool
    {
        if (! $this->isWithinBusinessHours($scheduledAt)) {
            return false;
        }

        return ! $this->hasConflict($scheduledAt, $ignore);
    }

    public function hasConflict(CarbonInterface $scheduledAt, ?Booking $ignore = null): bool
    {
        $windowStart = $scheduledAt->copy()->subMinutes($this->blockedMinutes() - 1);
        $windowEnd = $scheduledAt->copy()->addMinutes($this->blockedMinutes() - 1);

        $query = Booking::query()
            ->whereNot('status', BookingStatus::Cancelled)
            ->whereBetween('scheduled_at', [$windowStart, $windowEnd]);

        if ($ignore !== null) {
            $query->whereKeyNot($ignore->id);
        }

        return $query
            ->get(['id', 'scheduled_at'])
            ->contains(fn(Booking $booking): bool => $this->intervalsOverlap(
                $scheduledAt,
                $booking->scheduled_at,
            ));
    }

    /**
     * @return list<string>
     */
    public function availableSlotsForDate(CarbonInterface $date, ?Booking $ignore = null): array
    {
        if (! in_array($date->dayOfWeekIso, config('booking.business_days'), true)) {
            return [];
        }

        $slots = [];
        $cursor = $this->businessDayTime($date, config('booking.business_hours.start'));
        $lastStart = $this->businessDayTime($date, config('booking.business_hours.end'))
            ->subMinutes($this->appointmentDurationMinutes());
        $now = now();

        while ($cursor->lessThanOrEqualTo($lastStart)) {
            if ($cursor->greaterThan($now) && $this->isSlotAvailable($cursor, $ignore)) {
                $slots[] = $cursor->format('H:i');
            }

            $cursor->addMinutes(config('booking.slot_interval_minutes'));
        }

        return $slots;
    }

    private function intervalsOverlap(CarbonInterface $first, CarbonInterface $second): bool
    {
        $blocked = $this->blockedMinutes();

        $firstStart = $first->copy();
        $firstEnd = $first->copy()->addMinutes($blocked);
        $secondStart = $second->copy();
        $secondEnd = $second->copy()->addMinutes($blocked);

        return $firstStart->lt($secondEnd) && $secondStart->lt($firstEnd);
    }

    private function businessDayTime(CarbonInterface $date, string $time): Carbon
    {
        return Carbon::parse(sprintf('%s %s', $date->toDateString(), $time));
    }
}
