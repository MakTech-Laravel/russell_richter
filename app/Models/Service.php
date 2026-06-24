<?php

namespace App\Models;

use App\Enums\ServiceType;
use Database\Factories\ServiceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    /** @use HasFactory<ServiceFactory> */
    use HasFactory;

    protected $fillable = [
        'slug',
        'service_type',
        'name',
        'description',
        'features',
        'base_price',
        'price_label',
        'addon_note',
        'included_quarts',
        'additional_quart_price',
        'is_active',
        'is_popular',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'service_type' => ServiceType::class,
            'features' => 'array',
            'base_price' => 'decimal:2',
            'additional_quart_price' => 'decimal:2',
            'is_active' => 'boolean',
            'is_popular' => 'boolean',
        ];
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
