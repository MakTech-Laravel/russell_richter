<?php

namespace App\Http\Controllers\Backend\User;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceHistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $history = $request->user()
            ->bookings()
            ->with(['vehicle', 'service', 'technician', 'recommendations'])
            ->where('status', BookingStatus::Completed)
            ->latest('completed_at')
            ->get()
            ->map(fn ($booking) => [
                'id' => $booking->id,
                'completed_at' => $booking->completed_at?->toDateTimeString(),
                'scheduled_at' => $booking->scheduled_at->toDateTimeString(),
                'total_price' => $booking->total_price,
                'vehicle' => $booking->vehicle?->display_name,
                'service' => $booking->service?->name,
                'technician' => $booking->technician?->name,
                'recommendations_count' => $booking->recommendations->count(),
            ]);

        return Inertia::render('backend/User/ServiceHistory/Index', [
            'history' => $history,
        ]);
    }
}
