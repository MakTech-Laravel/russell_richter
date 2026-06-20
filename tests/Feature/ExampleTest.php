<?php

it('returns a successful response', function () {
    $response = $this->get('/');

    $response->assertSuccessful();
});

it('renders the mobile lube marketing homepage', function () {
    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->component('frontend/home')
    );
});
