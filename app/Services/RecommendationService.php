<?php

namespace App\Services;

use App\Enums\RecommendationPartType;
use App\Models\Booking;
use App\Models\BookingRecommendation;
use App\Models\OilFitment;
use App\Models\Service;
use App\Models\Vehicle;
use Illuminate\Support\Collection;

class RecommendationService
{
    public function __construct(
        private OilFitmentLookupService $fitmentLookup,
    ) {}

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
        $fitment = $this->fitmentLookup->find($vehicle);

        $fuelType = strtolower($vehicle->fuel_type ?? '');
        $isDiesel = str_contains($fuelType, 'diesel') || $service->slug === 'diesel-oil-change';
        $isSynthetic = $service->slug === 'full-synthetic-oil-change'
            || (! $isDiesel && $this->shouldRecommendSynthetic($vehicle, $fitment));

        return collect([
            $this->buildOilRecommendation($vehicle, $service, $fitment, $isDiesel, $isSynthetic),
            $this->buildOilFilterRecommendation($vehicle, $fitment),
            $this->buildCabinFilterRecommendation($vehicle),
            $this->buildWiperRecommendation($vehicle),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function buildOilRecommendation(
        Vehicle $vehicle,
        Service $service,
        ?OilFitment $fitment,
        bool $isDiesel,
        bool $isSynthetic,
    ): array {
        $grade = $fitment?->oil_grade;
        $quarts = $fitment?->oil_capacity_quarts ?? $service->included_quarts;

        $oilName = match (true) {
            $isDiesel => 'Diesel-rated heavy-duty oil'.($grade ? " ({$grade})" : ' (grade TBD — verify on site)'),
            $isSynthetic => 'Premium full synthetic oil'.($grade ? " ({$grade})" : ''),
            default => 'Conventional motor oil'.($grade ? " ({$grade})" : ''),
        };

        return [
            'part_type' => RecommendationPartType::Oil,
            'part_name' => $oilName,
            'part_number' => null,
            'specification' => $grade ?? $vehicle->engine,
            'quantity' => $quarts,
            'estimated_price' => $service->base_price,
            'notes' => $fitment
                ? 'Oil grade and capacity matched from vehicle fitment database (OEM spec).'
                : 'No exact fitment record found — using service default capacity. Technician should verify grade on site.',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function buildOilFilterRecommendation(Vehicle $vehicle, ?OilFitment $fitment): array
    {
        if ($fitment) {
            $brand = $fitment->oil_filter_brand ?? 'OEM';
            $partNo = $fitment->oil_filter_part_no;
            $name = "{$brand} Oil Filter — {$partNo}";

            return [
                'part_type' => RecommendationPartType::OilFilter,
                'part_name' => $name,
                'part_number' => $partNo,
                'specification' => trim(implode(' ', array_filter([$vehicle->year, $vehicle->make, $vehicle->model]))),
                'quantity' => 1,
                'estimated_price' => null,
                'notes' => 'Exact OEM cross-reference match from fitment database.',
            ];
        }

        return [
            'part_type' => RecommendationPartType::OilFilter,
            'part_name' => sprintf(
                'Oil filter — confirm on site for %s %s %s',
                $vehicle->year ?? 'Unknown',
                $vehicle->make ?? 'Unknown',
                $vehicle->model ?? 'Vehicle',
            ),
            'part_number' => null,
            'specification' => trim(implode(' ', array_filter([$vehicle->year, $vehicle->make, $vehicle->model]))),
            'quantity' => 1,
            'estimated_price' => null,
            'notes' => 'No fitment record in database. Technician must verify exact filter part number on site.',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function buildCabinFilterRecommendation(Vehicle $vehicle): array
    {
        return [
            'part_type' => RecommendationPartType::CabinFilter,
            'part_name' => sprintf('Cabin air filter — %s %s', $vehicle->make ?? 'Vehicle', $vehicle->model ?? ''),
            'part_number' => null,
            'specification' => $vehicle->body_class,
            'quantity' => 1,
            'estimated_price' => null,
            'notes' => 'Replace if due based on mileage or every 12 months.',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function buildWiperRecommendation(Vehicle $vehicle): array
    {
        $body = strtolower($vehicle->body_class ?? '');

        $name = match (true) {
            str_contains($body, 'truck') || str_contains($body, 'pickup') => 'Heavy-duty wiper blades (22"/22" typical for trucks — verify on site)',
            str_contains($body, 'suv') || str_contains($body, 'utility') => 'All-season wiper blades (26"/17" typical for SUVs — verify on site)',
            default => 'All-season wiper blades (26"/16" typical for sedans — verify on site)',
        };

        return [
            'part_type' => RecommendationPartType::Wiper,
            'part_name' => $name,
            'part_number' => null,
            'specification' => $vehicle->body_class,
            'quantity' => 1,
            'estimated_price' => null,
            'notes' => 'Verify exact fitment on site before install.',
        ];
    }

    private function shouldRecommendSynthetic(Vehicle $vehicle, ?OilFitment $fitment): bool
    {
        if ($fitment) {
            return $fitment->supports_synthetic;
        }

        if ($vehicle->year !== null && $vehicle->year >= 2015) {
            return true;
        }

        return in_array(strtolower($vehicle->make ?? ''), [
            'bmw', 'mercedes-benz', 'audi', 'lexus', 'acura', 'infiniti', 'porsche',
        ], true);
    }
}
