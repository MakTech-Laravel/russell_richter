<?php

use App\Models\Admin;
use App\Models\Faq;

it('admin can view the faq management page', function () {
    $admin = Admin::factory()->create();
    Faq::factory()->count(3)->create();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.faqs.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/Faqs/Index')
            ->has('faqs', 3)
        );
});

it('admin can create a faq', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->post(route('admin.faqs.store'), [
            'question' => 'Do you come to my house?',
            'answer' => 'Yes, we come to your home, office, or job site.',
            'sort_order' => 5,
            'is_active' => '1',
        ])
        ->assertRedirect();

    expect(Faq::query()->where('question', 'Do you come to my house?')->exists())->toBeTrue();
});

it('admin can update a faq', function () {
    $admin = Admin::factory()->create();
    $faq = Faq::factory()->create(['question' => 'Old question?']);

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.faqs.update', $faq), [
            'question' => 'Updated question?',
            'answer' => 'Updated answer.',
        ])
        ->assertRedirect();

    expect($faq->fresh()->question)->toBe('Updated question?');
});

it('admin can delete a faq', function () {
    $admin = Admin::factory()->create();
    $faq = Faq::factory()->create();

    $this->actingAs($admin, 'admin')
        ->delete(route('admin.faqs.destroy', $faq))
        ->assertRedirect();

    expect(Faq::query()->find($faq->id))->toBeNull();
});

it('frontend home page serves active faqs from database', function () {
    Faq::factory()->create(['question' => 'Active FAQ?', 'is_active' => true, 'sort_order' => 1]);
    Faq::factory()->create(['question' => 'Inactive FAQ?', 'is_active' => false, 'sort_order' => 2]);

    $this->get(route('home'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('faqs', 1)
            ->where('faqs.0.question', 'Active FAQ?')
        );
});

it('faq requires question and answer', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->post(route('admin.faqs.store'), [])
        ->assertSessionHasErrors(['question', 'answer']);
});
