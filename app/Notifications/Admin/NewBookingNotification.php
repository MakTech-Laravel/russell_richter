<?php

namespace App\Notifications\Admin;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewBookingNotification extends Notification
{
    use Queueable;

    public function __construct(public Booking $booking) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $this->booking->loadMissing(['user', 'service']);

        $customerName = $this->booking->user?->name ?? 'A customer';
        $serviceName = $this->booking->service?->name ?? 'a service';

        return [
            'type' => 'booking',
            'title' => 'New booking received',
            'message' => sprintf('%s booked %s', $customerName, $serviceName),
            'url' => route('admin.bookings.show', $this->booking),
        ];
    }
}
