<?php

namespace Database\Factories;

use App\Models\OilFitment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OilFitment>
 */
class OilFitmentFactory extends Factory
{
    public function definition(): array
    {
        $yearFrom = fake()->numberBetween(2010, 2020);

        return [
            'make' => fake()->randomElement(['Ford', 'Toyota', 'Honda', 'Chevrolet', 'Ram']),
            'model' => fake()->randomElement(['F-150', 'Camry', 'Civic', 'Silverado', '1500']),
            'year_from' => $yearFrom,
            'year_to' => $yearFrom + fake()->numberBetween(1, 5),
            'engine' => null,
            'oil_filter_part_no' => strtoupper(fake()->bothify('??-###')),
            'oil_filter_brand' => fake()->randomElement(['Motorcraft', 'Toyota OEM', 'Honda OEM', 'ACDelco', 'Mopar']),
            'oil_grade' => fake()->randomElement(['0W-20', '5W-20', '5W-30']),
            'oil_capacity_quarts' => fake()->randomFloat(1, 4, 8),
            'supports_synthetic' => true,
        ];
    }
}
