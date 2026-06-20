<?php

namespace App\Models;

use Database\Factories\VehicleFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    /** @use HasFactory<VehicleFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vin',
        'year',
        'make',
        'model',
        'trim',
        'engine',
        'fuel_type',
        'body_class',
        'drive_type',
        'mileage',
        'license_plate',
        'color',
        'vin_decode_data',
        'decoded_at',
    ];

    protected function casts(): array
    {
        return [
            'vin_decode_data' => 'array',
            'decoded_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function getDisplayNameAttribute(): string
    {
        $parts = array_filter([$this->year, $this->make, $this->model]);

        return $parts !== [] ? implode(' ', $parts) : $this->vin;
    }
}
