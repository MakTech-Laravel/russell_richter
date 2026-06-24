<?php

use App\Enums\TransactionStatus;
use App\Models\Admin;
use App\Models\Booking;
use App\Models\Transaction;
use App\Models\User;
use App\Services\StripeCheckoutService;
use Stripe\Checkout\Session;

it('marks transaction succeeded when booking payment completes', function () {
    $booking = Booking::factory()->create();
    $session = Session::constructFrom([
        'id' => 'cs_test_paid',
        'payment_status' => 'paid',
        'payment_intent' => 'pi_test_paid',
        'metadata' => ['booking_id' => (string) $booking->id],
    ]);

    Transaction::query()->create([
        'booking_id' => $booking->id,
        'user_id' => $booking->user_id,
        'amount' => $booking->total_price,
        'currency' => 'usd',
        'status' => TransactionStatus::Pending,
        'stripe_checkout_session_id' => 'cs_test_paid',
    ]);

    app(StripeCheckoutService::class)->markBookingPaidFromSession($booking, $session);

    $transaction = Transaction::query()->where('booking_id', $booking->id)->first();

    expect($transaction)
        ->status->toBe(TransactionStatus::Succeeded)
        ->stripe_payment_intent_id->toBe('pi_test_paid')
        ->paid_at->not->toBeNull();
});

it('creates a succeeded transaction when payment completes without a pending record', function () {
    $booking = Booking::factory()->create();
    $session = Session::constructFrom([
        'id' => 'cs_test_new',
        'payment_status' => 'paid',
        'payment_intent' => 'pi_test_new',
        'metadata' => ['booking_id' => (string) $booking->id],
    ]);

    app(StripeCheckoutService::class)->markBookingPaidFromSession($booking, $session);

    expect(Transaction::query()->where('booking_id', $booking->id)->first())
        ->status->toBe(TransactionStatus::Succeeded);
});

it('shows recent transactions on the customer dashboard', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $user->id]);

    Transaction::query()->create([
        'booking_id' => $booking->id,
        'user_id' => $user->id,
        'amount' => 120.00,
        'currency' => 'usd',
        'status' => TransactionStatus::Succeeded,
        'paid_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('recentTransactions', 1)
            ->where('stats.total_spent', 120));
});

it('shows recent transactions on the admin dashboard', function () {
    $admin = Admin::factory()->create();
    $booking = Booking::factory()->create();

    Transaction::query()->create([
        'booking_id' => $booking->id,
        'user_id' => $booking->user_id,
        'amount' => 99.00,
        'currency' => 'usd',
        'status' => TransactionStatus::Succeeded,
        'paid_at' => now(),
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.dashboard'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('recentTransactions', 1)
            ->where('stats.total_revenue', 99));
});
