<?php

namespace App\Http\Controllers\Backend\User;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\StripeCheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use UnexpectedValueException;

class BookingPaymentController extends Controller
{
    public function __construct(private StripeCheckoutService $stripeCheckoutService) {}

    public function checkout(Request $request, Booking $booking): RedirectResponse
    {
        $this->authorize('view', $booking);

        if ($booking->payment_status === PaymentStatus::Paid) {
            return redirect()->route('bookings.show', $booking);
        }

        $session = $this->stripeCheckoutService->createCheckoutSession($booking);

        return redirect()->away($session->url);
    }

    public function success(Request $request, Booking $booking): RedirectResponse
    {
        $this->authorize('view', $booking);

        $sessionId = $request->string('session_id')->toString();

        if ($sessionId === '') {
            return redirect()->route('bookings.show', $booking)
                ->with('error', 'Payment session was not found.');
        }

        $session = $this->stripeCheckoutService->retrieveCheckoutSession($sessionId);

        if (! $this->stripeCheckoutService->sessionBelongsToBooking($booking, $session)) {
            abort(403);
        }

        $this->stripeCheckoutService->markBookingPaidFromSession($booking, $session);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Payment successful! Your booking is confirmed.');
    }

    public function cancel(Booking $booking): RedirectResponse
    {
        $this->authorize('view', $booking);

        return redirect()->route('bookings.show', $booking)
            ->with('error', 'Payment was cancelled. You can retry checkout anytime.');
    }

    public function webhook(Request $request): Response|SymfonyResponse
    {
        try {
            $result = $this->stripeCheckoutService->handleWebhookEvent(
                $request->getContent(),
                $request->header('Stripe-Signature'),
            );
        } catch (UnexpectedValueException) {
            return response('Invalid payload', 400);
        }

        return response($result['handled'] ? 'Webhook handled' : 'Ignored', 200);
    }
}
