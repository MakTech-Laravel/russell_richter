<?php

use App\Enums\PaymentStatus;
use App\Enums\TransactionStatus;
use App\Mail\BookingAdditionalPaymentMail;
use App\Mail\BookingPricingRefundMail;
use App\Models\Admin;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Transaction;
use App\Services\StripeCheckoutService;
use Illuminate\Support\Facades\Mail;
use Stripe\Checkout\Session;

use function Pest\Laravel\mock;

function paidBookingWithTransaction(array $bookingAttrs = [], float $paidAmount = 100): Booking
{
    $service = Service::factory()->create([
        'base_price' => $paidAmount,
        'included_quarts' => 5,
        'additional_quart_price' => 8,
    ]);

    $booking = Booking::factory()->paid()->create([
        'service_id' => $service->id,
        'total_price' => $paidAmount,
        'package_price' => $paidAmount,
        'stripe_payment_intent_id' => 'pi_test_paid_123',
        ...$bookingAttrs,
    ]);

    Transaction::query()->create([
        'booking_id' => $booking->id,
        'user_id' => $booking->user_id,
        'amount' => $paidAmount,
        'currency' => 'usd',
        'status' => TransactionStatus::Succeeded,
        'stripe_checkout_session_id' => 'cs_test_paid_123',
        'stripe_payment_intent_id' => 'pi_test_paid_123',
        'paid_at' => now(),
    ]);

    return $booking->fresh(['service', 'user', 'transactions']);
}

it('refunds the discount amount and emails the customer with the reason', function () {
    Mail::fake();

    $admin = Admin::factory()->create();
    $booking = paidBookingWithTransaction();

    mock(StripeCheckoutService::class)
        ->shouldReceive('refundAmount')
        ->once()
        ->withArgs(function (Booking $b, float $amount, string $reason) use ($booking) {
            expect($b->is($booking))->toBeTrue()
                ->and($amount)->toBe(10.0)
                ->and($reason)->toContain('10% discount');

            Transaction::query()->create([
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'amount' => $amount,
                'currency' => 'usd',
                'status' => TransactionStatus::Refunded,
                'stripe_payment_intent_id' => 'pi_test_paid_123',
                'stripe_checkout_session_id' => 're_test_123',
                'paid_at' => now(),
            ]);

            return true;
        })
        ->andReturn(Transaction::query()->make());

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.bookings.pricing.update', $booking), [
            'extra_quarts' => 0,
            'extra_charge_amount' => 0,
            'extra_charge_label' => null,
            'discount_percent' => 10,
            'service_address' => $booking->service_address,
            'service_city' => $booking->service_city,
            'service_state' => $booking->service_state,
            'service_zip' => $booking->service_zip,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $booking->refresh();

    expect($booking)
        ->total_price->toEqual(90.00)
        ->discount_percent->toEqual(10.00)
        ->discount_amount->toEqual(10.00)
        ->payment_status->toBe(PaymentStatus::Paid);

    Mail::assertQueued(BookingPricingRefundMail::class, function (BookingPricingRefundMail $mail) use ($booking) {
        return $mail->booking->is($booking)
            && $mail->refundAmount === 10.0
            && str_contains($mail->reason, '10% discount')
            && $mail->recipientRole === 'customer';
    });
});

it('emails a payment link when an extra charge increases a paid booking total', function () {
    Mail::fake();

    $admin = Admin::factory()->create();
    $booking = paidBookingWithTransaction();

    $session = Session::constructFrom([
        'id' => 'cs_test_balance_456',
        'url' => 'https://checkout.stripe.com/balance-test',
        'payment_status' => 'unpaid',
        'metadata' => [
            'booking_id' => (string) $booking->id,
            'is_balance_payment' => '1',
        ],
    ]);

    mock(StripeCheckoutService::class)
        ->shouldReceive('createCheckoutSession')
        ->once()
        ->withArgs(function (Booking $b, ?float $amount) use ($booking) {
            expect($b->is($booking))->toBeTrue()
                ->and($amount)->toBe(25.0);

            return true;
        })
        ->andReturn($session);

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.bookings.pricing.update', $booking), [
            'extra_quarts' => 0,
            'extra_charge_amount' => 25,
            'extra_charge_label' => 'Cabin filter',
            'discount_percent' => 0,
            'service_address' => $booking->service_address,
            'service_city' => $booking->service_city,
            'service_state' => $booking->service_state,
            'service_zip' => $booking->service_zip,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $booking->refresh();

    expect($booking)
        ->total_price->toEqual(125.00)
        ->extra_charge_amount->toEqual(25.00)
        ->payment_status->toBe(PaymentStatus::Unpaid);

    Mail::assertQueued(BookingAdditionalPaymentMail::class, function (BookingAdditionalPaymentMail $mail) use ($booking) {
        return $mail->booking->is($booking)
            && $mail->amountDue === 25.0
            && str_contains($mail->reason, 'Cabin filter')
            && $mail->checkoutUrl === 'https://checkout.stripe.com/balance-test'
            && $mail->recipientRole === 'customer';
    });
});

it('does not attempt stripe refunds for unpaid bookings', function () {
    Mail::fake();

    $admin = Admin::factory()->create();
    $service = Service::factory()->create([
        'base_price' => 100,
        'included_quarts' => 5,
        'additional_quart_price' => 8,
    ]);
    $booking = Booking::factory()->create([
        'service_id' => $service->id,
        'total_price' => 100,
        'package_price' => 100,
        'payment_status' => PaymentStatus::Unpaid,
    ]);

    $stripe = mock(StripeCheckoutService::class);
    $stripe->shouldNotReceive('refundAmount');
    $stripe->shouldNotReceive('createCheckoutSession');

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.bookings.pricing.update', $booking), [
            'extra_quarts' => 0,
            'extra_charge_amount' => 0,
            'discount_percent' => 10,
            'service_address' => $booking->service_address,
            'service_city' => $booking->service_city,
            'service_state' => $booking->service_state,
            'service_zip' => $booking->service_zip,
        ])
        ->assertRedirect();

    expect($booking->fresh()->total_price)->toEqual(90.00);

    Mail::assertNotQueued(BookingPricingRefundMail::class);
    Mail::assertNotQueued(BookingAdditionalPaymentMail::class);
});
