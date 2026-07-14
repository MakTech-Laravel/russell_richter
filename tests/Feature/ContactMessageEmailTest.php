<?php

use App\Mail\ContactMessageMail;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\Mail;

it('queues admin email when a contact inquiry is submitted', function () {
    Mail::fake();

    $this->post(route('contact-messages.store'), [
        'company_name' => 'Northside Logistics',
        'contact_name' => 'Jordan Smith',
        'email' => 'jordan@example.com',
        'phone' => '555-123-4567',
        'vehicle_count' => 12,
        'vehicle_types' => 'Vans and pickups',
        'message' => 'We need weekly fleet service for our delivery trucks.',
    ])->assertRedirect();

    expect(ContactMessage::query()->count())->toBe(1);

    Mail::assertQueued(ContactMessageMail::class, function (ContactMessageMail $mail): bool {
        return $mail->hasTo(config('mail.admin_address'))
            && $mail->contactMessage->contact_name === 'Jordan Smith';
    });
});
