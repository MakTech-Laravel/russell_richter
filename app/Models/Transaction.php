<?php

namespace App\Models;

use App\Enums\TransactionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class Transaction extends Model
{
    protected $fillable = [
        'invoice_number',
        'booking_id',
        'user_id',
        'amount',
        'currency',
        'status',
        'stripe_checkout_session_id',
        'stripe_payment_intent_id',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'status' => TransactionStatus::class,
            'paid_at' => 'datetime',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ensureInvoiceNumber(): void
    {
        if (filled($this->invoice_number)) {
            return;
        }

        DB::transaction(function (): void {
            $locked = static::query()->whereKey($this->id)->lockForUpdate()->first();

            if (! $locked || filled($locked->invoice_number)) {
                if ($locked) {
                    $this->invoice_number = $locked->invoice_number;
                }

                return;
            }

            $sequence = static::query()
                ->whereNotNull('invoice_number')
                ->lockForUpdate()
                ->count() + 1;

            $invoiceNumber = sprintf('ML-%s-%05d', now()->format('Y'), $sequence);

            $locked->forceFill(['invoice_number' => $invoiceNumber])->save();
            $this->invoice_number = $invoiceNumber;
        });
    }
}
