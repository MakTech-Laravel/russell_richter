<?php

it('uses America/Chicago as the application timezone', function () {
    expect(config('app.timezone'))->toBe('America/Chicago');
});
