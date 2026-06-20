<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vehicle>
 */
class VehicleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'vin' => strtoupper(fake()->bothify('?#?#?#?#?#?#?#?#?#?#')),
            'year' => fake()->numberBetween(2010, 2024),
            'make' => fake()->randomElement(['Toyota', 'Ford', 'Chevrolet', 'Honda', 'Ram']),
            'model' => fake()->randomElement(['Camry', 'F-150', 'Silverado', 'Accord', '1500']),
            'mileage' => fake()->numberBetween(10000, 150000),
        ];
    }
}
