<?php

namespace Database\Factories;

use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'external_id' => null,
            'author_name' => fake()->name(),
            'review_text' => fake()->paragraph(),
            'reviewed_at' => fake()->date('F Y'),
            'rating' => fake()->numberBetween(4, 5),
            'photo_url' => null,
            'source' => 'manual',
            'sort_order' => fake()->numberBetween(1, 10),
            'is_active' => true,
        ];
    }

    public function google(): static
    {
        return $this->state(fn (): array => [
            'external_id' => 'places/ChIJTest/reviews/'.fake()->uuid(),
            'source' => 'google',
        ]);
    }
}
