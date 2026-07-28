<?php

use App\Models\User;

it('allows customers to update their contact information', function () {
    $user = User::factory()->create([
        'phone' => '+1 555-0100',
        'address_line' => '100 Old St',
        'city' => 'Houston',
        'state' => 'TX',
        'zip' => '77001',
    ]);

    $this->actingAs($user)
        ->post(route('user-profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => '(361) 555-0199',
            'address_line' => '456 Service Rd',
            'city' => 'Victoria',
            'state' => 'TX',
            'zip' => '77901',
        ])
        ->assertRedirect(route('user-profile.edit'));

    $user->refresh();

    expect($user)
        ->phone->toBe('(361) 555-0199')
        ->address_line->toBe('456 Service Rd')
        ->city->toBe('Victoria')
        ->state->toBe('TX')
        ->zip->toBe('77901');
});

it('requires phone and address on the customer profile', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('user-profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => '',
            'address_line' => '',
            'city' => '',
            'state' => '',
            'zip' => '',
        ])
        ->assertSessionHasErrors(['phone', 'address_line', 'city', 'state', 'zip']);
});

it('shows contact fields on the customer profile page', function () {
    $user = User::factory()->create([
        'phone' => '(361) 555-0100',
        'address_line' => '123 Main St',
        'city' => 'Victoria',
        'state' => 'TX',
        'zip' => '77901',
    ]);

    $this->actingAs($user)
        ->get(route('user-profile.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Profile/Edit')
            ->where('user.phone', '(361) 555-0100')
            ->where('user.address_line', '123 Main St')
            ->where('user.city', 'Victoria')
            ->where('user.state', 'TX')
            ->where('user.zip', '77901'));
});
