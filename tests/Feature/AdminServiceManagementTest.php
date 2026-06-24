<?php

use App\Enums\ServiceType;
use App\Enums\TransactionStatus;
use App\Models\Admin;
use App\Models\Booking;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\User;

it('allows admin to view and manage service packages', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.services.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Services/Index')
            ->has('services'));

    $this->actingAs($admin, 'admin')
        ->post(route('admin.services.store'), [
            'name' => 'Premium Package',
            'service_type' => ServiceType::Package->value,
            'base_price' => 149.99,
            'features' => "Feature one\nFeature two",
            'is_active' => true,
            'sort_order' => 99,
        ])
        ->assertRedirect();

    $service = Service::query()->where('slug', 'premium-package')->first();

    expect($service)
        ->not->toBeNull()
        ->base_price->toBe('149.99')
        ->features->toBe(['Feature one', 'Feature two']);
});

it('prevents admin from deleting services with bookings', function () {
    $admin = Admin::factory()->create();
    $service = Service::factory()->create();
    Booking::factory()->create(['service_id' => $service->id]);

    $this->actingAs($admin, 'admin')
        ->delete(route('admin.services.destroy', $service))
        ->assertRedirect();

    expect(Service::query()->find($service->id))->not->toBeNull();
});

it('allows admin to view transactions', function () {
    $admin = Admin::factory()->create();
    $booking = Booking::factory()->create();

    Transaction::query()->create([
        'booking_id' => $booking->id,
        'user_id' => $booking->user_id,
        'amount' => $booking->total_price,
        'currency' => 'usd',
        'status' => TransactionStatus::Succeeded,
        'paid_at' => now(),
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.transactions.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Transactions/Index')
            ->has('transactions.data', 1));
});

it('allows customers to view their transactions', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $user->id]);

    Transaction::query()->create([
        'booking_id' => $booking->id,
        'user_id' => $user->id,
        'amount' => $booking->total_price,
        'currency' => 'usd',
        'status' => TransactionStatus::Succeeded,
        'paid_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('transactions.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/User/Transactions/Index')
            ->has('transactions.data', 1));
});
