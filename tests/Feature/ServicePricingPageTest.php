<?php

use App\Enums\ServiceType;
use App\Models\Service;

it('loads active pricing packages for the homepage', function () {
    Service::query()->where('service_type', ServiceType::Package)->delete();

    Service::query()->create([
        'slug' => 'homepage-package',
        'service_type' => ServiceType::Package,
        'name' => 'Homepage Package',
        'base_price' => 88.00,
        'features' => ['Included item'],
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $this->get('/')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('pricingPackages', 1)
            ->where('pricingPackages.0.name', 'Homepage Package')
            ->where('pricingPackages.0.price', 88));
});

it('loads active add-on services for the homepage', function () {
    Service::query()->where('service_type', ServiceType::Addon)->delete();

    Service::query()->create([
        'slug' => 'homepage-addon',
        'service_type' => ServiceType::Addon,
        'name' => 'Homepage Add-on',
        'base_price' => 30.00,
        'price_label' => '$30',
        'addon_note' => 'Test note',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $this->get('/')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('addOnServices', 1)
            ->where('addOnServices.0.name', 'Homepage Add-on')
            ->where('addOnServices.0.price', '$30'));
});
