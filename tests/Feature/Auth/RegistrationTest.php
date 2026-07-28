<?php

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register with required contact details', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '(361) 555-0100',
        'address_line' => '123 Main St',
        'city' => 'Victoria',
        'state' => 'TX',
        'zip' => '77901',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'phone' => '(361) 555-0100',
        'address_line' => '123 Main St',
        'city' => 'Victoria',
        'state' => 'TX',
        'zip' => '77901',
    ]);
});

test('registration requires phone and address fields', function (string $field) {
    $payload = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '(361) 555-0100',
        'address_line' => '123 Main St',
        'city' => 'Victoria',
        'state' => 'TX',
        'zip' => '77901',
        'password' => 'password',
        'password_confirmation' => 'password',
    ];

    $payload[$field] = '';

    $this->post(route('register.store'), $payload)
        ->assertSessionHasErrors($field);

    $this->assertGuest();
})->with([
    'name',
    'email',
    'phone',
    'address_line',
    'city',
    'state',
    'zip',
]);

test('registration rejects state values longer than two characters', function () {
    $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'state-too-long@example.com',
        'phone' => '(361) 555-0100',
        'address_line' => '123 Main St',
        'city' => 'Victoria',
        'state' => 'Eiusmod impedit blanditiis qui quibusdam est cum',
        'zip' => '77901',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertSessionHasErrors('state');

    $this->assertGuest();
    $this->assertDatabaseMissing('users', ['email' => 'state-too-long@example.com']);
});
