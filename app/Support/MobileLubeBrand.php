<?php

namespace App\Support;

class MobileLubeBrand
{
    public static function name(): string
    {
        return config('app.name', 'Mobile Lube');
    }

    public static function legalName(): string
    {
        return 'Mobile Lube, LLC';
    }

    public static function tagline(): string
    {
        return 'We come to you — home, office, or jobsite.';
    }

    public static function phone(): string
    {
        return '(361) 655-5323';
    }

    public static function phoneHref(): string
    {
        return 'tel:+13616555323';
    }

    public static function supportEmail(): string
    {
        return config('mail.from.address', 'russell@mymobilelube.com');
    }

    public static function serviceArea(): string
    {
        return 'Victoria County, Texas';
    }

    public static function hours(): string
    {
        return 'Mon–Fri, 8 AM – 6 PM';
    }

    public static function logoPath(): string
    {
        return public_path('images/mobile-lube-logo.png');
    }

    public static function logoUrl(): string
    {
        return asset('images/mobile-lube-logo.png');
    }

    public static function websiteUrl(): string
    {
        return rtrim((string) config('app.url'), '/');
    }
}
