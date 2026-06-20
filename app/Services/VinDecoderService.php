<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class VinDecoderService
{
    /**
     * Decode a VIN using the free NHTSA VPIC API.
     *
     * @return array{
     *     vin: string,
     *     year: int|null,
     *     make: string|null,
     *     model: string|null,
     *     trim: string|null,
     *     engine: string|null,
     *     fuel_type: string|null,
     *     body_class: string|null,
     *     drive_type: string|null,
     *     raw: array<int, array<string, mixed>>
     * }
     */
    public function decode(string $vin): array
    {
        $vin = Str::upper(Str::replace(' ', '', $vin));

        $response = Http::timeout(15)
            ->get("https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{$vin}", [
                'format' => 'json',
            ]);

        $response->throw();

        $results = collect($response->json('Results', []))
            ->filter(fn (array $item): bool => ! empty($item['Variable']) && ($item['Value'] ?? null) !== null && ($item['Value'] ?? '') !== '')
            ->keyBy('Variable');

        return [
            'vin' => $vin,
            'year' => $this->toInt($results->get('Model Year')['Value'] ?? null),
            'make' => $this->toString($results->get('Make')['Value'] ?? null),
            'model' => $this->toString($results->get('Model')['Value'] ?? null),
            'trim' => $this->toString($results->get('Trim')['Value'] ?? null),
            'engine' => $this->composeEngine($results),
            'fuel_type' => $this->toString($results->get('Fuel Type - Primary')['Value'] ?? null),
            'body_class' => $this->toString($results->get('Body Class')['Value'] ?? null),
            'drive_type' => $this->toString($results->get('Drive Type')['Value'] ?? null),
            'raw' => $response->json('Results', []),
        ];
    }

    private function composeEngine(Collection $results): ?string
    {
        $displacement = $this->toString($results->get('Displacement (L)')['Value'] ?? null);
        $cylinders = $this->toString($results->get('Engine Number of Cylinders')['Value'] ?? null);

        if ($displacement && $cylinders) {
            return "{$displacement}L {$cylinders}-Cylinder";
        }

        return $displacement ?: $this->toString($results->get('Engine Model')['Value'] ?? null);
    }

    private function toInt(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) $value;
    }

    private function toString(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (string) $value;
    }
}
