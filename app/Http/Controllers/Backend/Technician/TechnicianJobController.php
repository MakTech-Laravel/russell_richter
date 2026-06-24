<?php

namespace App\Http\Controllers\Backend\Technician;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
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
            ->map(fn (Booking $booking) => $this->transformJob($booking));

        return Inertia::render('backend/Technician/Jobs/Index', [
            'technician' => [
                'name' => $technician->name,
                'email' => $technician->email,
            ],
            'jobs' => $jobs,
        ]);
    }

    public function history(Request $request): Response
    {
        $technician = Auth::guard('technician')->user();

        $history = $technician->bookings()
            ->with(['user', 'vehicle', 'service'])
            ->where('status', BookingStatus::Completed)
            ->latest('completed_at')
            ->latest('id')
            ->get()
            ->map(fn (Booking $booking) => [
                'id' => $booking->id,
                'route_key' => $booking->getRouteKey(),
                'customer' => $booking->user?->name,
                'vehicle' => $booking->vehicle?->display_name,
                'service' => $booking->service?->name,
                'completed_at' => $booking->completed_at?->toDateTimeString(),
                'scheduled_at' => $booking->scheduled_at->toDateTimeString(),
            ]);

        return Inertia::render('backend/Technician/Jobs/History', [
            'history' => $history,
        ]);
    }

    public function show(Request $request, Booking $booking): Response
    {
        $technician = Auth::guard('technician')->user();

        $job = $technician->bookings()
            ->with(['user', 'vehicle', 'service', 'recommendations'])
            ->findOrFail($booking->id);

        return Inertia::render('backend/Technician/Jobs/Show', [
            'job' => $this->transformJob($job, detailed: true),
        ]);
    }

    public function updateStatus(Request $request, Booking $booking): RedirectResponse
    {
        $technician = Auth::guard('technician')->user();

        $job = $technician->bookings()->findOrFail($booking->id);

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

    /**
     * @return array<string, mixed>
     */
    private function transformJob(Booking $booking, bool $detailed = false): array
    {
        $data = [
            'id' => $booking->id,
            'route_key' => $booking->getRouteKey(),
            'route_order' => $booking->route_order,
            'status' => $booking->status->value,
            'status_label' => $booking->status->label(),
            'scheduled_at' => $booking->scheduled_at->toDateTimeString(),
            'completed_at' => $booking->completed_at?->toDateTimeString(),
            'customer' => $booking->user?->name,
            'customer_email' => $booking->user?->email,
            'customer_phone' => $booking->user?->phone,
            'vehicle' => $booking->vehicle?->display_name,
            'vehicle_vin' => $booking->vehicle?->vin,
            'service' => $booking->service?->name,
            'address' => "{$booking->service_address}, {$booking->service_city}, {$booking->service_state} {$booking->service_zip}",
            'service_address' => $booking->service_address,
            'service_city' => $booking->service_city,
            'service_state' => $booking->service_state,
            'service_zip' => $booking->service_zip,
            'customer_notes' => $booking->customer_notes,
            'recommendations' => $booking->recommendations->map(fn ($r) => [
                'part_type_label' => $r->part_type->label(),
                'part_name' => $r->part_name,
                'specification' => $r->specification,
                'quantity' => $r->quantity,
                'estimated_price' => $r->estimated_price,
            ])->values(),
        ];

        if ($detailed) {
            $data['technician_notes'] = $booking->technician_notes;
            $data['mileage_at_service'] = $booking->mileage_at_service;
            $data['total_price'] = $booking->total_price;
        }

        return $data;
    }
}
