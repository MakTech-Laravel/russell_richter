<?php

namespace Database\Factories;

use App\Enums\ServiceType;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->words(3, true);

        return [
            'slug' => Str::slug($name),
            'service_type' => ServiceType::Package,
            'name' => ucwords($name),
            'description' => fake()->sentence(),
            'features' => [fake()->sentence(), fake()->sentence()],
            'base_price' => fake()->randomFloat(2, 50, 200),
            'included_quarts' => 6,
            'additional_quart_price' => 9.00,
            'is_active' => true,
            'is_popular' => false,
            'sort_order' => fake()->numberBetween(1, 10),
        ];
    }
}
