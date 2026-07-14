<?php

namespace App\Mail\Concerns;

use App\Models\Booking;
use App\Support\BookingMailDetails;

trait HasBookingMailDetails
{
    /**
     * @return array<string, mixed>
     */
    protected function bookingDetails(Booking $booking): array
    {
        return BookingMailDetails::for($booking);
    }
}
