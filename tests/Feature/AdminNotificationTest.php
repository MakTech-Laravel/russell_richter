<?php

use App\Enums\TransactionStatus;
use App\Models\Admin;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\AdminNotifier;
use App\Services\GeocodingService;
use App\Services\StripeCheckoutService;
use Stripe\Checkout\Session;

use function Pest\Laravel\mock;

/**
 * @return array<string, mixed>
 */
function createTestTransaction(Booking $booking, TransactionStatus $status = TransactionStatus::Succeeded): Transaction
{
    return Transaction::query()->create([
        'booking_id' => $booking->id,
        'user_id' => $booking->user_id,
        'amount' => $booking->total_price,
        'currency' => 'usd',
        'status' => $status,
        'stripe_checkout_session_id' => 'cs_test_' . uniqid(),
        'paid_at' => $status === TransactionStatus::Succeeded ? now() : null,
    ]);
}

it('notifies all admins when a booking is created', function () {
    $admin = Admin::factory()->create();
    $booking = Booking::factory()->create();

    app(AdminNotifier::class)->bookingCreated($booking);

    expect($admin->fresh()->unreadNotifications)->toHaveCount(1)
        ->and($admin->unreadNotifications->first()->data['type'])->toBe('booking')
        ->and($admin->unreadNotifications->first()->data['url'])->toBe(route('admin.bookings.show', $booking));
});

it('notifies all admins when a transaction succeeds', function () {
    $admin = Admin::factory()->create();
    $transaction = createTestTransaction(Booking::factory()->create());

    app(AdminNotifier::class)->transactionSucceeded($transaction);

    expect($admin->fresh()->unreadNotifications)->toHaveCount(1)
        ->and($admin->unreadNotifications->first()->data['type'])->toBe('transaction');
});

it('returns admin notifications as json', function () {
    $admin = Admin::factory()->create();
    $booking = Booking::factory()->create();

    app(AdminNotifier::class)->bookingCreated($booking);

    $this->actingAs($admin, 'admin')
        ->getJson(route('admin.notifications.index'))
        ->assertSuccessful()
        ->assertJsonPath('unread_count', 1)
        ->assertJsonStructure([
            'notifications' => [
                [
                    'id',
                    'type',
                    'title',
                    'message',
                    'url',
                    'read_at',
                    'created_at',
                ],
            ],
            'unread_count',
        ]);
});

it('returns unread notification count only when requested', function () {
    $admin = Admin::factory()->create();

    app(AdminNotifier::class)->bookingCreated(Booking::factory()->create());

    $this->actingAs($admin, 'admin')
        ->getJson(route('admin.notifications.index', ['count_only' => 1]))
        ->assertSuccessful()
        ->assertExactJson(['unread_count' => 1]);
});

it('marks a notification as read', function () {
    $admin = Admin::factory()->create();
    app(AdminNotifier::class)->bookingCreated(Booking::factory()->create());

    $notification = $admin->fresh()->unreadNotifications->first();

    $this->actingAs($admin, 'admin')
        ->patchJson(route('admin.notifications.read', $notification->id))
        ->assertSuccessful()
        ->assertExactJson(['unread_count' => 0]);

    expect($notification->fresh()->read_at)->not->toBeNull();
});

it('marks all notifications as read', function () {
    $admin = Admin::factory()->create();
    $notifier = app(AdminNotifier::class);
    $booking = Booking::factory()->create();

    $notifier->bookingCreated($booking);
    $notifier->transactionSucceeded(createTestTransaction($booking));

    $this->actingAs($admin, 'admin')
        ->postJson(route('admin.notifications.read-all'))
        ->assertSuccessful()
        ->assertExactJson(['unread_count' => 0]);

    expect($admin->fresh()->unreadNotifications)->toHaveCount(0);
});

it('shares unread notification count with admin inertia pages', function () {
    $admin = Admin::factory()->create();
    app(AdminNotifier::class)->bookingCreated(Booking::factory()->create());

    $this->actingAs($admin, 'admin')
        ->get(route('admin.dashboard'))
        ->assertSuccessful()
        ->assertInertia(fn($page) => $page
            ->where('portal.unread_notifications', 1));
});

it('does not duplicate transaction notifications when payment is marked twice', function () {
    $admin = Admin::factory()->create();
    $booking = Booking::factory()->create();
    $session = Session::constructFrom([
        'id' => 'cs_test_duplicate',
        'payment_status' => 'paid',
        'payment_intent' => 'pi_test',
        'metadata' => ['booking_id' => (string) $booking->id],
    ]);

    Transaction::query()->create([
        'booking_id' => $booking->id,
        'user_id' => $booking->user_id,
        'amount' => $booking->total_price,
        'currency' => 'usd',
        'status' => TransactionStatus::Pending,
        'stripe_checkout_session_id' => 'cs_test_duplicate',
    ]);

    $service = app(StripeCheckoutService::class);
    $service->markBookingPaidFromSession($booking, $session);
    $service->markBookingPaidFromSession($booking->fresh(), $session);

    expect($admin->fresh()->unreadNotifications)->toHaveCount(1);
});

it('creates a booking notification when a customer books', function () {
    $admin = Admin::factory()->create();

    mock(GeocodingService::class)
        ->shouldReceive('geocodeAddress')
        ->andReturn([
            'latitude' => 28.8,
            'longitude' => -96.9,
        ]);

    mock(StripeCheckoutService::class)
        ->shouldReceive('createCheckoutSession')
        ->andReturn(Session::constructFrom([
            'id' => 'cs_test_booking',
            'url' => 'https://checkout.stripe.com/test',
        ]));

    $user = User::factory()->create();
    $vehicle = Vehicle::factory()->create(['user_id' => $user->id]);
    $service = Service::factory()->create(['service_type' => 'package', 'is_active' => true]);

    $this->actingAs($user)
        ->post(route('bookings.store'), [
            'vehicle_id' => $vehicle->id,
            'service_id' => $service->id,
            'scheduled_at' => now()->addDay()->format('Y-m-d H:i:s'),
            'service_address' => '123 Main St',
            'service_city' => 'Victoria',
            'service_state' => 'TX',
            'service_zip' => '77901',
            'mileage_at_service' => 45000,
        ])
        ->assertRedirect('https://checkout.stripe.com/test');

    expect($admin->fresh()->unreadNotifications)->toHaveCount(1);
});
