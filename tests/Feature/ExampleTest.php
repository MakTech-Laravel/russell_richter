<?php

it('returns a successful response', function () {
    $response = $this->get('/');

    $response->assertSuccessful();
});

it('renders the mobile lube marketing homepage', function () {
    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertInertia(
        fn($page) => $page
            ->component('frontend/home')
    );
});

it('includes the mobile lube logo asset in the public directory', function () {
    expect(file_exists(public_path('images/mobile-lube-logo.png')))->toBeTrue();
});
