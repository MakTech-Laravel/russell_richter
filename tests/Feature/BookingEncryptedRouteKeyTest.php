<?php

use App\Models\Admin;
use App\Models\Booking;
use App\Models\Technician;
use App\Models\User;

it('generates stable encrypted route keys for bookings', function () {
    $booking = Booking::factory()->create();

    $routeKey = $booking->getRouteKey();

    expect($routeKey)
        ->not->toBe((string) $booking->id)
        ->and($routeKey)->toBe($booking->fresh()->getRouteKey())
        ->and(Booking::decryptRouteKey($routeKey))->toBe($booking->id);
});

it('resolves admin booking pages using encrypted route keys', function () {
    $admin = Admin::factory()->create();
    $booking = Booking::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.bookings.show', $booking))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Bookings/Show')
            ->where('booking.id', $booking->id));

    expect(route('admin.bookings.show', $booking))->not->toContain("/{$booking->id}");
});

it('rejects raw numeric booking ids in urls', function () {
    $admin = Admin::factory()->create();
    $booking = Booking::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get("/admin/bookings/{$booking->id}")
        ->assertNotFound();
});

it('resolves customer booking pages using encrypted route keys', function () {
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('bookings.show', $booking))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/User/Bookings/Show')
            ->where('booking.id', $booking->id));
});

it('resolves technician job pages using encrypted route keys', function () {
    $technician = Technician::factory()->create();
    $booking = Booking::factory()->create(['technician_id' => $technician->id]);

    $this->actingAs($technician, 'technician')
        ->get(route('technician.jobs.show', $booking))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Technician/Jobs/Show')
            ->where('job.id', $booking->id));
});
