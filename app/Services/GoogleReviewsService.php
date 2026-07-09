<?php

namespace App\Services;

use App\Models\Review;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GoogleReviewsService
{
    /**
     * @return array{
     *     rating: float|null,
     *     totalReviews: int|null,
     *     source: 'google'|'local',
     *     profileUrl: string|null,
     *     writeReviewUrl: string
     * }
     */
    public function getHomepageSummary(): array
    {
        $this->syncIfStale();

        $summary = Cache::get($this->summaryCacheKey(), []);

        $placeId = $this->resolvePlaceId();

        return [
            'rating' => is_numeric($summary['rating'] ?? null) ? (float) $summary['rating'] : $this->averageLocalRating(),
            'totalReviews' => is_numeric($summary['totalReviews'] ?? null) ? (int) $summary['totalReviews'] : Review::query()->where('is_active', true)->count(),
            'source' => Review::query()->where('is_active', true)->where('source', 'google')->exists() ? 'google' : 'local',
            'profileUrl' => is_string($summary['profileUrl'] ?? null) ? $summary['profileUrl'] : null,
            'writeReviewUrl' => $this->buildWriteReviewUrl($placeId),
        ];
    }

    public function syncIfStale(): bool
    {
        if (! $this->canSync()) {
            return false;
        }

        $cacheKey = $this->syncCacheKey();

        if (Cache::has($cacheKey)) {
            return false;
        }

        return $this->syncFromGoogle();
    }

    public function syncFromGoogle(): bool
    {
        $placeId = $this->resolvePlaceId();
        $apiKey = config('services.google.places_api_key');

        if (blank($placeId) || blank($apiKey)) {
            return false;
        }

        $response = Http::timeout(10)
            ->withHeaders([
                'X-Goog-Api-Key' => $apiKey,
                'X-Goog-FieldMask' => 'reviews,rating,userRatingCount,googleMapsUri',
            ])
            ->get("https://places.googleapis.com/v1/places/{$placeId}");

        if (! $response->successful()) {
            return false;
        }

        /** @var array<string, mixed> $data */
        $data = $response->json();
        /** @var list<array<string, mixed>> $reviews */
        $reviews = $data['reviews'] ?? [];

        $syncedExternalIds = [];

        foreach ($reviews as $index => $review) {
            $text = data_get($review, 'text.text');
            $rating = (int) ($review['rating'] ?? 5);

            if (! is_string($text) || blank($text)) {
                $text = "Left a {$rating}-star rating on Google.";
            }

            $externalId = is_string($review['name'] ?? null) ? $review['name'] : "google-review-{$index}";

            Review::query()->updateOrCreate(
                ['external_id' => $externalId],
                [
                    'author_name' => (string) data_get($review, 'authorAttribution.displayName', 'Google User'),
                    'review_text' => $text,
                    'reviewed_at' => (string) data_get($review, 'relativePublishTimeDescription', ''),
                    'rating' => (int) ($review['rating'] ?? 5),
                    'photo_url' => data_get($review, 'authorAttribution.photoUri'),
                    'source' => 'google',
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ],
            );

            $syncedExternalIds[] = $externalId;
        }

        if ($syncedExternalIds !== []) {
            Review::query()
                ->where('source', 'google')
                ->whereNotIn('external_id', $syncedExternalIds)
                ->update(['is_active' => false]);

            Review::query()
                ->where('source', 'manual')
                ->update(['is_active' => false]);
        }

        Cache::put($this->summaryCacheKey(), [
            'rating' => isset($data['rating']) ? (float) $data['rating'] : null,
            'totalReviews' => isset($data['userRatingCount']) ? (int) $data['userRatingCount'] : null,
            'profileUrl' => is_string($data['googleMapsUri'] ?? null) ? $data['googleMapsUri'] : null,
        ], (int) config('services.google.cache_ttl', 86_400));

        Cache::put($this->syncCacheKey(), true, (int) config('services.google.cache_ttl', 86_400));

        return $syncedExternalIds !== [];
    }

    public function resolvePlaceId(): ?string
    {
        $configuredPlaceId = config('services.google.place_id');

        if (filled($configuredPlaceId)) {
            return $configuredPlaceId;
        }

        $apiKey = config('services.google.places_api_key');

        if (blank($apiKey)) {
            return null;
        }

        $cacheKey = 'google_resolved_place_id';

        $cachedPlaceId = Cache::get($cacheKey);

        if (is_string($cachedPlaceId) && filled($cachedPlaceId)) {
            return $cachedPlaceId;
        }

        $response = Http::timeout(10)
            ->withHeaders([
                'X-Goog-Api-Key' => $apiKey,
                'X-Goog-FieldMask' => 'places.id',
                'Content-Type' => 'application/json',
            ])
            ->post('https://places.googleapis.com/v1/places:searchText', [
                'textQuery' => config('services.google.business_search_query'),
            ]);

        if (! $response->successful()) {
            return null;
        }

        $placeId = data_get($response->json(), 'places.0.id');

        if (! is_string($placeId) || blank($placeId)) {
            return null;
        }

        Cache::put($cacheKey, $placeId, (int) config('services.google.cache_ttl', 86_400));

        return $placeId;
    }

    private function canSync(): bool
    {
        return filled(config('services.google.places_api_key')) && filled($this->resolvePlaceId());
    }

    private function buildWriteReviewUrl(?string $placeId): string
    {
        $customUrl = config('services.google.write_review_url');

        if (is_string($customUrl) && filled($customUrl)) {
            return $customUrl;
        }

        if (filled($placeId)) {
            return 'https://search.google.com/local/writereview?placeid='.urlencode($placeId);
        }

        $query = urlencode((string) config('services.google.business_search_query'));

        return "https://www.google.com/maps/search/?api=1&query={$query}";
    }

    private function averageLocalRating(): ?float
    {
        $average = Review::query()
            ->where('is_active', true)
            ->avg('rating');

        return $average !== null ? round((float) $average, 1) : null;
    }

    private function syncCacheKey(): string
    {
        return 'google_reviews_synced.'.md5((string) $this->resolvePlaceId());
    }

    private function summaryCacheKey(): string
    {
        return 'google_reviews_summary.'.md5((string) $this->resolvePlaceId());
    }
}
