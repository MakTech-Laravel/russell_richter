<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $reviews = [
            [
                'author_name' => 'Jessica R.',
                'reviewed_at' => 'April 2026',
                'review_text' => 'They came out to my house the same day I called. The convenience alone was amazing — friendly, professional, and very knowledgeable. Will absolutely use again!',
            ],
            [
                'author_name' => 'Taylor Miller',
                'reviewed_at' => 'March 2026',
                'review_text' => 'Highly recommend for your next oil change! Handled my truck with total professionalism — incredibly fast. No fighting traffic or sitting in a waiting room.',
            ],
            [
                'author_name' => 'Papa Jon',
                'reviewed_at' => 'March 2026',
                'review_text' => 'Fantastic! Professional and knowledgeable. I use Mobile Lube for all 3 of my family vehicles AND our church buses and vans.',
            ],
            [
                'author_name' => 'Holli Carroll',
                'reviewed_at' => 'Feb 2026',
                'review_text' => 'Jeep needed an oil change. Showed up on time, fast, efficient, and professional. The system is clean — no mess. Five stars all the way.',
            ],
        ];

        foreach ($reviews as $index => $review) {
            Review::query()->updateOrCreate(
                [
                    'author_name' => $review['author_name'],
                    'reviewed_at' => $review['reviewed_at'],
                ],
                [
                    'review_text' => $review['review_text'],
                    'rating' => 5,
                    'source' => 'manual',
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ],
            );
        }
    }
}
