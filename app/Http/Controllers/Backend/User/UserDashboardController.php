<?php

namespace App\Http\Controllers\Backend\User;

use App\Enums\BookingStatus;
use App\Enums\TransactionStatus;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Support\BookingPresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $upcomingBookings = $user->bookings()
            ->with(['vehicle', 'service'])
            ->whereNotIn('status', [BookingStatus::Completed, BookingStatus::Cancelled])
            ->orderBy('scheduled_at')
            ->limit(5)
            ->get()
            ->map(fn($booking) => [
                'id' => $booking->id,
                'scheduled_at' => $booking->scheduled_at->toDateTimeString(),
                'status' => $booking->status->value,
                'status_label' => $booking->status->label(),
                ...BookingPresenter::workMeta($booking->status),
                'vehicle' => $booking->vehicle?->display_name,
                'service' => $booking->service?->name,
            ]);

        return Inertia::render('backend/User/UserDashboard', [
            'stats' => [
                'vehicles_count' => $user->vehicles()->count(),
                'upcoming_bookings' => $user->bookings()->whereNotIn('status', [BookingStatus::Completed, BookingStatus::Cancelled])->count(),
                'completed_services' => $user->bookings()->where('status', BookingStatus::Completed)->count(),
                'total_spent' => $user->transactions()->where('status', TransactionStatus::Succeeded)->sum('amount'),
            ],
            'upcomingBookings' => $upcomingBookings,
            'vehicles' => $user->vehicles()->latest()->limit(3)->get()->map(fn($v) => [
                'id' => $v->id,
                'display_name' => $v->display_name,
                'vin' => $v->vin,
                'mileage' => $v->mileage,
            ]),
            'recentTransactions' => $user->transactions()
                ->with(['booking.service:id,name'])
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn(Transaction $t) => [
                    'id' => $t->id,
                    'service' => $t->booking?->service?->name,
                    'amount' => $t->amount,
                    'status' => $t->status->label(),
                    'paid_at' => $t->paid_at?->toDateTimeString(),
                ]),
        ]);
    }
}
