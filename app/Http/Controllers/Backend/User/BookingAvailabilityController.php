<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\BookingAvailabilityService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingAvailabilityController extends Controller
{
    public function __invoke(Request $request, BookingAvailabilityService $availability): JsonResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
            'booking_id' => ['nullable', 'integer', 'exists:bookings,id'],
        ]);

        $ignore = null;

        if (! empty($validated['booking_id'])) {
            $ignore = Booking::query()
                ->whereKey($validated['booking_id'])
                ->where('user_id', $request->user()->id)
                ->first();

            if ($ignore === null) {
                abort(403);
            }
        }

        $slots = $availability->availableSlotsForDate(
            Carbon::parse($validated['date'])->startOfDay(),
            $ignore,
        );

        return response()->json([
            'date' => Carbon::parse($validated['date'])->toDateString(),
            'slots' => $slots,
        ]);
    }
}
