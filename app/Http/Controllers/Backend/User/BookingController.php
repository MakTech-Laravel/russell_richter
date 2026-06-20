<?php

namespace App\Http\Controllers\Backend\User;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Vehicle;
use App\Services\GeocodingService;
use App\Services\RecommendationService;
use App\Services\StripeCheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class BookingController extends Controller
{
    public function __construct(
        private RecommendationService $recommendationService,
        private GeocodingService $geocodingService,
        private StripeCheckoutService $stripeCheckoutService,
    ) {}

    public function index(Request $request): Response
    {
        $bookings = $request->user()
            ->bookings()
            ->with(['vehicle', 'service', 'technician', 'recommendations'])
            ->latest('scheduled_at')
            ->get()
            ->map(fn(Booking $booking) => $this->transformBooking($booking));

        return Inertia::render('backend/User/Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('backend/User/Bookings/Create', [
            'vehicles' => $request->user()->vehicles()->latest()->get()->map(fn(Vehicle $v) => [
                'id' => $v->id,
                'display_name' => $v->display_name,
                'vin' => $v->vin,
            ]),
            'services' => Service::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'base_price', 'slug']),
            'defaults' => [
                'service_address' => $request->user()->address_line,
                'service_city' => $request->user()->city ?? 'Victoria',
                'service_state' => $request->user()->state ?? 'TX',
                'service_zip' => $request->user()->zip,
            ],
        ]);
    }

    public function store(StoreBookingRequest $request): SymfonyResponse
    {
        $data = $request->validated();
        $service = Service::query()->findOrFail($data['service_id']);

        $coordinates = $this->geocodingService->geocodeAddress(
            $data['service_address'],
            $data['service_city'],
            $data['service_state'],
            $data['service_zip'],
        );

        $booking = $request->user()->bookings()->create([
            ...$data,
            ...$coordinates,
            'status' => BookingStatus::Pending,
            'total_price' => $service->base_price,
        ]);

        $this->recommendationService->generateForBooking($booking);

        $session = $this->stripeCheckoutService->createCheckoutSession($booking);

        return Inertia::location($session->url);
    }

    public function show(Booking $booking): Response
    {
        $this->authorize('view', $booking);
        $booking->load(['vehicle', 'service', 'technician', 'recommendations']);

        return Inertia::render('backend/User/Bookings/Show', [
            'booking' => $this->transformBooking($booking),
        ]);
    }

    public function edit(Booking $booking): Response
    {
        $this->authorize('update', $booking);

        return Inertia::render('backend/User/Bookings/Edit', [
            'booking' => $this->transformBooking($booking->load(['vehicle', 'service'])),
        ]);
    }

    public function update(UpdateBookingRequest $request, Booking $booking): RedirectResponse
    {
        $this->authorize('update', $booking);

        $booking->update($request->validated());

        if ($request->hasAny(['service_address', 'service_city', 'service_state', 'service_zip'])) {
            $coordinates = $this->geocodingService->geocodeAddress(
                $booking->service_address,
                $booking->service_city,
                $booking->service_state,
                $booking->service_zip,
            );
            $booking->update($coordinates);
        }

        return redirect()->route('bookings.show', $booking)->with('success', 'Booking updated successfully.');
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $this->authorize('delete', $booking);

        $booking->update(['status' => BookingStatus::Cancelled]);

        return redirect()->route('bookings.index')->with('success', 'Booking cancelled.');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformBooking(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'status' => $booking->status->value,
            'status_label' => $booking->status->label(),
            'payment_status' => $booking->payment_status->value,
            'payment_status_label' => $booking->payment_status->label(),
            'paid_at' => $booking->paid_at?->toDateTimeString(),
            'scheduled_at' => $booking->scheduled_at->toDateTimeString(),
            'completed_at' => $booking->completed_at?->toDateTimeString(),
            'service_address' => $booking->service_address,
            'service_city' => $booking->service_city,
            'service_state' => $booking->service_state,
            'service_zip' => $booking->service_zip,
            'mileage_at_service' => $booking->mileage_at_service,
            'total_price' => $booking->total_price,
            'customer_notes' => $booking->customer_notes,
            'technician_notes' => $booking->technician_notes,
            'route_order' => $booking->route_order,
            'vehicle' => $booking->vehicle ? [
                'id' => $booking->vehicle->id,
                'display_name' => $booking->vehicle->display_name,
                'vin' => $booking->vehicle->vin,
            ] : null,
            'service' => $booking->service ? [
                'id' => $booking->service->id,
                'name' => $booking->service->name,
            ] : null,
            'technician' => $booking->technician ? [
                'id' => $booking->technician->id,
                'name' => $booking->technician->name,
            ] : null,
            'recommendations' => $booking->recommendations->map(fn($rec) => [
                'id' => $rec->id,
                'part_type' => $rec->part_type->value,
                'part_type_label' => $rec->part_type->label(),
                'part_name' => $rec->part_name,
                'specification' => $rec->specification,
                'quantity' => $rec->quantity,
                'estimated_price' => $rec->estimated_price,
                'notes' => $rec->notes,
            ])->values(),
        ];
    }
}
