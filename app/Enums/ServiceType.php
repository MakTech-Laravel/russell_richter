<?php

namespace App\Enums;

enum ServiceType: string
{
    case Package = 'package';
    case Addon = 'addon';

    public function label(): string
    {
        return match ($this) {
            self::Package => 'Package',
            self::Addon => 'Add-on',
        };
    }
}
