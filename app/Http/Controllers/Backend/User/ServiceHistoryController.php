<?php

namespace App\Http\Controllers\Backend\User;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceHistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $vehicleId = $request->integer('vehicle_id') ?: null;

        $query = $request->user()
            ->bookings()
            ->with(['vehicle', 'service', 'technician', 'recommendations'])
            ->where('status', BookingStatus::Completed)
            ->latest('completed_at');

        if ($vehicleId !== null) {
            $query->where('vehicle_id', $vehicleId);
        }

        $history = $query->get()->map(fn ($booking) => [
            'id' => $booking->id,
            'route_key' => $booking->getRouteKey(),
            'completed_at' => $booking->completed_at?->toDateTimeString(),
            'scheduled_at' => $booking->scheduled_at->toDateTimeString(),
            'total_price' => $booking->total_price,
            'vehicle' => $booking->vehicle?->display_name,
            'service' => $booking->service?->name,
            'technician' => $booking->technician?->name,
            'recommendations_count' => $booking->recommendations->count(),
        ]);

        $vehicles = $request->user()
            ->vehicles()
            ->orderBy('year', 'desc')
            ->get(['id', 'year', 'make', 'model'])
            ->map(fn (Vehicle $v) => [
                'id' => $v->id,
                'display_name' => $v->display_name,
            ]);

        return Inertia::render('backend/User/ServiceHistory/Index', [
            'history' => $history,
            'vehicles' => $vehicles,
            'filters' => ['vehicle_id' => $vehicleId],
        ]);
    }
}
