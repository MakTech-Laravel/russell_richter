<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeocodingService
{
    /**
     * @return array{latitude: float|null, longitude: float|null}
     */
    public function geocodeAddress(string $address, string $city, string $state, string $zip): array
    {
        $query = urlencode("{$address}, {$city}, {$state} {$zip}, USA");

        $response = Http::timeout(10)
            ->withHeaders(['User-Agent' => config('app.name').' Geocoder'])
            ->get("https://nominatim.openstreetmap.org/search?q={$query}&format=json&limit=1");

        if (! $response->successful() || empty($response->json())) {
            return ['latitude' => null, 'longitude' => null];
        }

        $result = $response->json()[0];

        return [
            'latitude' => isset($result['lat']) ? (float) $result['lat'] : null,
            'longitude' => isset($result['lon']) ? (float) $result['lon'] : null,
        ];
    }
}
