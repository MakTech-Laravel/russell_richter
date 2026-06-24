<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminTransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $transactions = Transaction::query()
            ->with(['user:id,name,email', 'booking.service:id,name', 'booking'])
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Transaction $transaction) => [
                'id' => $transaction->id,
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
            ]);

        return Inertia::render('backend/Admin/Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }
}
