<?php

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Models\Booking;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Stripe\Exception\ApiErrorException;

class BookingPriceAdjustmentService
{
    public function __construct(
        private StripeCheckoutService $stripeCheckoutService,
        private BookingMailNotifier $bookingMailNotifier,
    ) {}

    /**
     * After pricing fields are saved, refund overpayment or request the unpaid balance.
     *
     * @return array{
     *     action: 'none'|'refund'|'additional_payment'|'error',
     *     amount: float,
     *     message: string,
     *     reason: string|null,
     *     checkout_url: string|null
     * }
     */
    public function syncPaidBookingBalance(Booking $booking): array
    {
        $booking->loadMissing(['user', 'service', 'vehicle', 'transactions']);

        $netPaid = $booking->netPaidAmount();
        $newTotal = round((float) $booking->total_price, 2);
        $delta = round($newTotal - $netPaid, 2);

        if ($netPaid <= 0 || abs($delta) < 0.01) {
            return [
                'action' => 'none',
                'amount' => 0.0,
                'message' => 'Pricing updated for this customer only.',
                'reason' => null,
                'checkout_url' => null,
            ];
        }

        $reason = $this->buildAdjustmentReason($booking, $delta);

        if ($delta < 0) {
            return $this->issueRefund($booking, abs($delta), $reason, $newTotal);
        }

        return $this->requestAdditionalPayment($booking, $delta, $reason);
    }

    /**
     * @return array{
     *     action: 'refund'|'error',
     *     amount: float,
     *     message: string,
     *     reason: string|null,
     *     checkout_url: string|null
     * }
     */
    private function issueRefund(Booking $booking, float $refundAmount, string $reason, float $newTotal): array
    {
        try {
            $this->stripeCheckoutService->refundAmount($booking, $refundAmount, $reason);
        } catch (ApiErrorException | RuntimeException $exception) {
            Log::error('Booking pricing refund failed.', [
                'booking_id' => $booking->id,
                'amount' => $refundAmount,
                'error' => $exception->getMessage(),
            ]);

            return [
                'action' => 'error',
                'amount' => $refundAmount,
                'message' => 'Pricing was saved, but the Stripe refund failed: ' . $exception->getMessage(),
                'reason' => $reason,
                'checkout_url' => null,
            ];
        }

        $booking->update([
            'payment_status' => $newTotal <= 0.009
                ? PaymentStatus::Refunded
                : PaymentStatus::Paid,
        ]);

        $fresh = $booking->fresh(['user', 'service', 'vehicle', 'technician']);

        $this->bookingMailNotifier->pricingRefundIssued($fresh, $refundAmount, $reason);

        return [
            'action' => 'refund',
            'amount' => $refundAmount,
            'message' => sprintf(
                'Pricing updated. A $%s cashback refund was issued and the customer was emailed with the reason.',
                number_format($refundAmount, 2),
            ),
            'reason' => $reason,
            'checkout_url' => null,
        ];
    }

    /**
     * @return array{
     *     action: 'additional_payment'|'error',
     *     amount: float,
     *     message: string,
     *     reason: string|null,
     *     checkout_url: string|null
     * }
     */
    private function requestAdditionalPayment(Booking $booking, float $amountDue, string $reason): array
    {
        try {
            $session = $this->stripeCheckoutService->createCheckoutSession($booking, $amountDue);
        } catch (ApiErrorException | RuntimeException $exception) {
            Log::error('Booking additional payment checkout failed.', [
                'booking_id' => $booking->id,
                'amount' => $amountDue,
                'error' => $exception->getMessage(),
            ]);

            $booking->update([
                'payment_status' => PaymentStatus::Unpaid,
            ]);

            return [
                'action' => 'error',
                'amount' => $amountDue,
                'message' => 'Pricing was saved and marked unpaid, but creating the Stripe payment link failed: ' . $exception->getMessage(),
                'reason' => $reason,
                'checkout_url' => null,
            ];
        }

        $booking->update([
            'payment_status' => PaymentStatus::Unpaid,
        ]);

        $checkoutUrl = $session->url;
        $fresh = $booking->fresh(['user', 'service', 'vehicle', 'technician']);

        $this->bookingMailNotifier->additionalPaymentRequested($fresh, $amountDue, $reason, $checkoutUrl);

        return [
            'action' => 'additional_payment',
            'amount' => $amountDue,
            'message' => sprintf(
                'Pricing updated. The customer was emailed a payment link for the remaining $%s.',
                number_format($amountDue, 2),
            ),
            'reason' => $reason,
            'checkout_url' => $checkoutUrl,
        ];
    }

    private function buildAdjustmentReason(Booking $booking, float $delta): string
    {
        $parts = [];

        if ((float) $booking->discount_percent > 0 && $delta < 0) {
            $parts[] = sprintf(
                '%s%% discount applied (cashback $%s)',
                rtrim(rtrim(number_format((float) $booking->discount_percent, 2, '.', ''), '0'), '.'),
                number_format((float) $booking->discount_amount, 2),
            );
        }

        if ((float) $booking->extra_charge_amount > 0 && $delta > 0) {
            $label = filled($booking->extra_charge_label)
                ? $booking->extra_charge_label
                : 'Extra charge';
            $parts[] = sprintf(
                '%s ($%s)',
                $label,
                number_format((float) $booking->extra_charge_amount, 2),
            );
        }

        if ((int) $booking->extra_quarts > 0 && (float) $booking->extra_quarts_amount > 0 && $delta > 0) {
            $parts[] = sprintf(
                '%d extra quart(s) ($%s)',
                (int) $booking->extra_quarts,
                number_format((float) $booking->extra_quarts_amount, 2),
            );
        }

        if ($parts === []) {
            return $delta < 0
                ? sprintf('Booking total reduced — cashback refund of $%s', number_format(abs($delta), 2))
                : sprintf('Booking total increased — additional payment of $%s due', number_format($delta, 2));
        }

        return implode('; ', $parts);
    }
}
