<?php

namespace App\Models;

use App\Models\Concerns\HasEncryptedRouteKey;
use Database\Factories\ContactMessageFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    /** @use HasFactory<ContactMessageFactory> */
    use HasEncryptedRouteKey, HasFactory;

    protected $fillable = [
        'company_name',
        'contact_name',
        'email',
        'phone',
        'vehicle_count',
        'vehicle_types',
        'message',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'vehicle_count' => 'integer',
            'read_at' => 'datetime',
        ];
    }

    public function scopeUnread(Builder $query): Builder
    {
        return $query->whereNull('read_at');
    }

    public function markAsRead(): bool
    {
        if ($this->read_at !== null) {
            return true;
        }

        return $this->forceFill(['read_at' => now()])->save();
    }

    public function isUnread(): bool
    {
        return $this->read_at === null;
    }
}
