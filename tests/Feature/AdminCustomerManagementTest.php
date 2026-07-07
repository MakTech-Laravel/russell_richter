<?php

use App\Models\Admin;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

it('allows admin to update customer details', function () {
    $admin = Admin::factory()->create();
    $customer = User::factory()->create([
        'name' => 'John Doe',
        'phone' => '+1 555-0100',
    ]);

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.customers.update', $customer), [
            'name' => 'Jane Doe',
            'email' => $customer->email,
            'phone' => '+1 555-0199',
            'address_line' => '123 Main St',
            'city' => 'Austin',
            'state' => 'TX',
            'zip' => '78701',
        ])
        ->assertRedirect();

    $customer->refresh();

    expect($customer)
        ->name->toBe('Jane Doe')
        ->phone->toBe('+1 555-0199')
        ->address_line->toBe('123 Main St')
        ->city->toBe('Austin')
        ->state->toBe('TX')
        ->zip->toBe('78701');
});

it('allows admin to reset a customer password', function () {
    $admin = Admin::factory()->create();
    $customer = User::factory()->create();

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.customers.update', $customer), [
            'name' => $customer->name,
            'email' => $customer->email,
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ])
        ->assertRedirect();

    $customer->refresh();

    expect(Hash::check('new-password-123', $customer->password))->toBeTrue();
});

it('requires matching password confirmation when resetting a customer password', function () {
    $admin = Admin::factory()->create();
    $customer = User::factory()->create();
    $originalPassword = $customer->password;

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.customers.update', $customer), [
            'name' => $customer->name,
            'email' => $customer->email,
            'password' => 'new-password-123',
            'password_confirmation' => 'different-password',
        ])
        ->assertSessionHasErrors('password');

    $customer->refresh();

    expect($customer->password)->toBe($originalPassword);
});

it('allows admin to delete customers', function () {
    $admin = Admin::factory()->create();
    $customer = User::factory()->create();

    $this->actingAs($admin, 'admin')
        ->delete(route('admin.customers.destroy', $customer))
        ->assertRedirect(route('admin.customers.index'));

    expect(User::query()->find($customer->id))->toBeNull();
});

it('cascades customer deletion to related records', function () {
    $admin = Admin::factory()->create();
    $customer = User::factory()->create();
    $booking = Booking::factory()->create(['user_id' => $customer->id]);

    $this->actingAs($admin, 'admin')
        ->delete(route('admin.customers.destroy', $customer))
        ->assertRedirect();

    expect(Booking::query()->find($booking->id))->toBeNull();
});
