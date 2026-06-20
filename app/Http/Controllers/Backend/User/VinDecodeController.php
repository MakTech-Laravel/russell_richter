<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use App\Services\VinDecoderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VinDecodeController extends Controller
{
    public function __construct(private VinDecoderService $vinDecoder) {}

    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'vin' => ['required', 'string', 'size:17', 'regex:/^[A-HJ-NPR-Z0-9]{17}$/i'],
        ]);

        try {
            $decoded = $this->vinDecoder->decode($request->string('vin')->toString());

            return response()->json([
                'success' => true,
                'data' => collect($decoded)->except('raw')->all(),
            ]);
        } catch (\Throwable $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Unable to decode VIN. Please enter vehicle details manually.',
            ], 422);
        }
    }
}
