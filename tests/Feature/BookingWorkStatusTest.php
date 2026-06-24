<?php

use App\Enums\BookingStatus;
use App\Models\Admin;
use App\Models\Booking;
use App\Models\User;
use App\Support\BookingPresenter;

it('includes work status in booking presenter summary', function () {
    $booking = Booking::factory()->create(['status' => BookingStatus::InProgress]);

    $summary = BookingPresenter::summary($booking->load(['vehicle', 'service', 'technician']));

    expect($summary)
        ->work_status_label->toBe('Work In Progress')
        ->work_progress_step->toBe(3)
        ->work_is_done->toBeFalse();
});

it('shows work status on customer booking detail page', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create([
        'user_id' => $user->id,
        'status' => BookingStatus::Assigned,
    ]);

    $this->actingAs($user)
        ->get(route('bookings.show', $booking))
        ->assertSuccessful()
        ->assertInertia(fn($page) => $page
            ->has('booking.work_status_label')
            ->where('booking.work_status_label', 'Technician Assigned')
            ->where('booking.work_progress_step', 2));
});

it('shows work status on admin booking detail page', function () {
    $admin = Admin::factory()->create();
    $booking = Booking::factory()->create(['status' => BookingStatus::Completed]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.bookings.show', $booking))
        ->assertSuccessful()
        ->assertInertia(fn($page) => $page
            ->where('booking.work_status_label', 'Work Completed')
            ->where('booking.work_is_done', true));
});

it('shows work status on customer dashboard upcoming bookings', function () {
    $user = User::factory()->create();
    Booking::factory()->create([
        'user_id' => $user->id,
        'status' => BookingStatus::InProgress,
        'scheduled_at' => now()->addDay(),
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertSuccessful()
        ->assertInertia(fn($page) => $page
            ->has('upcomingBookings', 1)
            ->where('upcomingBookings.0.work_status_label', 'Work In Progress'));
});
