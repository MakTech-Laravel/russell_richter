<?php

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Technician;

it('allows technicians to view completed job history', function () {
    $technician = Technician::factory()->create();
    Booking::factory()->create([
        'technician_id' => $technician->id,
        'status' => BookingStatus::Completed,
        'completed_at' => now(),
    ]);
    Booking::factory()->create([
        'technician_id' => $technician->id,
        'status' => BookingStatus::Assigned,
    ]);

    $this->actingAs($technician, 'technician')
        ->get(route('technician.jobs.history'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Technician/Jobs/History')
            ->has('history', 1));
});

it('allows technicians to view details for their completed jobs', function () {
    $technician = Technician::factory()->create();
    $booking = Booking::factory()->create([
        'technician_id' => $technician->id,
        'status' => BookingStatus::Completed,
        'completed_at' => now(),
        'technician_notes' => 'Oil filter replaced.',
    ]);

    $this->actingAs($technician, 'technician')
        ->get(route('technician.jobs.show', $booking))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Technician/Jobs/Show')
            ->where('job.id', $booking->id)
            ->where('job.technician_notes', 'Oil filter replaced.'));
});

it('prevents technicians from viewing jobs assigned to other technicians', function () {
    $technician = Technician::factory()->create();
    $otherTechnician = Technician::factory()->create();
    $booking = Booking::factory()->create([
        'technician_id' => $otherTechnician->id,
        'status' => BookingStatus::Completed,
        'completed_at' => now(),
    ]);

    $this->actingAs($technician, 'technician')
        ->get(route('technician.jobs.show', $booking))
        ->assertNotFound();
});

it('moves completed jobs from active list to history', function () {
    $technician = Technician::factory()->create();
    $booking = Booking::factory()->create([
        'technician_id' => $technician->id,
        'status' => BookingStatus::InProgress,
    ]);

    $this->actingAs($technician, 'technician')
        ->patch(route('technician.jobs.update', $booking), [
            'status' => 'completed',
            'technician_notes' => 'Service completed successfully.',
        ])
        ->assertRedirect();

    $booking->refresh();

    expect($booking->status)->toBe(BookingStatus::Completed);

    $this->actingAs($technician, 'technician')
        ->get(route('technician.jobs.index'))
        ->assertInertia(fn ($page) => $page->has('jobs', 0));

    $this->actingAs($technician, 'technician')
        ->get(route('technician.jobs.history'))
        ->assertInertia(fn ($page) => $page->has('history', 1));
});
