<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Technician;
use App\Services\RecommendationService;
use App\Support\BookingPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminBookingController extends Controller
{
    public function __construct(private RecommendationService $recommendationService) {}

    public function index(Request $request): Response
    {
        $bookings = Booking::query()
            ->with(['user', 'vehicle', 'service', 'technician'])
            ->when($request->string('status')->toString(), fn($q, $status) => $q->where('status', $status))
            ->latest('scheduled_at')
            ->paginate(15)
            ->through(fn(Booking $b) => [
                'id' => $b->id,
                'customer' => $b->user?->name,
                'customer_email' => $b->user?->email,
                'vehicle' => $b->vehicle?->display_name,
                'service' => $b->service?->name,
                'technician' => $b->technician?->name,
                'status' => $b->status->value,
                'status_label' => $b->status->label(),
                ...BookingPresenter::workMeta($b->status),
                'payment_status' => $b->payment_status->value,
                'payment_status_label' => $b->payment_status->label(),
                'scheduled_at' => $b->scheduled_at->toDateTimeString(),
                'total_price' => $b->total_price,
                'route_order' => $b->route_order,
            ]);

        return Inertia::render('backend/Admin/Bookings/Index', [
            'bookings' => $bookings,
            'filters' => ['status' => $request->string('status')->toString()],
            'statuses' => collect(BookingStatus::cases())->map(fn($s) => ['value' => $s->value, 'label' => $s->label()]),
            'technicians' => Technician::query()->where('is_active', true)->get(['id', 'name']),
        ]);
    }

    public function show(Booking $booking): Response
    {
        $booking->load(['user', 'vehicle', 'service', 'technician', 'recommendations']);

        return Inertia::render('backend/Admin/Bookings/Show', [
            'booking' => $this->transform($booking),
            'technicians' => Technician::query()->where('is_active', true)->get(['id', 'name']),
            'statuses' => collect(BookingStatus::cases())->map(fn($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function update(Request $request, Booking $booking): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::enum(BookingStatus::class)],
            'technician_id' => ['nullable', 'exists:technicians,id'],
            'technician_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        if ($validated['status'] === BookingStatus::Completed->value && ! $booking->completed_at) {
            $validated['completed_at'] = now();
        }

        $booking->update($validated);

        if ($booking->wasChanged('status') || $booking->wasChanged('technician_id')) {
            $this->recommendationService->generateForBooking($booking->fresh(['vehicle', 'service']));
        }

        return back()->with('success', 'Booking updated successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function transform(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'status' => $booking->status->value,
            'status_label' => $booking->status->label(),
            ...BookingPresenter::workMeta($booking->status),
            'payment_status' => $booking->payment_status->value,
            'payment_status_label' => $booking->payment_status->label(),
            'paid_at' => $booking->paid_at?->toDateTimeString(),
            'scheduled_at' => $booking->scheduled_at->toDateTimeString(),
            'completed_at' => $booking->completed_at?->toDateTimeString(),
            'service_address' => $booking->service_address,
            'service_city' => $booking->service_city,
            'service_state' => $booking->service_state,
            'service_zip' => $booking->service_zip,
            'latitude' => $booking->latitude,
            'longitude' => $booking->longitude,
            'total_price' => $booking->total_price,
            'customer_notes' => $booking->customer_notes,
            'technician_notes' => $booking->technician_notes,
            'route_order' => $booking->route_order,
            'customer' => $booking->user ? [
                'id' => $booking->user->id,
                'name' => $booking->user->name,
                'email' => $booking->user->email,
                'phone' => $booking->user->phone,
            ] : null,
            'vehicle' => $booking->vehicle ? [
                'id' => $booking->vehicle->id,
                'display_name' => $booking->vehicle->display_name,
                'vin' => $booking->vehicle->vin,
                'mileage' => $booking->vehicle->mileage,
            ] : null,
            'service' => $booking->service ? [
                'id' => $booking->service->id,
                'name' => $booking->service->name,
            ] : null,
            'technician' => $booking->technician ? [
                'id' => $booking->technician->id,
                'name' => $booking->technician->name,
            ] : null,
            'recommendations' => $booking->recommendations->map(fn($r) => [
                'part_type_label' => $r->part_type->label(),
                'part_name' => $r->part_name,
                'specification' => $r->specification,
                'quantity' => $r->quantity,
                'estimated_price' => $r->estimated_price,
                'notes' => $r->notes,
            ])->values(),
        ];
    }
}
