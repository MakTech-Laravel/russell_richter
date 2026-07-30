<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\TransactionStatus;
use App\Models\Concerns\HasEncryptedRouteKey;
use Database\Factories\BookingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Booking extends Model
{
    /** @use HasFactory<BookingFactory> */
    use HasEncryptedRouteKey, HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'service_id',
        'technician_id',
        'status',
        'payment_status',
        'stripe_checkout_session_id',
        'stripe_payment_intent_id',
        'paid_at',
        'scheduled_at',
        'completed_at',
        'service_address',
        'service_city',
        'service_state',
        'service_zip',
        'latitude',
        'longitude',
        'mileage_at_service',
        'total_price',
        'package_price',
        'extra_quarts',
        'extra_quarts_amount',
        'extra_charge_amount',
        'extra_charge_label',
        'discount_percent',
        'discount_amount',
        'route_order',
        'customer_notes',
        'technician_notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => BookingStatus::class,
            'payment_status' => PaymentStatus::class,
            'scheduled_at' => 'datetime',
            'completed_at' => 'datetime',
            'paid_at' => 'datetime',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'total_price' => 'decimal:2',
            'package_price' => 'decimal:2',
            'extra_quarts' => 'integer',
            'extra_quarts_amount' => 'decimal:2',
            'extra_charge_amount' => 'decimal:2',
            'discount_percent' => 'decimal:2',
            'discount_amount' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(Technician::class);
    }

    public function recommendations(): HasMany
    {
        return $this->hasMany(BookingRecommendation::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === BookingStatus::Completed;
    }

    public function isPaid(): bool
    {
        return $this->payment_status === PaymentStatus::Paid;
    }

    public function netPaidAmount(): float
    {
        $succeeded = (float) $this->transactions()
            ->where('status', TransactionStatus::Succeeded)
            ->sum('amount');

        $refunded = (float) $this->transactions()
            ->where('status', TransactionStatus::Refunded)
            ->sum('amount');

        return round(max(0, $succeeded - $refunded), 2);
    }

    public function amountDue(): float
    {
        return round(max(0, (float) $this->total_price - $this->netPaidAmount()), 2);
    }
}
