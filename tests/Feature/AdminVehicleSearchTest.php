<?php

use App\Models\Admin;
use App\Models\User;
use App\Models\Vehicle;

it('allows admin to search vehicles by vin', function () {
    $admin = Admin::factory()->create();
    $vehicle = Vehicle::factory()->create([
        'vin' => '1HGFM22915L950554',
        'make' => 'HONDA',
        'model' => 'Civic',
    ]);
    Vehicle::factory()->create([
        'vin' => 'OTHERVIN123456789',
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.vehicles.index', ['search' => '1HGFM22915L950554']))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Vehicles/Index')
            ->has('vehicles.data', 1)
            ->where('vehicles.data.0.vin', '1HGFM22915L950554')
            ->where('filters.search', '1HGFM22915L950554'));
});

it('allows admin to search vehicles by customer name', function () {
    $admin = Admin::factory()->create();
    $user = User::factory()->create(['name' => 'Keagan Hand MD']);
    $vehicle = Vehicle::factory()->for($user)->create();

    Vehicle::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.vehicles.index', ['search' => 'Keagan Hand']))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('vehicles.data', 1)
            ->where('vehicles.data.0.id', $vehicle->id)
            ->where('filters.search', 'Keagan Hand'));
});
