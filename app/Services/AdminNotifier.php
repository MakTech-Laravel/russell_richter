<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\Booking;
use App\Models\Transaction;
use App\Notifications\Admin\NewBookingNotification;
use App\Notifications\Admin\TransactionReceivedNotification;

class AdminNotifier
{
    public function bookingCreated(Booking $booking): void
    {
        $notification = new NewBookingNotification($booking);

        Admin::query()->each(
            fn (Admin $admin) => $admin->notify($notification),
        );
    }

    public function transactionSucceeded(Transaction $transaction): void
    {
        $notification = new TransactionReceivedNotification($transaction);

        Admin::query()->each(
            fn (Admin $admin) => $admin->notify($notification),
        );
    }
}
