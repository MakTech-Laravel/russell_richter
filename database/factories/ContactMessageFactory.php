<?php

namespace Database\Factories;

use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactMessage>
 */
class ContactMessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'company_name' => fake()->company(),
            'contact_name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->numerify('###-###-####'),
            'vehicle_count' => fake()->numberBetween(1, 25),
            'vehicle_types' => fake()->randomElement(['Cars', 'Pickup trucks', 'Mixed fleet', 'Delivery vans']),
            'message' => fake()->paragraph(),
            'read_at' => null,
        ];
    }

    public function read(): static
    {
        return $this->state(fn (): array => [
            'read_at' => now(),
        ]);
    }
}
