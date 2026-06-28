<?php

namespace App\Services;

use App\Models\OilFitment;
use App\Models\Vehicle;
use Illuminate\Support\Collection;

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
        $modelCandidates = $this->modelCandidates($vehicle);

        $fitments = OilFitment::query()
            ->where('year_from', '<=', $vehicle->year)
            ->where('year_to', '>=', $vehicle->year)
            ->whereRaw("LOWER(REPLACE(REPLACE(REPLACE(make, '-', ''), ' ', ''), '.', '')) = ?", [$normMake])
            ->get()
            ->filter(function (OilFitment $fitment) use ($modelCandidates): bool {
                $fitmentModel = OilFitment::normalize($fitment->model);

                foreach ($modelCandidates as $candidate) {
                    if ($this->modelsMatch($candidate, $fitmentModel)) {
                        return true;
                    }
                }

                return false;
            });

        if ($fitments->isEmpty()) {
            return null;
        }

        return $this->selectBestEngineMatch($fitments, $vehicle->engine);
    }

    /**
     * @return list<string>
     */
    private function modelCandidates(Vehicle $vehicle): array
    {
        $candidates = [OilFitment::normalize($vehicle->model)];

        if ($vehicle->trim) {
            $trim = trim((string) $vehicle->trim);
            $candidates[] = OilFitment::normalize($vehicle->model.$trim);
            $candidates[] = OilFitment::normalize($vehicle->model.' '.$trim);
            $candidates[] = OilFitment::normalize($trim);
        }

        return array_values(array_unique(array_filter($candidates)));
    }

    private function modelsMatch(string $candidate, string $fitmentModel): bool
    {
        if ($candidate === $fitmentModel) {
            return true;
        }

        // NHTSA often returns a short model (e.g. "RX") while fitments use "RX350".
        if (strlen($candidate) >= 2 && str_starts_with($fitmentModel, $candidate)) {
            return true;
        }

        // Some VINs return "Silverado 1500" while fitments use "Silverado".
        if (strlen($fitmentModel) >= 2 && str_starts_with($candidate, $fitmentModel)) {
            return true;
        }

        return false;
    }

    /**
     * @param  Collection<int, OilFitment>  $fitments
     */
    private function selectBestEngineMatch(Collection $fitments, ?string $engine): ?OilFitment
    {
        if ($engine) {
            $engineLower = strtolower($engine);

            $engineMatch = $fitments
                ->filter(function (OilFitment $fitment) use ($engineLower): bool {
                    if ($fitment->engine === null) {
                        return false;
                    }

                    $fitmentEngine = strtolower($fitment->engine);

                    return $fitmentEngine === $engineLower
                        || str_contains($engineLower, $fitmentEngine)
                        || str_contains($fitmentEngine, $engineLower);
                })
                ->sortByDesc(fn (OilFitment $fitment): int => strlen((string) $fitment->engine))
                ->first();

            if ($engineMatch) {
                return $engineMatch;
            }
        }

        $generic = $fitments->firstWhere('engine', null);
        if ($generic) {
            return $generic;
        }

        return $fitments->first();
    }
}
