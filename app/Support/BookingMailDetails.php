<?php

namespace App\Support;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;

class BookingMailDetails
{
    /**
     * @return array{
     *     booking_id: int,
     *     customer_name: string,
     *     customer_email: string|null,
     *     customer_phone: string|null,
     *     service_name: string,
     *     vehicle_name: string,
     *     technician_name: string|null,
     *     status_label: string,
     *     payment_status_label: string,
     *     scheduled_at: string,
     *     scheduled_friendly: string,
     *     address: string,
     *     total_price: string,
     *     customer_notes: string|null,
     *     admin_url: string,
     *     customer_url: string,
     *     technician_url: string|null,
     * }
     */
    public static function for(Booking $booking): array
    {
        $booking->loadMissing(['user', 'service', 'vehicle', 'technician']);

        $scheduledAt = $booking->scheduled_at;

        return [
            'booking_id' => $booking->id,
            'customer_name' => $booking->user?->name ?? 'Customer',
            'customer_email' => $booking->user?->email,
            'customer_phone' => $booking->user?->phone,
            'service_name' => $booking->service?->name ?? 'Service',
            'vehicle_name' => $booking->vehicle?->display_name ?? 'Vehicle',
            'technician_name' => $booking->technician?->name,
            'status_label' => $booking->status?->label() ?? BookingStatus::Pending->label(),
            'payment_status_label' => $booking->payment_status?->label() ?? PaymentStatus::Unpaid->label(),
            'scheduled_at' => $scheduledAt->toDayDateTimeString(),
            'scheduled_friendly' => sprintf(
                '%s on %s',
                $scheduledAt->format('g:ia'),
                $scheduledAt->format('n/j/y'),
            ),
            'address' => trim(sprintf(
                '%s, %s, %s %s',
                $booking->service_address,
                $booking->service_city,
                $booking->service_state,
                $booking->service_zip,
            )),
            'total_price' => number_format((float) $booking->total_price, 2),
            'customer_notes' => $booking->customer_notes,
            'admin_url' => route('admin.bookings.show', $booking),
            'customer_url' => route('bookings.show', $booking),
            'technician_url' => $booking->technician_id
                ? route('technician.jobs.show', $booking)
                : null,
        ];
    }
}
