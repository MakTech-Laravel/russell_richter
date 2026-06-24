<?php

use App\Models\Admin;
use App\Models\Booking;
use App\Models\Technician;

it('requires matching password confirmation when creating a technician', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->post(route('admin.technicians.store'), [
            'name' => 'Jane Tech',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different',
        ])
        ->assertSessionHasErrors('password');

    expect(Technician::query()->where('email', 'jane@example.com')->exists())->toBeFalse();
});

it('allows admin to view and manage technicians', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.technicians.index'))
        ->assertSuccessful()
        ->assertInertia(fn($page) => $page
            ->component('backend/Admin/Technicians/Index')
            ->has('technicians'));

    $this->actingAs($admin, 'admin')
        ->post(route('admin.technicians.store'), [
            'name' => 'Jane Tech',
            'email' => 'jane@example.com',
            'phone' => '+1 555-0100',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])
        ->assertRedirect();

    $technician = Technician::query()->where('email', 'jane@example.com')->first();

    expect($technician)
        ->not->toBeNull()
        ->name->toBe('Jane Tech')
        ->phone->toBe('+1 555-0100')
        ->is_active->toBeTrue();
});

it('allows admin to update technician details and deactivate', function () {
    $admin = Admin::factory()->create();
    $technician = Technician::factory()->create(['is_active' => true]);

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.technicians.update', $technician), [
            'name' => 'Updated Name',
            'email' => $technician->email,
            'phone' => '+1 555-0199',
            'is_active' => false,
        ])
        ->assertRedirect();

    $technician->refresh();

    expect($technician)
        ->name->toBe('Updated Name')
        ->phone->toBe('+1 555-0199')
        ->is_active->toBeFalse();
});

it('allows admin to delete technicians without bookings', function () {
    $admin = Admin::factory()->create();
    $technician = Technician::factory()->create();

    $this->actingAs($admin, 'admin')
        ->delete(route('admin.technicians.destroy', $technician))
        ->assertRedirect();

    expect(Technician::query()->find($technician->id))->toBeNull();
});

it('still allows deleting technicians with bookings from the backend', function () {
    $admin = Admin::factory()->create();
    $technician = Technician::factory()->create();
    Booking::factory()->create(['technician_id' => $technician->id]);

    $this->actingAs($admin, 'admin')
        ->delete(route('admin.technicians.destroy', $technician))
        ->assertRedirect();

    expect(Technician::query()->find($technician->id))->toBeNull();
});
