<?php

namespace Database\Factories;

use App\Models\Technician;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Technician>
 */
class TechnicianFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => 'password',
            'phone' => fake()->phoneNumber(),
            'is_active' => true,
        ];
    }
}
