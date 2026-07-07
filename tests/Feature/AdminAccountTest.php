<?php

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

it('allows admin to view account settings page', function () {
    $admin = Admin::factory()->create([
        'name' => 'Admin User',
        'email' => 'admin@example.com',
    ]);

    $this->actingAs($admin, 'admin')
        ->get(route('admin.account.edit'))
        ->assertSuccessful()
        ->assertInertia(fn($page) => $page
            ->component('backend/Admin/Account/Edit')
            ->where('admin.name', 'Admin User')
            ->where('admin.email', 'admin@example.com'));
});

it('allows admin to update their profile', function () {
    $admin = Admin::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
    ]);

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.account.update'), [
            'name' => 'New Name',
            'email' => 'new@example.com',
        ])
        ->assertRedirect();

    $admin->refresh();

    expect($admin)
        ->name->toBe('New Name')
        ->email->toBe('new@example.com');
});

it('allows admin to update their password', function () {
    $admin = Admin::factory()->create([
        'password' => 'current-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->put(route('admin.account.password.update'), [
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ])
        ->assertRedirect();

    $admin->refresh();

    expect(Hash::check('new-secure-password', $admin->password))->toBeTrue();
});

it('requires password confirmation when updating admin password', function () {
    $admin = Admin::factory()->create([
        'password' => 'current-password',
    ]);

    $this->actingAs($admin, 'admin')
        ->put(route('admin.account.password.update'), [
            'password' => 'new-secure-password',
            'password_confirmation' => 'different-password',
        ])
        ->assertSessionHasErrors('password');

    $admin->refresh();

    expect(Hash::check('current-password', $admin->password))->toBeTrue();
});

it('requires guest admin to login for account pages', function () {
    $this->get(route('admin.account.edit'))
        ->assertRedirect(route('admin.login'));
});
