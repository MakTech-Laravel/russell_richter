<?php

use App\Enums\BookingStatus;
use App\Enums\TransactionStatus;
use App\Models\Booking;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;

// ── Bookings Filter ─────────────────────────────────────────────────────────

it('bookings index returns all bookings without filter', function () {
    $user = User::factory()->create();
    Booking::factory()->for($user)->create(['status' => BookingStatus::Pending]);
    Booking::factory()->for($user)->create(['status' => BookingStatus::Completed]);

    $this->actingAs($user)
        ->get(route('bookings.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/User/Bookings/Index')
            ->has('bookings', 2)
            ->where('filters.status', null)
        );
});

it('bookings index filters by status', function () {
    $user = User::factory()->create();
    Booking::factory()->for($user)->create(['status' => BookingStatus::Pending]);
    Booking::factory()->for($user)->create(['status' => BookingStatus::Completed]);

    $this->actingAs($user)
        ->get(route('bookings.index', ['status' => 'pending']))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/User/Bookings/Index')
            ->has('bookings', 1)
            ->where('filters.status', 'pending')
            ->where('bookings.0.status', 'pending')
        );
});

it('bookings index ignores invalid status filter', function () {
    $user = User::factory()->create();
    Booking::factory()->for($user)->count(2)->create();

    $this->actingAs($user)
        ->get(route('bookings.index', ['status' => 'invalid_status']))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('bookings', 2)
        );
});

it('bookings index does not show other users bookings when filtered', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    Booking::factory()->for($user)->create(['status' => BookingStatus::Pending]);
    Booking::factory()->for($other)->create(['status' => BookingStatus::Pending]);

    $this->actingAs($user)
        ->get(route('bookings.index', ['status' => 'pending']))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->has('bookings', 1));
});

// ── Transactions Filter ──────────────────────────────────────────────────────

it('transactions index returns all transactions without filter', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->for($user)->create();

    Transaction::create([
        'booking_id' => $booking->id,
        'user_id' => $user->id,
        'amount' => 99.99,
        'currency' => 'usd',
        'status' => TransactionStatus::Succeeded,
    ]);
    Transaction::create([
        'booking_id' => $booking->id,
        'user_id' => $user->id,
        'amount' => 50.00,
        'currency' => 'usd',
        'status' => TransactionStatus::Pending,
    ]);

    $this->actingAs($user)
        ->get(route('transactions.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/User/Transactions/Index')
            ->where('transactions.total', 2)
            ->where('filters.status', null)
        );
});

it('transactions index filters by status', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->for($user)->create();

    Transaction::create([
        'booking_id' => $booking->id,
        'user_id' => $user->id,
        'amount' => 99.99,
        'currency' => 'usd',
        'status' => TransactionStatus::Succeeded,
    ]);
    Transaction::create([
        'booking_id' => $booking->id,
        'user_id' => $user->id,
        'amount' => 50.00,
        'currency' => 'usd',
        'status' => TransactionStatus::Pending,
    ]);

    $this->actingAs($user)
        ->get(route('transactions.index', ['status' => 'succeeded']))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->where('transactions.total', 1)
            ->where('filters.status', 'succeeded')
        );
});

// ── Service History Vehicle Filter ───────────────────────────────────────────

it('service history passes vehicles list to frontend', function () {
    $user = User::factory()->create();
    $vehicle = Vehicle::factory()->for($user)->create();
    Booking::factory()->for($user)->for($vehicle)->create(['status' => BookingStatus::Completed]);

    $this->actingAs($user)
        ->get(route('service-history.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/User/ServiceHistory/Index')
            ->has('vehicles', 1)
            ->where('filters.vehicle_id', null)
        );
});

it('service history filters by vehicle_id', function () {
    $user = User::factory()->create();
    $v1 = Vehicle::factory()->for($user)->create();
    $v2 = Vehicle::factory()->for($user)->create();

    Booking::factory()->for($user)->for($v1)->create(['status' => BookingStatus::Completed]);
    Booking::factory()->for($user)->for($v2)->create(['status' => BookingStatus::Completed]);

    $this->actingAs($user)
        ->get(route('service-history.index', ['vehicle_id' => $v1->id]))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('history', 1)
            ->where('filters.vehicle_id', $v1->id)
        );
});
