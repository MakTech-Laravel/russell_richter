<?php

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\StripeCheckoutService;
use Stripe\Checkout\Session;

use function Pest\Laravel\mock;

function fakeStripeSession(string $id = 'cs_test_123', string $url = 'https://checkout.stripe.com/test'): Session
{
    $session = Session::constructFrom([
        'id' => $id,
        'url' => $url,
        'payment_status' => 'paid',
        'payment_intent' => 'pi_test_123',
        'metadata' => [],
    ]);

    return $session;
}

it('redirects to stripe checkout when creating a booking', function () {
    $user = User::factory()->create();
    $service = Service::query()->first() ?? Service::factory()->create();
    $vehicle = Vehicle::factory()->create(['user_id' => $user->id]);

    mock(StripeCheckoutService::class)
        ->shouldReceive('createCheckoutSession')
        ->once()
        ->andReturn(fakeStripeSession());

    $this->actingAs($user)->post(route('bookings.store'), [
        'vehicle_id' => $vehicle->id,
        'service_id' => $service->id,
        'scheduled_at' => nextBusinessDayAt(10)->format('Y-m-d H:i:s'),
        'service_address' => '123 Main St',
        'service_city' => 'Victoria',
        'service_state' => 'TX',
        'service_zip' => '77901',
    ])->assertRedirect('https://checkout.stripe.com/test');

    expect(Booking::query()->where('user_id', $user->id)->exists())->toBeTrue();
});

it('redirects unpaid bookings to stripe checkout on retry', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create([
        'user_id' => $user->id,
        'payment_status' => PaymentStatus::Unpaid,
    ]);

    mock(StripeCheckoutService::class)
        ->shouldReceive('createCheckoutSession')
        ->once()
        ->with(Mockery::on(fn(Booking $b) => $b->is($booking)))
        ->andReturn(fakeStripeSession('cs_test_retry', 'https://checkout.stripe.com/retry'));

    $this->actingAs($user)
        ->post(route('bookings.payment.checkout', $booking))
        ->assertRedirect('https://checkout.stripe.com/retry');
});

it('returns an inertia location response for stripe checkout from spa requests', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create([
        'user_id' => $user->id,
        'payment_status' => PaymentStatus::Unpaid,
    ]);

    mock(StripeCheckoutService::class)
        ->shouldReceive('createCheckoutSession')
        ->once()
        ->andReturn(fakeStripeSession('cs_test_inertia', 'https://checkout.stripe.com/inertia'));

    $this->actingAs($user)
        ->post(route('bookings.payment.checkout', $booking), [], [
            'X-Inertia' => 'true',
        ])
        ->assertStatus(409)
        ->assertHeader('X-Inertia-Location', 'https://checkout.stripe.com/inertia');
});

it('does not retry checkout for paid bookings', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create([
        'user_id' => $user->id,
        'payment_status' => PaymentStatus::Paid,
    ]);

    mock(StripeCheckoutService::class)->shouldNotReceive('createCheckoutSession');

    $this->actingAs($user)
        ->post(route('bookings.payment.checkout', $booking))
        ->assertRedirect(route('bookings.show', $booking));
});

it('marks booking paid after successful checkout return', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create([
        'user_id' => $user->id,
        'status' => BookingStatus::Pending,
        'payment_status' => PaymentStatus::Unpaid,
    ]);

    $session = fakeStripeSession('cs_test_success');
    $session->metadata = ['booking_id' => (string) $booking->id];

    $stripeMock = mock(StripeCheckoutService::class);
    $stripeMock->shouldReceive('retrieveCheckoutSession')
        ->once()
        ->with('cs_test_success')
        ->andReturn($session);
    $stripeMock->shouldReceive('sessionBelongsToBooking')
        ->once()
        ->andReturn(true);
    $stripeMock->shouldReceive('markBookingPaidFromSession')
        ->once()
        ->andReturnUsing(function (Booking $booking) {
            $booking->update([
                'payment_status' => PaymentStatus::Paid,
                'status' => BookingStatus::Confirmed,
                'paid_at' => now(),
            ]);

            return $booking->fresh();
        });

    $this->actingAs($user)
        ->get(route('bookings.payment.success', $booking) . '?session_id=cs_test_success')
        ->assertRedirect(route('bookings.show', $booking));

    expect($booking->fresh())
        ->payment_status->toBe(PaymentStatus::Paid)
        ->status->toBe(BookingStatus::Confirmed);
});

it('returns booking show page after cancelled payment', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('bookings.payment.cancel', $booking))
        ->assertRedirect(route('bookings.show', $booking));
});
