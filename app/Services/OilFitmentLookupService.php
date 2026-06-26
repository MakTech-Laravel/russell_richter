<?php

namespace App\Services;

use App\Models\OilFitment;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Builder;

class OilFitmentLookupService
{
    /**
     * Find the best-matching oil fitment record for a vehicle.
     * Priority: engine-specific > generic (null engine) > any matching row.
     */
    public function find(Vehicle $vehicle): ?OilFitment
    {
        if (! $vehicle->make || ! $vehicle->model || ! $vehicle->year) {
            return null;
        }

        $normMake = OilFitment::normalize($vehicle->make);
        $normModel = OilFitment::normalize($vehicle->model);

        $base = OilFitment::query()
            ->whereRaw("LOWER(REPLACE(REPLACE(REPLACE(make, '-', ''), ' ', ''), '.', '')) = ?", [$normMake])
            ->whereRaw("LOWER(REPLACE(REPLACE(REPLACE(model, '-', ''), ' ', ''), '.', '')) = ?", [$normModel])
            ->where('year_from', '<=', $vehicle->year)
            ->where('year_to', '>=', $vehicle->year);

        // 1. Engine-specific match (partial string match on engine field)
        if ($vehicle->engine) {
            $engineMatch = (clone $base)
                ->where(fn (Builder $q) => $q
                    ->whereRaw('LOWER(engine) = ?', [strtolower($vehicle->engine)])
                    ->orWhereRaw('LOWER(?) LIKE CONCAT("%", LOWER(engine), "%")', [$vehicle->engine])
                )
                ->orderByRaw('engine IS NULL ASC')
                ->first();

            if ($engineMatch) {
                return $engineMatch;
            }
        }

        // 2. Generic row (engine IS NULL = applies to all engines of this make/model/year)
        $generic = (clone $base)->whereNull('engine')->first();
        if ($generic) {
            return $generic;
        }

        // 3. Last resort: any row for this make/model/year range
        return $base->first();
    }
}
