<?php

namespace Database\Factories;

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
            'name' => ucwords($name),
            'description' => fake()->sentence(),
            'base_price' => fake()->randomFloat(2, 50, 200),
            'included_quarts' => 6,
            'additional_quart_price' => 9.00,
            'is_active' => true,
            'sort_order' => fake()->numberBetween(1, 10),
        ];
    }
}
