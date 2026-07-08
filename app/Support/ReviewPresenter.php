<?php

namespace App\Support;

use App\Models\Review;

class ReviewPresenter
{
    /**
     * @return array<int, array{id: string, name: string, date: string, text: string, rating: int, photoUrl: string|null}>
     */
    public static function forHomepage(): array
    {
        return Review::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Review $review): array => [
                'id' => (string) $review->id,
                'name' => $review->author_name,
                'date' => $review->reviewed_at,
                'text' => $review->review_text,
                'rating' => $review->rating,
                'photoUrl' => $review->photo_url,
            ])
            ->values()
            ->all();
    }
}
