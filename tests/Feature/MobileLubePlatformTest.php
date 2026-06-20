<?php

use App\Enums\BookingStatus;
use App\Models\Admin;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Technician;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\RecommendationService;
use App\Services\StripeCheckoutService;
use Stripe\Checkout\Session;

use function Pest\Laravel\mock;

it('allows authenticated customers to access the dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertSuccessful()
        ->assertInertia(fn($page) => $page->component('backend/User/UserDashboard'));
});

it('allows customers to register vehicles and create bookings with recommendations', function () {
    $user = User::factory()->create();
    $service = Service::query()->first() ?? Service::factory()->create();

    $this->actingAs($user)->post(route('vehicles.store'), [
        'vin' => '1HGBH41JXMN109186',
        'mileage' => 45000,
        'decode_vin' => false,
        'year' => 2021,
        'make' => 'Honda',
        'model' => 'Accord',
    ])->assertRedirect(route('vehicles.index'));

    $vehicle = Vehicle::query()->where('user_id', $user->id)->first();

    expect($vehicle)->not->toBeNull();

    mock(StripeCheckoutService::class)
        ->shouldReceive('createCheckoutSession')
        ->once()
        ->andReturn(Session::constructFrom([
            'id' => 'cs_test_booking',
            'url' => 'https://checkout.stripe.com/booking',
        ]));

    $this->actingAs($user)->post(route('bookings.store'), [
        'vehicle_id' => $vehicle->id,
        'service_id' => $service->id,
        'scheduled_at' => now()->addDay()->format('Y-m-d H:i:s'),
        'service_address' => '123 Main St',
        'service_city' => 'Victoria',
        'service_state' => 'TX',
        'service_zip' => '77901',
    ])->assertRedirect('https://checkout.stripe.com/booking');

    $booking = Booking::query()->where('user_id', $user->id)->first();

    expect($booking)->not->toBeNull()
        ->and($booking->recommendations()->count())->toBe(4);
});

it('generates oil filter and wiper recommendations from vehicle data', function () {
    $vehicle = Vehicle::factory()->create([
        'year' => 2020,
        'make' => 'Toyota',
        'model' => 'Camry',
        'fuel_type' => 'Gasoline',
        'body_class' => 'Sedan',
    ]);

    $service = Service::factory()->create(['slug' => 'full-synthetic-oil-change']);
    $booking = Booking::factory()->create([
        'user_id' => $vehicle->user_id,
        'vehicle_id' => $vehicle->id,
        'service_id' => $service->id,
    ]);

    app(RecommendationService::class)->generateForBooking($booking);

    expect($booking->fresh('recommendations')->recommendations)->toHaveCount(4);
});

it('allows admins to manage bookings and assign technicians', function () {
    $admin = Admin::factory()->create();
    $technician = Technician::factory()->create();
    $booking = Booking::factory()->create(['status' => BookingStatus::Pending]);

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.bookings.update', $booking), [
            'status' => BookingStatus::Assigned->value,
            'technician_id' => $technician->id,
        ])
        ->assertRedirect();

    $booking->refresh();

    expect($booking->status)->toBe(BookingStatus::Assigned)
        ->and($booking->technician_id)->toBe($technician->id);
});

it('allows technicians to view assigned jobs', function () {
    $technician = Technician::factory()->create();
    Booking::factory()->create([
        'technician_id' => $technician->id,
        'status' => BookingStatus::Assigned,
    ]);

    $this->actingAs($technician, 'technician')
        ->get(route('technician.jobs.index'))
        ->assertSuccessful()
        ->assertInertia(fn($page) => $page->component('backend/Technician/Jobs/Index'));
});

it('shows completed bookings on customer service history', function () {
    $user = User::factory()->create();
    Booking::factory()->create([
        'user_id' => $user->id,
        'status' => BookingStatus::Completed,
        'completed_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('service-history.index'))
        ->assertSuccessful()
        ->assertInertia(fn($page) => $page
            ->component('backend/User/ServiceHistory/Index')
            ->has('history', 1));
});
