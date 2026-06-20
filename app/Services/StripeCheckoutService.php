<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use Stripe\Checkout\Session;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Stripe;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeCheckoutService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createCheckoutSession(Booking $booking): Session
    {
        $booking->loadMissing(['user', 'service', 'vehicle']);

        $session = Session::create([
            'mode' => 'payment',
            'customer_email' => $booking->user->email,
            'line_items' => [[
                'price_data' => [
                    'currency' => config('services.stripe.currency', 'usd'),
                    'unit_amount' => $this->amountInCents($booking->total_price),
                    'product_data' => [
                        'name' => $booking->service->name,
                        'description' => sprintf(
                            'Mobile service for %s on %s',
                            $booking->vehicle->display_name,
                            $booking->scheduled_at->format('M j, Y g:i A')
                        ),
                    ],
                ],
                'quantity' => 1,
            ]],
            'success_url' => route('bookings.payment.success', $booking) . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('bookings.payment.cancel', $booking),
            'metadata' => [
                'booking_id' => (string) $booking->id,
                'user_id' => (string) $booking->user_id,
            ],
        ]);

        $booking->update([
            'stripe_checkout_session_id' => $session->id,
        ]);

        return $session;
    }

    public function retrieveCheckoutSession(string $sessionId): Session
    {
        return Session::retrieve($sessionId);
    }

    public function markBookingPaidFromSession(Booking $booking, Session $session): Booking
    {
        if ($this->sessionBelongsToBooking($booking, $session) && $session->payment_status === 'paid') {
            $booking->update([
                'payment_status' => PaymentStatus::Paid,
                'stripe_payment_intent_id' => is_string($session->payment_intent)
                    ? $session->payment_intent
                    : ($session->payment_intent->id ?? null),
                'paid_at' => now(),
                'status' => $booking->status === BookingStatus::Pending
                    ? BookingStatus::Confirmed
                    : $booking->status,
            ]);
        }

        return $booking->fresh();
    }

    /**
     * @return array{handled: bool, booking: Booking|null}
     */
    public function handleWebhookEvent(string $payload, ?string $signature): array
    {
        $webhookSecret = config('services.stripe.webhook_secret');

        if (empty($webhookSecret)) {
            return ['handled' => false, 'booking' => null];
        }

        try {
            $event = Webhook::constructEvent($payload, $signature ?? '', $webhookSecret);
        } catch (UnexpectedValueException | SignatureVerificationException) {
            throw new UnexpectedValueException('Invalid Stripe webhook payload.');
        }

        if ($event->type !== 'checkout.session.completed') {
            return ['handled' => false, 'booking' => null];
        }

        /** @var Session $session */
        $session = $event->data->object;
        $booking = Booking::query()->find($session->metadata['booking_id'] ?? null);

        if (! $booking) {
            return ['handled' => false, 'booking' => null];
        }

        return [
            'handled' => true,
            'booking' => $this->markBookingPaidFromSession($booking, $session),
        ];
    }

    public function sessionBelongsToBooking(Booking $booking, Session $session): bool
    {
        return (string) ($session->metadata['booking_id'] ?? '') === (string) $booking->id;
    }

    private function amountInCents(float|string $amount): int
    {
        return (int) round(((float) $amount) * 100);
    }
}
