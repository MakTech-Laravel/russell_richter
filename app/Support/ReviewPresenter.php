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
        $hasGoogleReviews = Review::query()
            ->where('is_active', true)
            ->where('source', 'google')
            ->exists();

        return Review::query()
            ->where('is_active', true)
            ->when($hasGoogleReviews, fn ($query) => $query->where('source', 'google'))
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
