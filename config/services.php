<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'wheniwork' => [
        'api_key' => env('WHEN_I_WORK_API_KEY'),
        'login_url' => env('WHEN_I_WORK_LOGIN_URL', 'https://api.login.wheniwork.com/login'),
        'base_url' => env('WHEN_I_WORK_BASE_URL', 'https://api.wheniwork.com/2/'),
    ],

    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        'currency' => env('STRIPE_CURRENCY', 'usd'),
    ],

    'google' => [
        'places_api_key' => env('GOOGLE_PLACES_API_KEY'),
        'place_id' => env('GOOGLE_PLACE_ID'),
        'write_review_url' => env('GOOGLE_WRITE_REVIEW_URL'),
        'business_search_query' => env('GOOGLE_BUSINESS_SEARCH_QUERY', 'Mobile Lube, LLC Victoria, TX'),
        'cache_ttl' => env('GOOGLE_REVIEWS_CACHE_TTL', 86_400),
    ],

];
