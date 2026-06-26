<?php

namespace App\Notifications\Admin;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TransactionReceivedNotification extends Notification
{
    use Queueable;

    public function __construct(public Transaction $transaction) {}

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
        $this->transaction->loadMissing(['user', 'booking']);

        $customerName = $this->transaction->user?->name ?? 'A customer';

        return [
            'type' => 'transaction',
            'title' => 'Payment received',
            'message' => sprintf(
                '$%s payment from %s for booking #%d',
                number_format((float) $this->transaction->amount, 2),
                $customerName,
                $this->transaction->booking_id,
            ),
            'url' => route('admin.transactions.index'),
        ];
    }
}
