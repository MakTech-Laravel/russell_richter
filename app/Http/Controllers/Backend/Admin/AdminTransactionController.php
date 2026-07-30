<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminTransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $transactions = Transaction::query()
            ->with(['user:id,name,email,phone', 'booking.service:id,name', 'booking'])
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Transaction $transaction) => $this->summary($transaction));

        return Inertia::render('backend/Admin/Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }

    public function show(Transaction $transaction): Response
    {
        $transaction->load(['user:id,name,email,phone', 'booking.service:id,name', 'booking.vehicle', 'booking']);

        return Inertia::render('backend/Admin/Transactions/Show', [
            'transaction' => $this->details($transaction),
        ]);
    }

    public function destroy(Transaction $transaction): RedirectResponse
    {
        $transaction->delete();

        return redirect()
            ->route('admin.transactions.index')
            ->with('success', 'Transaction deleted successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(Transaction $transaction): array
    {
        return [
            'id' => $transaction->id,
            'invoice_number' => $transaction->invoice_number,
            'amount' => $transaction->amount,
            'currency' => strtoupper($transaction->currency),
            'status' => $transaction->status->value,
            'status_label' => $transaction->status->label(),
            'customer' => $transaction->user?->name,
            'customer_email' => $transaction->user?->email,
            'service' => $transaction->booking?->service?->name,
            'booking_id' => $transaction->booking_id,
            'booking_route_key' => $transaction->booking?->getRouteKey(),
            'stripe_payment_intent_id' => $transaction->stripe_payment_intent_id,
            'paid_at' => $transaction->paid_at?->toDateTimeString(),
            'created_at' => $transaction->created_at->toDateTimeString(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function details(Transaction $transaction): array
    {
        $booking = $transaction->booking;

        return [
            ...$this->summary($transaction),
            'customer_phone' => $transaction->user?->phone,
            'stripe_checkout_session_id' => $transaction->stripe_checkout_session_id,
            'booking' => $booking ? [
                'id' => $booking->id,
                'route_key' => $booking->getRouteKey(),
                'scheduled_at' => $booking->scheduled_at?->toDateTimeString(),
                'status' => $booking->status->value,
                'status_label' => $booking->status->label(),
                'payment_status' => $booking->payment_status->value,
                'payment_status_label' => $booking->payment_status->label(),
                'total_price' => $booking->total_price,
                'package_price' => $booking->package_price,
                'extra_quarts' => $booking->extra_quarts,
                'extra_quarts_amount' => $booking->extra_quarts_amount,
                'extra_charge_amount' => $booking->extra_charge_amount,
                'extra_charge_label' => $booking->extra_charge_label,
                'discount_percent' => $booking->discount_percent,
                'discount_amount' => $booking->discount_amount,
                'service_address' => $booking->service_address,
                'service_city' => $booking->service_city,
                'service_state' => $booking->service_state,
                'service_zip' => $booking->service_zip,
                'vehicle' => $booking->vehicle?->display_name,
            ] : null,
        ];
    }
}
