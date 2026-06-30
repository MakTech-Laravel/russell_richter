<?php

namespace App\Rules;

use App\Models\Booking;
use App\Services\BookingAvailabilityService;
use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AvailableBookingSlot implements ValidationRule
{
    public function __construct(private ?Booking $ignore = null) {}

    /**
     * @param  Closure(string): void  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $scheduledAt = Carbon::parse($value);
        $availability = app(BookingAvailabilityService::class);

        if (! $availability->isWithinBusinessHours($scheduledAt)) {
            $fail('Please choose a time during business hours (Mon–Fri, 8 AM – 6 PM).');

            return;
        }

        if ($availability->hasConflict($scheduledAt, $this->ignore)) {
            $fail('This time slot is no longer available. Please choose another time.');
        }
    }
}
