<?php

namespace App\Support;

use App\Enums\BookingStatus;
use App\Models\Booking;

class BookingPresenter
{
    /**
     * @return array{work_status_label: string, work_progress_step: int, work_is_done: bool}
     */
    public static function workMeta(BookingStatus $status): array
    {
        return [
            'work_status_label' => $status->workLabel(),
            'work_progress_step' => $status->workProgressStep(),
            'work_is_done' => $status->isWorkDone(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function summary(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'route_key' => $booking->getRouteKey(),
            'status' => $booking->status->value,
            'status_label' => $booking->status->label(),
            ...self::workMeta($booking->status),
            'scheduled_at' => $booking->scheduled_at->toDateTimeString(),
            'completed_at' => $booking->completed_at?->toDateTimeString(),
            'service' => $booking->service?->name,
            'vehicle' => $booking->vehicle?->display_name,
            'technician' => $booking->technician?->name,
        ];
    }
}
