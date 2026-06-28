<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Services\OilFitmentLookupService;
use App\Services\VinDecoderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VinDecodeController extends Controller
{
    public function __construct(
        private VinDecoderService $vinDecoder,
        private OilFitmentLookupService $fitmentLookup,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'vin' => ['required', 'string', 'size:17', 'regex:/^[A-HJ-NPR-Z0-9]{17}$/i'],
        ]);

        try {
            $decoded = $this->vinDecoder->decode($request->string('vin')->toString());

            $vehicle = new Vehicle([
                'year' => $decoded['year'],
                'make' => $decoded['make'],
                'model' => $decoded['model'],
                'trim' => $decoded['trim'],
                'engine' => $decoded['engine'],
            ]);

            $fitment = $this->fitmentLookup->find($vehicle);

            $oilSpec = $fitment ? [
                'oil_grade' => $fitment->oil_grade,
                'oil_capacity_quarts' => (float) $fitment->oil_capacity_quarts,
                'oil_filter_part_no' => $fitment->oil_filter_part_no,
                'oil_filter_brand' => $fitment->oil_filter_brand,
                'supports_synthetic' => $fitment->supports_synthetic,
            ] : null;

            return response()->json([
                'success' => true,
                'data' => collect($decoded)->except('raw')->all(),
                'oil_spec' => $oilSpec,
            ]);
        } catch (\Throwable $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Unable to decode VIN. Please enter vehicle details manually.',
            ], 422);
        }
    }
}
