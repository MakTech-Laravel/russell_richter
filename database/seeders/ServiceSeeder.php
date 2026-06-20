<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'slug' => 'full-synthetic-oil-change',
                'name' => 'Full Synthetic Oil Change',
                'description' => 'Up to 6 quarts premium synthetic oil, premium filter, fluid inspection, tire pressure & battery check.',
                'base_price' => 120.00,
                'included_quarts' => 6,
                'additional_quart_price' => 9.00,
                'sort_order' => 1,
            ],
            [
                'slug' => 'conventional-oil-change',
                'name' => 'Conventional Oil Change',
                'description' => 'Up to 6 quarts of oil, filter replacement, and multi-point inspection.',
                'base_price' => 99.00,
                'included_quarts' => 6,
                'additional_quart_price' => 6.00,
                'sort_order' => 2,
            ],
            [
                'slug' => 'diesel-oil-change',
                'name' => 'Diesel Oil Change',
                'description' => 'Up to 13 quarts diesel-rated oil, heavy-duty filter, multi-point & fluid inspection.',
                'base_price' => 180.00,
                'included_quarts' => 13,
                'additional_quart_price' => 9.00,
                'sort_order' => 3,
            ],
            [
                'slug' => 'tire-rotation',
                'name' => 'Tire Rotation',
                'description' => 'Tires rotated per manufacturer pattern with tread depth inspection.',
                'base_price' => 50.00,
                'included_quarts' => 0,
                'additional_quart_price' => null,
                'sort_order' => 4,
            ],
            [
                'slug' => 'battery-replacement',
                'name' => 'Battery Replacement',
                'description' => 'Battery and labor for most vehicles.',
                'base_price' => 275.00,
                'included_quarts' => 0,
                'additional_quart_price' => null,
                'sort_order' => 5,
            ],
        ];

        foreach ($services as $service) {
            Service::query()->updateOrCreate(['slug' => $service['slug']], $service);
        }
    }
}
