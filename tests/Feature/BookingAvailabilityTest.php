<?php

use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\BookingAvailabilityService;
use App\Services\StripeCheckoutService;
use Stripe\Checkout\Session;

use function Pest\Laravel\mock;

it('exposes available booking slots for a date', function () {
    $user = User::factory()->create();
    $date = nextBusinessDayAt(9)->toDateString();

    $this->actingAs($user)
        ->getJson(route('bookings.availability', ['date' => $date]))
        ->assertSuccessful()
        ->assertJsonStructure(['date', 'slots']);
});

it('removes booked slots from availability', function () {
    $slot = nextBusinessDayAt(9);
    $date = $slot->copy()->startOfDay();

    Booking::factory()->create([
        'scheduled_at' => $slot,
    ]);

    $availability = app(BookingAvailabilityService::class);

    expect($availability->isSlotAvailable($slot))->toBeFalse()
        ->and($availability->availableSlotsForDate($date))->not->toContain('09:00');
});

it('enforces a 30 minute buffer between appointments', function () {
    $date = nextBusinessDayAt(9)->copy()->startOfDay();
    $first = $date->copy()->setTime(9, 0);
    $tooSoon = $date->copy()->setTime(9, 30);
    $available = $date->copy()->setTime(10, 0);

    Booking::factory()->create([
        'scheduled_at' => $first,
    ]);

    $availability = app(BookingAvailabilityService::class);

    expect($availability->isSlotAvailable($tooSoon))->toBeFalse()
        ->and($availability->isSlotAvailable($available))->toBeTrue();
});

it('rejects booking a time slot that is already taken', function () {
    $user = User::factory()->create();
    $service = Service::query()->first() ?? Service::factory()->create();
    $vehicle = Vehicle::factory()->create(['user_id' => $user->id]);
    $scheduledAt = nextBusinessDayAt(11);

    Booking::factory()->create([
        'scheduled_at' => $scheduledAt,
    ]);

    $this->actingAs($user)->post(route('bookings.store'), [
        'vehicle_id' => $vehicle->id,
        'service_id' => $service->id,
        'scheduled_at' => $scheduledAt->format('Y-m-d H:i:s'),
        'service_address' => '123 Main St',
        'service_city' => 'Victoria',
        'service_state' => 'TX',
        'service_zip' => '77901',
    ])->assertSessionHasErrors('scheduled_at');
});

it('allows customers to book an open slot', function () {
    $user = User::factory()->create();
    $service = Service::query()->first() ?? Service::factory()->create();
    $vehicle = Vehicle::factory()->create(['user_id' => $user->id]);
    $scheduledAt = nextBusinessDayAt(14);

    mock(StripeCheckoutService::class)
        ->shouldReceive('createCheckoutSession')
        ->once()
        ->andReturn(Session::constructFrom([
            'id' => 'cs_test_open_slot',
            'url' => 'https://checkout.stripe.com/open-slot',
        ]));

    $this->actingAs($user)->post(route('bookings.store'), [
        'vehicle_id' => $vehicle->id,
        'service_id' => $service->id,
        'scheduled_at' => $scheduledAt->format('Y-m-d H:i:s'),
        'service_address' => '123 Main St',
        'service_city' => 'Victoria',
        'service_state' => 'TX',
        'service_zip' => '77901',
    ])->assertRedirect('https://checkout.stripe.com/open-slot');
});

it('ignores cancelled bookings when checking availability', function () {
    $slot = nextBusinessDayAt(13);
    $date = $slot->copy()->startOfDay();

    Booking::factory()->cancelled()->create([
        'scheduled_at' => $slot,
    ]);

    $availability = app(BookingAvailabilityService::class);

    expect($availability->isSlotAvailable($slot))->toBeTrue();
});
