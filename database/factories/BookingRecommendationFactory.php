<?php

namespace Database\Factories;

use App\Enums\RecommendationPartType;
use App\Models\Booking;
use App\Models\BookingRecommendation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BookingRecommendation>
 */
class BookingRecommendationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'part_type' => fake()->randomElement(RecommendationPartType::cases()),
            'part_name' => fake()->words(3, true),
            'quantity' => 1,
        ];
    }
}
