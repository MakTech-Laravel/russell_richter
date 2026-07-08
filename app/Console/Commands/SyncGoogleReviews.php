<?php

namespace App\Console\Commands;

use App\Services\GoogleReviewsService;
use Illuminate\Console\Command;

class SyncGoogleReviews extends Command
{
    protected $signature = 'reviews:sync-google';

    protected $description = 'Sync Google Business reviews into the database';

    public function handle(GoogleReviewsService $googleReviews): int
    {
        if (! $googleReviews->syncFromGoogle()) {
            $this->error('Google reviews could not be synced. Check GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID.');

            return self::FAILURE;
        }

        $this->info('Google reviews synced successfully.');

        return self::SUCCESS;
    }
}
