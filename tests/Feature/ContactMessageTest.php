<?php

use App\Models\Admin;
use App\Models\ContactMessage;

it('stores a contact inquiry from the frontend', function () {
    $this->post(route('contact-messages.store'), [
        'company_name' => 'Northside Logistics',
        'contact_name' => 'Jordan Smith',
        'email' => 'jordan@example.com',
        'phone' => '555-123-4567',
        'vehicle_count' => 12,
        'vehicle_types' => 'Vans and pickups',
        'message' => 'We need weekly fleet service for our delivery trucks.',
    ])->assertRedirect();

    expect(ContactMessage::query()->count())->toBe(1)
        ->and(ContactMessage::query()->first())
        ->company_name->toBe('Northside Logistics');
});

it('shows contact inquiries to admins and marks them read on view', function () {
    $admin = Admin::factory()->create();
    $contactMessage = ContactMessage::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.contacts.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Contacts/Index')
            ->where('contactMessages.total', 1));

    $this->actingAs($admin, 'admin')
        ->get(route('admin.contacts.show', $contactMessage))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Contacts/Show')
            ->where('contactMessage.id', $contactMessage->id));

    expect($contactMessage->fresh()->read_at)->not->toBeNull();
});
