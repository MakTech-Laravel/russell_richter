<?php

use App\Enums\TransactionStatus;
use App\Models\Admin;
use App\Models\Booking;
use App\Models\Transaction;
use App\Models\User;

it('shows transaction details with invoice number for admins', function () {
    $admin = Admin::factory()->create();
    $booking = Booking::factory()->paid()->create();
    $transaction = Transaction::query()->create([
        'booking_id' => $booking->id,
        'user_id' => $booking->user_id,
        'amount' => $booking->total_price,
        'currency' => 'usd',
        'status' => TransactionStatus::Succeeded,
        'paid_at' => now(),
        'invoice_number' => 'ML-2026-00001',
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.transactions.show', $transaction))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Transactions/Show')
            ->where('transaction.invoice_number', 'ML-2026-00001')
            ->where('transaction.id', $transaction->id));
});

it('allows admins to delete test transactions', function () {
    $admin = Admin::factory()->create();
    $booking = Booking::factory()->create();
    $transaction = Transaction::query()->create([
        'booking_id' => $booking->id,
        'user_id' => $booking->user_id,
        'amount' => 120,
        'currency' => 'usd',
        'status' => TransactionStatus::Pending,
    ]);

    $this->actingAs($admin, 'admin')
        ->delete(route('admin.transactions.destroy', $transaction))
        ->assertRedirect(route('admin.transactions.index'));

    expect(Transaction::query()->find($transaction->id))->toBeNull();
});

it('lists invoice numbers on the transactions index', function () {
    $admin = Admin::factory()->create();
    $user = User::factory()->create();
    $booking = Booking::factory()->for($user)->create();

    Transaction::query()->create([
        'booking_id' => $booking->id,
        'user_id' => $user->id,
        'amount' => 99.00,
        'currency' => 'usd',
        'status' => TransactionStatus::Succeeded,
        'invoice_number' => 'ML-2026-00042',
        'paid_at' => now(),
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.transactions.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Transactions/Index')
            ->where('transactions.data.0.invoice_number', 'ML-2026-00042'));
});
