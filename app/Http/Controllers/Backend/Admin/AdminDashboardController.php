<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Technician;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('backend/Admin/AdminDashboard', [
            'stats' => [
                'customers' => User::query()->count(),
                'vehicles' => Vehicle::query()->count(),
                'pending_bookings' => Booking::query()->where('status', BookingStatus::Pending)->count(),
                'today_bookings' => Booking::query()->whereDate('scheduled_at', today())->count(),
                'completed_bookings' => Booking::query()->where('status', BookingStatus::Completed)->count(),
                'technicians' => Technician::query()->where('is_active', true)->count(),
            ],
            'recentBookings' => Booking::query()
                ->with(['user', 'vehicle', 'service'])
                ->latest()
                ->limit(8)
                ->get()
                ->map(fn (Booking $b) => [
                    'id' => $b->id,
                    'customer' => $b->user?->name,
                    'vehicle' => $b->vehicle?->display_name,
                    'service' => $b->service?->name,
                    'status' => $b->status->label(),
                    'scheduled_at' => $b->scheduled_at->toDateTimeString(),
                ]),
        ]);
    }
}
