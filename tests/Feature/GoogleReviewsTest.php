<?php

use App\Models\Review;
use App\Services\GoogleReviewsService;
use Database\Seeders\ReviewSeeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    Cache::flush();
    config([
        'services.google.places_api_key' => null,
        'services.google.place_id' => null,
        'services.google.write_review_url' => null,
        'services.google.business_search_query' => 'Mobile Lube, LLC Victoria, TX',
        'services.google.cache_ttl' => 86_400,
    ]);
});

it('builds a google maps search fallback when place id is not configured', function () {
    $summary = app(GoogleReviewsService::class)->getHomepageSummary();

    expect($summary['writeReviewUrl'])->toBe('https://www.google.com/maps/search/?api=1&query=Mobile+Lube%2C+LLC+Victoria%2C+TX');
});

it('builds a google write review url when place id is configured', function () {
    config([
        'services.google.place_id' => 'ChIJTestPlaceId',
    ]);

    $summary = app(GoogleReviewsService::class)->getHomepageSummary();

    expect($summary['writeReviewUrl'])->toBe('https://search.google.com/local/writereview?placeid=ChIJTestPlaceId');
});

it('syncs google reviews into the database', function () {
    config([
        'services.google.places_api_key' => 'test-api-key',
        'services.google.place_id' => 'ChIJTestPlaceId',
    ]);

    Http::fake([
        'places.googleapis.com/*' => Http::response([
            'rating' => 4.8,
            'userRatingCount' => 42,
            'googleMapsUri' => 'https://maps.google.com/?cid=123',
            'reviews' => [
                [
                    'name' => 'places/ChIJTestPlaceId/reviews/1',
                    'relativePublishTimeDescription' => '2 weeks ago',
                    'rating' => 5,
                    'text' => ['text' => 'Excellent mobile oil change service!'],
                    'authorAttribution' => [
                        'displayName' => 'Alex Johnson',
                        'photoUri' => 'https://example.com/photo.jpg',
                    ],
                ],
            ],
        ]),
    ]);

    expect(app(GoogleReviewsService::class)->syncFromGoogle())->toBeTrue();

    expect(Review::query()->where('source', 'google')->count())->toBe(1)
        ->and(Review::query()->where('author_name', 'Alex Johnson')->exists())->toBeTrue()
        ->and(Review::query()->where('source', 'manual')->where('is_active', true)->count())->toBe(0);
});

it('falls back to local reviews when google sync fails', function () {
    Review::factory()->create([
        'author_name' => 'Local Customer',
        'review_text' => 'Great local service.',
        'reviewed_at' => 'May 2026',
        'rating' => 5,
        'source' => 'manual',
        'is_active' => true,
    ]);

    config([
        'services.google.places_api_key' => 'test-api-key',
        'services.google.place_id' => 'ChIJTestPlaceId',
    ]);

    Http::fake([
        'places.googleapis.com/*' => Http::response([], 500),
    ]);

    $summary = app(GoogleReviewsService::class)->getHomepageSummary();

    expect($summary['source'])->toBe('local')
        ->and($summary['rating'])->toBe(5.0);
});

it('homepage serves reviews from the database', function () {
    Review::query()->delete();

    Review::factory()->create([
        'author_name' => 'Maria Garcia',
        'review_text' => 'Best oil change in Victoria!',
        'reviewed_at' => '1 month ago',
        'rating' => 5,
        'source' => 'google',
        'sort_order' => 1,
        'is_active' => true,
    ]);

    config([
        'services.google.place_id' => 'ChIJTestPlaceId',
    ]);

    $this->get(route('home'))
        ->assertSuccessful()
        ->assertInertia(
            fn($page) => $page
                ->has('googleReviews', 1)
                ->where('googleReviews.0.name', 'Maria Garcia')
                ->where('googleReviews.0.text', 'Best oil change in Victoria!')
                ->where('googleReviewSummary.source', 'google')
                ->where('googleReviewSummary.writeReviewUrl', 'https://search.google.com/local/writereview?placeid=ChIJTestPlaceId')
        );
});

it('homepage serves only google reviews when google reviews exist', function () {
    Review::query()->delete();

    Review::factory()->create([
        'author_name' => 'Jessica R.',
        'review_text' => 'Manual review',
        'reviewed_at' => 'April 2026',
        'source' => 'manual',
        'is_active' => true,
    ]);

    Review::factory()->create([
        'author_name' => 'Wasif Ahmed',
        'review_text' => 'This is a good service provider',
        'reviewed_at' => 'in the last week',
        'source' => 'google',
        'is_active' => true,
    ]);

    $this->get(route('home'))
        ->assertSuccessful()
        ->assertInertia(
            fn($page) => $page
                ->has('googleReviews', 1)
                ->where('googleReviews.0.name', 'Wasif Ahmed')
                ->where('googleReviewSummary.source', 'google')
        );
});

it('homepage serves seeded local reviews when google is not configured', function () {
    $this->seed(ReviewSeeder::class);

    $this->get(route('home'))
        ->assertSuccessful()
        ->assertInertia(
            fn($page) => $page
                ->has('googleReviews', 4)
                ->where('googleReviewSummary.source', 'local')
                ->where('googleReviews.0.name', 'Jessica R.')
        );
});

it('sync command reports failure when google is not configured', function () {
    $this->artisan('reviews:sync-google')
        ->assertFailed();
});

it('sync command succeeds when google returns reviews', function () {
    config([
        'services.google.places_api_key' => 'test-api-key',
        'services.google.place_id' => 'ChIJTestPlaceId',
    ]);

    Http::fake([
        'places.googleapis.com/*' => Http::response([
            'rating' => 5,
            'userRatingCount' => 1,
            'googleMapsUri' => 'https://maps.google.com/?cid=456',
            'reviews' => [
                [
                    'name' => 'places/ChIJTestPlaceId/reviews/1',
                    'relativePublishTimeDescription' => '1 week ago',
                    'rating' => 5,
                    'text' => ['text' => 'Synced from Google'],
                    'authorAttribution' => [
                        'displayName' => 'Synced User',
                        'photoUri' => null,
                    ],
                ],
            ],
        ]),
    ]);

    $this->artisan('reviews:sync-google')
        ->assertSuccessful();

    expect(Review::query()->where('author_name', 'Synced User')->exists())->toBeTrue();
});

it('schedules google reviews sync daily', function () {
    $this->artisan('schedule:list')
        ->assertSuccessful()
        ->expectsOutputToContain('reviews:sync-google');
});
