<?php

use App\Models\Admin;
use App\Models\Technician;

it('admin can create a technician with address', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->post(route('admin.technicians.store'), [
            'name' => 'John Tech',
            'email' => 'john@example.com',
            'phone' => '555-1234',
            'address' => '123 Main St',
            'city' => 'Houston',
            'state' => 'TX',
            'zip' => '77001',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertRedirect();

    $technician = Technician::query()->where('email', 'john@example.com')->firstOrFail();

    expect($technician->address)->toBe('123 Main St')
        ->and($technician->city)->toBe('Houston')
        ->and($technician->state)->toBe('TX')
        ->and($technician->zip)->toBe('77001');
});

it('admin can update a technician address', function () {
    $admin = Admin::factory()->create();
    $technician = Technician::factory()->create();

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.technicians.update', $technician), [
            'address' => '456 Oak Ave',
            'city' => 'Dallas',
            'state' => 'TX',
            'zip' => '75201',
        ])
        ->assertRedirect();

    expect($technician->fresh()->address)->toBe('456 Oak Ave')
        ->and($technician->fresh()->city)->toBe('Dallas')
        ->and($technician->fresh()->state)->toBe('TX')
        ->and($technician->fresh()->zip)->toBe('75201');
});

it('address fields are optional when creating a technician', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->post(route('admin.technicians.store'), [
            'name' => 'Jane Tech',
            'email' => 'jane@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertRedirect();

    $technician = Technician::query()->where('email', 'jane@example.com')->firstOrFail();

    expect($technician->address)->toBeNull()
        ->and($technician->city)->toBeNull()
        ->and($technician->state)->toBeNull()
        ->and($technician->zip)->toBeNull();
});

it('admin can view technician detail page', function () {
    $admin = Admin::factory()->create();
    $technician = Technician::factory()->create([
        'address' => '100 Tech Lane',
        'city' => 'San Antonio',
        'state' => 'TX',
        'zip' => '78201',
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.technicians.show', $technician))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Technicians/Show')
            ->where('technician.id', $technician->id)
            ->where('technician.address', '100 Tech Lane')
            ->where('technician.city', 'San Antonio')
            ->has('bookings')
        );
});

it('technician index includes address fields', function () {
    $admin = Admin::factory()->create();
    Technician::factory()->create([
        'address' => '789 Pine Rd',
        'city' => 'Austin',
        'state' => 'TX',
        'zip' => '78701',
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.technicians.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Technicians/Index')
            ->where('technicians.0.address', '789 Pine Rd')
            ->where('technicians.0.city', 'Austin')
            ->where('technicians.0.state', 'TX')
            ->where('technicians.0.zip', '78701')
        );
});
