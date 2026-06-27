<?php

namespace App\Models;

use App\Enums\RecommendationPartType;
use Database\Factories\BookingRecommendationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingRecommendation extends Model
{
    /** @use HasFactory<BookingRecommendationFactory> */
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'part_type',
        'part_name',
        'part_number',
        'specification',
        'quantity',
        'estimated_price',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'part_type' => RecommendationPartType::class,
            'quantity' => 'decimal:2',
            'estimated_price' => 'decimal:2',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
