<?php

use App\Enums\BookingStatus;
use App\Models\Admin;
use App\Models\Booking;
use App\Models\Technician;
use App\Models\User;
use App\Models\Vehicle;

it('allows customers to save oil and filter preference notes when adding a vehicle', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('vehicles.store'), [
        'vin' => '1HGBH41JXMN109186',
        'mileage' => 45000,
        'decode_vin' => false,
        'year' => 2021,
        'make' => 'Honda',
        'model' => 'Accord',
        'oil_preference_notes' => 'Prefer Mobil 1 full synthetic only.',
    ])->assertRedirect(route('vehicles.index'));

    $vehicle = Vehicle::query()->where('user_id', $user->id)->first();

    expect($vehicle)->not->toBeNull()
        ->and($vehicle->oil_preference_notes)->toBe('Prefer Mobil 1 full synthetic only.');
});

it('allows customers to update oil and filter preference notes', function () {
    $user = User::factory()->create();
    $vehicle = Vehicle::factory()->for($user)->create([
        'oil_preference_notes' => 'Original preference',
    ]);

    $this->actingAs($user)->put(route('vehicles.update', $vehicle), [
        'oil_preference_notes' => 'Updated to Wix filter only.',
    ])->assertRedirect(route('vehicles.index'));

    expect($vehicle->fresh()->oil_preference_notes)->toBe('Updated to Wix filter only.');
});

it('shows vehicle oil preference notes to admins on booking details', function () {
    $vehicle = Vehicle::factory()->create([
        'oil_preference_notes' => 'Mobil 1 only please.',
    ]);
    $booking = Booking::factory()->create([
        'user_id' => $vehicle->user_id,
        'vehicle_id' => $vehicle->id,
    ]);

    $this->actingAs(Admin::factory()->create(), 'admin')
        ->get(route('admin.bookings.show', $booking))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Bookings/Show')
            ->where('booking.vehicle.oil_preference_notes', 'Mobil 1 only please.'));
});

it('shows vehicle oil preference notes to technicians on job details', function () {
    $technician = Technician::factory()->create();
    $vehicle = Vehicle::factory()->create([
        'oil_preference_notes' => 'Use OEM filter brand only.',
    ]);
    $booking = Booking::factory()->create([
        'user_id' => $vehicle->user_id,
        'vehicle_id' => $vehicle->id,
        'technician_id' => $technician->id,
        'status' => BookingStatus::Assigned,
    ]);

    $this->actingAs($technician, 'technician')
        ->get(route('technician.jobs.show', $booking))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Technician/Jobs/Show')
            ->where('job.vehicle_oil_preference_notes', 'Use OEM filter brand only.'));
});
