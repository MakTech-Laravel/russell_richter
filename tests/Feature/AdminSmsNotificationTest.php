<?php

use App\Models\Booking;
use App\Models\User;
use App\Services\AdminNotifier;
use App\Services\SmsNotifier;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;

it('sends an admin sms when a booking is created and twilio is configured', function () {
    Notification::fake();
    Http::fake([
        'api.twilio.com/*' => Http::response(['sid' => 'SM123'], 201),
    ]);

    config([
        'services.twilio.sid' => 'ACtest',
        'services.twilio.token' => 'token',
        'services.twilio.from' => '+15551234567',
        'services.twilio.admin_phone' => '3615550199',
    ]);

    $user = User::factory()->create(['name' => 'Jane Driver', 'phone' => '3615550100']);
    $booking = Booking::factory()->for($user)->create();

    app(AdminNotifier::class)->bookingCreated($booking->load(['user', 'service', 'vehicle']));

    Http::assertSent(function ($request) use ($booking) {
        $body = (string) $request['Body'];

        return str_contains($request->url(), 'api.twilio.com')
            && $request['To'] === '+13615550199'
            && str_contains($body, 'New booking #'.$booking->id)
            && str_contains($body, 'Jane Driver');
    });
});

it('skips sms when twilio is not configured', function () {
    Http::fake();

    config([
        'services.twilio.sid' => null,
        'services.twilio.token' => null,
        'services.twilio.from' => null,
        'services.twilio.admin_phone' => null,
    ]);

    expect(app(SmsNotifier::class)->sendToAdmin('test'))->toBeFalse();
    Http::assertNothingSent();
});
