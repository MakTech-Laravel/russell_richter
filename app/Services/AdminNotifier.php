<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\Booking;
use App\Models\Transaction;
use App\Notifications\Admin\NewBookingNotification;
use App\Notifications\Admin\TransactionReceivedNotification;
use App\Support\BookingMailDetails;

class AdminNotifier
{
    public function __construct(private SmsNotifier $smsNotifier) {}

    public function bookingCreated(Booking $booking): void
    {
        $booking->loadMissing(['user', 'service', 'vehicle']);

        $notification = new NewBookingNotification($booking);

        Admin::query()->each(
            fn (Admin $admin) => $admin->notify($notification),
        );

        $this->smsNotifier->sendToAdmin($this->bookingSmsMessage($booking));
    }

    public function transactionSucceeded(Transaction $transaction): void
    {
        $notification = new TransactionReceivedNotification($transaction);

        Admin::query()->each(
            fn (Admin $admin) => $admin->notify($notification),
        );
    }

    private function bookingSmsMessage(Booking $booking): string
    {
        $details = BookingMailDetails::for($booking);
        $scheduledAt = $booking->scheduled_at;

        return sprintf(
            "New booking #%d\nCustomer: %s\nWhen: %s at %s\nService: %s\nVehicle: %s",
            $booking->id,
            $details['customer_name'],
            $scheduledAt->format('M j, Y'),
            $scheduledAt->format('g:i A'),
            $details['service_name'],
            $details['vehicle_name'],
        );
    }
}
