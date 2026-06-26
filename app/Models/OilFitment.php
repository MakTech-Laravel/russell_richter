<?php

namespace App\Models;

use Database\Factories\OilFitmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class OilFitment extends Model
{
    /** @use HasFactory<OilFitmentFactory> */
    use HasFactory;

    protected $fillable = [
        'make',
        'model',
        'year_from',
        'year_to',
        'engine',
        'oil_filter_part_no',
        'oil_filter_brand',
        'oil_grade',
        'oil_capacity_quarts',
        'supports_synthetic',
    ];

    protected function casts(): array
    {
        return [
            'year_from' => 'integer',
            'year_to' => 'integer',
            'oil_capacity_quarts' => 'decimal:2',
            'supports_synthetic' => 'boolean',
        ];
    }

    /**
     * Normalize a make/model string to alphanumeric-only lowercase for fuzzy matching.
     * "F-150", "F 150", "f150" all become "f150".
     */
    public static function normalize(?string $value): string
    {
        return Str::lower(preg_replace('/[^a-z0-9]/i', '', (string) $value));
    }
}
