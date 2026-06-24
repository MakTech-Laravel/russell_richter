<?php

namespace Database\Seeders;

use App\Enums\ServiceType;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'slug' => 'full-synthetic-oil-change',
                'service_type' => ServiceType::Package,
                'name' => 'Full Synthetic Oil Change',
                'description' => 'Up to 6 quarts premium synthetic oil, premium filter, fluid inspection, tire pressure & battery check.',
                'base_price' => 120.00,
                'included_quarts' => 6,
                'additional_quart_price' => 9.00,
                'is_popular' => true,
                'features' => [
                    'Up to 6 quarts premium synthetic oil',
                    'Premium oil filter',
                    'Fluid inspection',
                    'Tire pressure check',
                    'Battery health check',
                    'Additional oil: $9.00/qt',
                ],
                'sort_order' => 1,
            ],
            [
                'slug' => 'conventional-oil-change',
                'service_type' => ServiceType::Package,
                'name' => 'Conventional Oil Change',
                'description' => 'Up to 6 quarts of oil, filter replacement, and multi-point inspection.',
                'base_price' => 99.00,
                'included_quarts' => 6,
                'additional_quart_price' => 6.00,
                'features' => [
                    'Up to 6 quarts of oil',
                    'Filter replacement',
                    'Multi-point inspection',
                    'On-site mobile service',
                    'Additional oil: $6.00/qt',
                ],
                'sort_order' => 2,
            ],
            [
                'slug' => 'diesel-oil-change',
                'service_type' => ServiceType::Package,
                'name' => 'Diesel Oil Change',
                'description' => 'Up to 13 quarts diesel-rated oil, heavy-duty filter, multi-point & fluid inspection.',
                'base_price' => 180.00,
                'included_quarts' => 13,
                'additional_quart_price' => 9.00,
                'features' => [
                    'Up to 13 quarts diesel-rated oil',
                    'Heavy-duty oil filter',
                    'Multi-point inspection',
                    'Fluid inspection',
                    'Additional oil: $9.00/qt',
                    'DEF: $8.00/gallon',
                ],
                'sort_order' => 3,
            ],
            [
                'slug' => 'tire-rotation',
                'service_type' => ServiceType::Package,
                'name' => 'Tire Rotation',
                'description' => 'Tires rotated per manufacturer pattern with tread depth inspection.',
                'base_price' => 50.00,
                'included_quarts' => 0,
                'additional_quart_price' => null,
                'features' => [
                    'Manufacturer-recommended rotation pattern',
                    'Tread depth inspection',
                    'On-site mobile service',
                ],
                'sort_order' => 4,
            ],
            [
                'slug' => 'battery-replacement',
                'service_type' => ServiceType::Package,
                'name' => 'Battery Replacement',
                'description' => 'Battery and labor for most vehicles.',
                'base_price' => 275.00,
                'included_quarts' => 0,
                'additional_quart_price' => null,
                'features' => [
                    'Battery testing & terminal cleaning',
                    'On-site replacement',
                    'Includes battery & labor for most vehicles',
                ],
                'sort_order' => 5,
            ],
        ];

        $addons = [
            [
                'slug' => 'engine-air-filter',
                'service_type' => ServiceType::Addon,
                'name' => 'Engine Air Filter',
                'base_price' => 25.00,
                'price_label' => '$25 install + filter cost',
                'addon_note' => 'Free install with oil change',
                'included_quarts' => 0,
                'sort_order' => 10,
            ],
            [
                'slug' => 'cabin-air-filter',
                'service_type' => ServiceType::Addon,
                'name' => 'Cabin Air Filter',
                'base_price' => 25.00,
                'price_label' => '$25 install + filter cost',
                'addon_note' => 'Free install with oil change',
                'included_quarts' => 0,
                'sort_order' => 11,
            ],
            [
                'slug' => 'tire-rotation-addon',
                'service_type' => ServiceType::Addon,
                'name' => 'Tire Rotation',
                'base_price' => 50.00,
                'price_label' => '$50',
                'addon_note' => null,
                'included_quarts' => 0,
                'sort_order' => 12,
            ],
            [
                'slug' => 'wiper-blade-replacement',
                'service_type' => ServiceType::Addon,
                'name' => 'Wiper Blade Replacement',
                'base_price' => 25.00,
                'price_label' => '$25 install + wiper cost',
                'addon_note' => 'Free install with oil change',
                'included_quarts' => 0,
                'sort_order' => 13,
            ],
            [
                'slug' => 'battery-replacement-addon',
                'service_type' => ServiceType::Addon,
                'name' => 'Battery Replacement',
                'base_price' => 275.00,
                'price_label' => '$275',
                'addon_note' => 'Includes battery & labor for most vehicles',
                'included_quarts' => 0,
                'sort_order' => 14,
            ],
        ];

        foreach ([...$packages, ...$addons] as $service) {
            Service::query()->updateOrCreate(['slug' => $service['slug']], $service);
        }
    }
}
