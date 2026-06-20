<?php

namespace App\Enums;

enum RecommendationPartType: string
{
    case Oil = 'oil';
    case OilFilter = 'oil_filter';
    case CabinFilter = 'cabin_filter';
    case Wiper = 'wiper';

    public function label(): string
    {
        return match ($this) {
            self::Oil => 'Engine Oil',
            self::OilFilter => 'Oil Filter',
            self::CabinFilter => 'Cabin Air Filter',
            self::Wiper => 'Wiper Blades',
        };
    }
}
