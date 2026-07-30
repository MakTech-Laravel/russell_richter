<?php

use App\Models\Admin;
use App\Models\Booking;
use App\Models\Service;
use App\Services\BookingPricingService;

it('calculates extra quarts, charges, and discounts for one booking only', function () {
    $service = Service::factory()->create([
        'base_price' => 100,
        'included_quarts' => 6,
        'additional_quart_price' => 8,
    ]);

    $pricing = app(BookingPricingService::class)->calculate($service, [
        'extra_quarts' => 2,
        'extra_charge_amount' => 15,
        'extra_charge_label' => 'Cabin filter',
        'discount_percent' => 10,
    ]);

    expect($pricing)
        ->package_price->toBe(100.0)
        ->extra_quarts->toBe(2)
        ->extra_quarts_amount->toBe(16.0)
        ->extra_charge_amount->toBe(15.0)
        ->discount_percent->toBe(10.0)
        ->discount_amount->toBe(13.1)
        ->total_price->toBe(117.9);
});

it('allows admin to customize pricing on a single customer booking', function () {
    $admin = Admin::factory()->create();
    $service = Service::factory()->create([
        'base_price' => 120,
        'included_quarts' => 6,
        'additional_quart_price' => 10,
    ]);
    $booking = Booking::factory()->create([
        'service_id' => $service->id,
        'total_price' => 120,
        'package_price' => 120,
    ]);

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.bookings.pricing.update', $booking), [
            'extra_quarts' => 2,
            'extra_charge_amount' => 20,
            'extra_charge_label' => 'Extra oil capacity',
            'discount_percent' => 10,
            'service_address' => $booking->service_address,
            'service_city' => $booking->service_city,
            'service_state' => $booking->service_state,
            'service_zip' => $booking->service_zip,
        ])
        ->assertRedirect();

    $booking->refresh();

    expect($booking)
        ->extra_quarts->toBe(2)
        ->extra_quarts_amount->toEqual(20.00)
        ->extra_charge_amount->toEqual(20.00)
        ->extra_charge_label->toBe('Extra oil capacity')
        ->discount_percent->toEqual(10.00)
        ->total_price->toEqual(144.00);

    expect($service->fresh()->base_price)->toEqual(120.00);
});
