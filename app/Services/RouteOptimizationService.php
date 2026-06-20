<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Technician;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class RouteOptimizationService
{
    /**
     * Optimize route order for a technician's bookings on a given date.
     *
     * @return Collection<int, Booking>
     */
    public function optimizeForTechnician(Technician $technician, Carbon $date): Collection
    {
        $bookings = Booking::query()
            ->where('technician_id', $technician->id)
            ->whereDate('scheduled_at', $date)
            ->whereNotIn('status', [BookingStatus::Cancelled, BookingStatus::Completed])
            ->orderBy('scheduled_at')
            ->get();

        if ($bookings->count() <= 1) {
            return $this->persistOrder($bookings);
        }

        $withCoordinates = $bookings->filter(fn (Booking $booking): bool => $booking->latitude !== null && $booking->longitude !== null);
        $withoutCoordinates = $bookings->reject(fn (Booking $booking): bool => $booking->latitude !== null && $booking->longitude !== null);

        if ($withCoordinates->isEmpty()) {
            return $this->persistOrder($bookings->sortBy(['service_zip', 'scheduled_at'])->values());
        }

        $ordered = $this->nearestNeighborSort($withCoordinates);
        $final = $ordered->concat($withoutCoordinates->sortBy('scheduled_at')->values());

        return $this->persistOrder($final);
    }

    /**
     * @param  Collection<int, Booking>  $bookings
     * @return Collection<int, Booking>
     */
    private function nearestNeighborSort(Collection $bookings): Collection
    {
        $remaining = $bookings->values();
        $ordered = collect();
        $current = $remaining->shift();
        $ordered->push($current);

        while ($remaining->isNotEmpty()) {
            $nearestKey = null;
            $nearestDistance = PHP_FLOAT_MAX;

            foreach ($remaining as $key => $candidate) {
                $distance = $this->haversineDistance(
                    (float) $current->latitude,
                    (float) $current->longitude,
                    (float) $candidate->latitude,
                    (float) $candidate->longitude,
                );

                if ($distance < $nearestDistance) {
                    $nearestDistance = $distance;
                    $nearestKey = $key;
                }
            }

            $current = $remaining->pull($nearestKey);
            $ordered->push($current);
        }

        return $ordered;
    }

    /**
     * @param  Collection<int, Booking>  $bookings
     * @return Collection<int, Booking>
     */
    private function persistOrder(Collection $bookings): Collection
    {
        foreach ($bookings->values() as $index => $booking) {
            $booking->update(['route_order' => $index + 1]);
        }

        return $bookings->values();
    }

    private function haversineDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371;
        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($lonDelta / 2) ** 2;

        return $earthRadius * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }
}
