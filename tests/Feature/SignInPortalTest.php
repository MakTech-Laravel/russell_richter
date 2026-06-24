<?php

it('renders the sign-in portal selection page', function () {
    $this->get(route('sign-in'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('auth/portal-select'));
});

it('is accessible as a guest without redirect', function () {
    $this->get(route('sign-in'))->assertOk();
});

it('links customer login to fortify login route', function () {
    expect(route('login'))->toBe(url('/login'));
    expect(route('admin.login'))->toBe(url('/admin/login'));
    expect(route('technician.login'))->toBe(url('/technician/login'));
});
