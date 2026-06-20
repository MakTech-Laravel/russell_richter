<?php

namespace App\Services;

use App\Enums\RecommendationPartType;
use App\Models\Booking;
use App\Models\BookingRecommendation;
use App\Models\Service;
use App\Models\Vehicle;
use Illuminate\Support\Collection;

class RecommendationService
{
    /**
     * Generate and persist oil, filter, and wiper recommendations for a booking.
     *
     * @return Collection<int, BookingRecommendation>
     */
    public function generateForBooking(Booking $booking): Collection
    {
        $booking->loadMissing(['vehicle', 'service']);
        $booking->recommendations()->delete();

        $recommendations = $this->buildRecommendations($booking->vehicle, $booking->service);

        return $recommendations->map(function (array $data) use ($booking): BookingRecommendation {
            return $booking->recommendations()->create($data);
        });
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function buildRecommendations(Vehicle $vehicle, Service $service): Collection
    {
        $fuelType = strtolower($vehicle->fuel_type ?? '');
        $isDiesel = str_contains($fuelType, 'diesel') || $service->slug === 'diesel-oil-change';
        $isSynthetic = $service->slug === 'full-synthetic-oil-change' || (! $isDiesel && $this->shouldRecommendSynthetic($vehicle));

        $oilName = match (true) {
            $isDiesel => 'Diesel-rated heavy-duty oil (up to '.$service->included_quarts.' quarts)',
            $isSynthetic => 'Premium full synthetic oil (up to '.$service->included_quarts.' quarts)',
            default => 'Conventional motor oil (up to '.$service->included_quarts.' quarts)',
        };

        $filterName = $this->recommendOilFilter($vehicle);
        $cabinFilter = $this->recommendCabinFilter($vehicle);
        $wiper = $this->recommendWiper($vehicle);

        return collect([
            [
                'part_type' => RecommendationPartType::Oil,
                'part_name' => $oilName,
                'specification' => $vehicle->engine,
                'quantity' => $service->included_quarts,
                'estimated_price' => $service->base_price,
                'notes' => 'Based on selected service and VIN decode data.',
            ],
            [
                'part_type' => RecommendationPartType::OilFilter,
                'part_name' => $filterName,
                'specification' => trim(($vehicle->year ?? '').' '.$vehicle->make.' '.$vehicle->model),
                'quantity' => 1,
                'estimated_price' => null,
                'notes' => 'Vehicle-specific premium oil filter.',
            ],
            [
                'part_type' => RecommendationPartType::CabinFilter,
                'part_name' => $cabinFilter,
                'specification' => $vehicle->body_class,
                'quantity' => 1,
                'estimated_price' => null,
                'notes' => 'Replace if due based on mileage or every 12 months.',
            ],
            [
                'part_type' => RecommendationPartType::Wiper,
                'part_name' => $wiper,
                'specification' => $vehicle->body_class,
                'quantity' => 1,
                'estimated_price' => null,
                'notes' => 'Verify exact fitment on site before install.',
            ],
        ]);
    }

    private function shouldRecommendSynthetic(Vehicle $vehicle): bool
    {
        if ($vehicle->year !== null && $vehicle->year >= 2015) {
            return true;
        }

        $make = strtolower($vehicle->make ?? '');

        return in_array($make, ['bmw', 'mercedes-benz', 'audi', 'lexus', 'acura', 'infiniti', 'porsche'], true);
    }

    private function recommendOilFilter(Vehicle $vehicle): string
    {
        return sprintf(
            'Premium oil filter for %s %s %s',
            $vehicle->year ?? 'Unknown',
            $vehicle->make ?? 'Unknown',
            $vehicle->model ?? 'Vehicle'
        );
    }

    private function recommendCabinFilter(Vehicle $vehicle): string
    {
        return sprintf(
            'Cabin air filter — %s %s',
            $vehicle->make ?? 'Vehicle',
            $vehicle->model ?? 'model'
        );
    }

    private function recommendWiper(Vehicle $vehicle): string
    {
        $body = strtolower($vehicle->body_class ?? '');

        if (str_contains($body, 'truck') || str_contains($body, 'pickup')) {
            return 'Heavy-duty wiper blades (22"/22" typical for trucks — verify on site)';
        }

        if (str_contains($body, 'suv') || str_contains($body, 'utility')) {
            return 'All-season wiper blades (26"/17" typical for SUVs — verify on site)';
        }

        return 'All-season wiper blades (26"/16" typical for sedans — verify on site)';
    }
}
