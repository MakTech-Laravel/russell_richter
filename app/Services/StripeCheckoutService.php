<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\TransactionStatus;
use App\Models\Booking;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Refund;
use Stripe\Stripe;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeCheckoutService
{
    public function __construct(
        private AdminNotifier $adminNotifier,
        private BookingMailNotifier $bookingMailNotifier,
    ) {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createCheckoutSession(Booking $booking, ?float $amount = null): Session
    {
        $booking->loadMissing(['user', 'service', 'vehicle']);

        if ($amount === null) {
            $netPaid = $booking->netPaidAmount();
            $amountDue = $booking->amountDue();
            $isBalancePayment = $netPaid > 0 && $amountDue > 0;
            $chargeAmount = $isBalancePayment
                ? $amountDue
                : round((float) $booking->total_price, 2);
        } else {
            $chargeAmount = round($amount, 2);
            $isBalancePayment = $booking->netPaidAmount() > 0;
        }

        $productName = $isBalancePayment
            ? 'Additional payment — ' . $booking->service->name
            : $booking->service->name;

        $productDescription = $isBalancePayment
            ? sprintf(
                'Balance due for mobile service on %s (%s)',
                $booking->scheduled_at->format('M j, Y g:i A'),
                $booking->vehicle->display_name,
            )
            : sprintf(
                'Mobile service for %s on %s',
                $booking->vehicle->display_name,
                $booking->scheduled_at->format('M j, Y g:i A'),
            );

        $session = Session::create([
            'mode' => 'payment',
            'customer_email' => $booking->user->email,
            'line_items' => [[
                'price_data' => [
                    'currency' => config('services.stripe.currency', 'usd'),
                    'unit_amount' => $this->amountInCents($chargeAmount),
                    'product_data' => [
                        'name' => $productName,
                        'description' => $productDescription,
                    ],
                ],
                'quantity' => 1,
            ]],
            'success_url' => route('bookings.payment.success', $booking) . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('bookings.payment.cancel', $booking),
            'metadata' => [
                'booking_id' => (string) $booking->id,
                'user_id' => (string) $booking->user_id,
                'charge_amount' => number_format($chargeAmount, 2, '.', ''),
                'is_balance_payment' => $isBalancePayment ? '1' : '0',
            ],
        ]);

        $booking->update([
            'stripe_checkout_session_id' => $session->id,
        ]);

        $this->upsertPendingTransaction($booking, $session, $chargeAmount);

        return $session;
    }

    /**
     * @throws ApiErrorException
     * @throws RuntimeException
     */
    public function refundAmount(Booking $booking, float $amount, string $reason): Transaction
    {
        $amount = round($amount, 2);

        if ($amount <= 0) {
            throw new RuntimeException('Refund amount must be greater than zero.');
        }

        $paymentIntentId = $this->resolvablePaymentIntentId($booking);

        if (! filled($paymentIntentId)) {
            throw new RuntimeException('No Stripe payment intent is available to refund for this booking.');
        }

        $refund = Refund::create([
            'payment_intent' => $paymentIntentId,
            'amount' => $this->amountInCents($amount),
            'reason' => 'requested_by_customer',
            'metadata' => [
                'booking_id' => (string) $booking->id,
                'adjustment_reason' => mb_substr($reason, 0, 450),
            ],
        ]);

        return Transaction::query()->create([
            'booking_id' => $booking->id,
            'user_id' => $booking->user_id,
            'amount' => $amount,
            'currency' => config('services.stripe.currency', 'usd'),
            'status' => TransactionStatus::Refunded,
            'stripe_payment_intent_id' => $paymentIntentId,
            'stripe_checkout_session_id' => $refund->id,
            'paid_at' => now(),
        ]);
    }

    public function retrieveCheckoutSession(string $sessionId): Session
    {
        return Session::retrieve($sessionId);
    }

    public function markBookingPaidFromSession(Booking $booking, Session $session): Booking
    {
        if ($this->sessionBelongsToBooking($booking, $session) && $session->payment_status === 'paid') {
            $paymentIntentId = is_string($session->payment_intent)
                ? $session->payment_intent
                : ($session->payment_intent->id ?? null);

            $booking->update([
                'payment_status' => PaymentStatus::Paid,
                'stripe_payment_intent_id' => $paymentIntentId,
                'paid_at' => now(),
                'status' => $booking->status === BookingStatus::Pending
                    ? BookingStatus::Confirmed
                    : $booking->status,
            ]);

            $this->markTransactionSucceeded($booking, $session, $paymentIntentId);
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

    private function resolvablePaymentIntentId(Booking $booking): ?string
    {
        if (filled($booking->stripe_payment_intent_id)) {
            return $booking->stripe_payment_intent_id;
        }

        return Transaction::query()
            ->where('booking_id', $booking->id)
            ->where('status', TransactionStatus::Succeeded)
            ->whereNotNull('stripe_payment_intent_id')
            ->latest('paid_at')
            ->value('stripe_payment_intent_id');
    }

    private function upsertPendingTransaction(Booking $booking, Session $session, float $chargeAmount): Transaction
    {
        return Transaction::query()->updateOrCreate(
            [
                'booking_id' => $booking->id,
                'stripe_checkout_session_id' => $session->id,
            ],
            [
                'user_id' => $booking->user_id,
                'amount' => $chargeAmount,
                'currency' => config('services.stripe.currency', 'usd'),
                'status' => TransactionStatus::Pending,
            ],
        );
    }

    private function markTransactionSucceeded(Booking $booking, Session $session, ?string $paymentIntentId): void
    {
        $shouldNotify = false;
        $isBalancePayment = ($session->metadata['is_balance_payment'] ?? '0') === '1';
        $chargeAmount = $this->sessionChargeAmount($booking, $session);

        DB::transaction(function () use ($booking, $session, $paymentIntentId, $chargeAmount, &$shouldNotify): void {
            $existing = Transaction::query()
                ->where('booking_id', $booking->id)
                ->where('stripe_checkout_session_id', $session->id)
                ->lockForUpdate()
                ->first();

            if ($existing?->status === TransactionStatus::Succeeded) {
                return;
            }

            Transaction::query()->updateOrCreate(
                [
                    'booking_id' => $booking->id,
                    'stripe_checkout_session_id' => $session->id,
                ],
                [
                    'user_id' => $booking->user_id,
                    'amount' => $chargeAmount,
                    'currency' => config('services.stripe.currency', 'usd'),
                    'status' => TransactionStatus::Succeeded,
                    'stripe_payment_intent_id' => $paymentIntentId,
                    'paid_at' => now(),
                ],
            );

            $shouldNotify = true;
        });

        if (! $shouldNotify) {
            return;
        }

        $transaction = Transaction::query()
            ->where('booking_id', $booking->id)
            ->where('stripe_checkout_session_id', $session->id)
            ->firstOrFail();

        $transaction->ensureInvoiceNumber();

        $this->adminNotifier->transactionSucceeded($transaction->fresh());

        $freshBooking = $booking->fresh(['user', 'service', 'vehicle', 'technician']);

        if ($isBalancePayment) {
            $this->bookingMailNotifier->bookingUpdated($freshBooking);

            return;
        }

        $this->bookingMailNotifier->bookingConfirmed($freshBooking);
    }

    private function sessionChargeAmount(Booking $booking, Session $session): float
    {
        if (isset($session->amount_total) && is_numeric($session->amount_total)) {
            return round(((int) $session->amount_total) / 100, 2);
        }

        $metadataAmount = $session->metadata['charge_amount'] ?? null;

        if (is_numeric($metadataAmount)) {
            return round((float) $metadataAmount, 2);
        }

        return round((float) $booking->total_price, 2);
    }

    private function amountInCents(float|string $amount): int
    {
        return (int) round(((float) $amount) * 100);
    }
}
