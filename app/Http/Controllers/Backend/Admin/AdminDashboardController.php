<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Enums\BookingStatus;
use App\Enums\TransactionStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Technician;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use App\Support\BookingPresenter;
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
                'total_revenue' => Transaction::query()->where('status', TransactionStatus::Succeeded)->sum('amount'),
            ],
            'recentBookings' => Booking::query()
                ->with(['user', 'vehicle', 'service'])
                ->latest()
                ->limit(8)
                ->get()
                ->map(fn(Booking $b) => [
                    'id' => $b->id,
                    'customer' => $b->user?->name,
                    'vehicle' => $b->vehicle?->display_name,
                    'service' => $b->service?->name,
                    'status' => $b->status->value,
                    'status_label' => $b->status->label(),
                    ...BookingPresenter::workMeta($b->status),
                    'scheduled_at' => $b->scheduled_at->toDateTimeString(),
                ]),
            'recentTransactions' => Transaction::query()
                ->with(['user:id,name', 'booking.service:id,name'])
                ->latest()
                ->limit(6)
                ->get()
                ->map(fn(Transaction $t) => [
                    'id' => $t->id,
                    'customer' => $t->user?->name,
                    'service' => $t->booking?->service?->name,
                    'amount' => $t->amount,
                    'status' => $t->status->label(),
                    'paid_at' => $t->paid_at?->toDateTimeString(),
                ]),
        ]);
    }
}
