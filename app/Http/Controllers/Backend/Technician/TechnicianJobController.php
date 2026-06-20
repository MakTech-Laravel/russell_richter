<?php

namespace App\Http\Controllers\Backend\Technician;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TechnicianJobController extends Controller
{
    public function index(Request $request): Response
    {
        $technician = Auth::guard('technician')->user();

        $jobs = $technician->bookings()
            ->with(['user', 'vehicle', 'service', 'recommendations'])
            ->whereNotIn('status', [BookingStatus::Cancelled, BookingStatus::Completed])
            ->orderBy('route_order')
            ->orderBy('scheduled_at')
            ->get()
            ->map(fn ($booking) => [
                'id' => $booking->id,
                'route_order' => $booking->route_order,
                'status' => $booking->status->label(),
                'scheduled_at' => $booking->scheduled_at->toDateTimeString(),
                'customer' => $booking->user?->name,
                'customer_phone' => $booking->user?->phone,
                'vehicle' => $booking->vehicle?->display_name,
                'service' => $booking->service?->name,
                'address' => "{$booking->service_address}, {$booking->service_city}, {$booking->service_state} {$booking->service_zip}",
                'customer_notes' => $booking->customer_notes,
                'recommendations' => $booking->recommendations->map(fn ($r) => [
                    'part_type_label' => $r->part_type->label(),
                    'part_name' => $r->part_name,
                    'specification' => $r->specification,
                ])->values(),
            ]);

        return Inertia::render('backend/Technician/Jobs/Index', [
            'technician' => [
                'name' => $technician->name,
                'email' => $technician->email,
            ],
            'jobs' => $jobs,
        ]);
    }

    public function updateStatus(Request $request, int $booking): RedirectResponse
    {
        $technician = Auth::guard('technician')->user();

        $job = $technician->bookings()->findOrFail($booking);

        $validated = $request->validate([
            'status' => ['required', 'in:in_progress,completed'],
            'technician_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $status = $validated['status'] === 'completed'
            ? BookingStatus::Completed
            : BookingStatus::InProgress;

        $job->update([
            'status' => $status,
            'technician_notes' => $validated['technician_notes'] ?? $job->technician_notes,
            'completed_at' => $status === BookingStatus::Completed ? now() : null,
        ]);

        return back()->with('success', 'Job status updated.');
    }
}
