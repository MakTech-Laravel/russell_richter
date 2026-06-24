<?php

namespace App\Http\Controllers\Backend\User;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $transactions = $request->user()
            ->transactions()
            ->with(['booking.service:id,name', 'booking.vehicle:id,year,make,model', 'booking'])
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Transaction $transaction) => [
                'id' => $transaction->id,
                'amount' => $transaction->amount,
                'currency' => strtoupper($transaction->currency),
                'status' => $transaction->status->value,
                'status_label' => $transaction->status->label(),
                'service' => $transaction->booking?->service?->name,
                'vehicle' => $transaction->booking?->vehicle?->display_name,
                'booking_id' => $transaction->booking_id,
                'booking_route_key' => $transaction->booking?->getRouteKey(),
                'paid_at' => $transaction->paid_at?->toDateTimeString(),
                'created_at' => $transaction->created_at->toDateTimeString(),
            ]);

        return Inertia::render('backend/User/Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }
}
