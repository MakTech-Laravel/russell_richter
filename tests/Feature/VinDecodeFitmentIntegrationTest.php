<?php

use App\Models\OilFitment;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\OilFitmentLookupService;
use App\Services\VinDecoderService;
use Database\Seeders\OilFitmentSeeder;

it('returns oil spec when decoding a lexus rx vin with matching fitment data', function () {
    OilFitment::factory()->create([
        'make' => 'Lexus',
        'model' => 'RX350',
        'year_from' => 2010,
        'year_to' => 2015,
        'engine' => '3.5L 6-Cylinder',
        'oil_filter_part_no' => '90915-YZZD4',
        'oil_filter_brand' => 'Lexus OEM',
        'oil_grade' => '0W-20',
        'oil_capacity_quarts' => 6.4,
    ]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('vin.decode'), ['vin' => '2T2BK1BA8CC346849'])
        ->assertSuccessful()
        ->assertJsonPath('success', true)
        ->assertJsonPath('oil_spec.oil_filter_part_no', '90915-YZZD4');
});

it('resolves lexus rx350 fitment from decoded nhtsa model and trim', function () {
    OilFitment::factory()->create([
        'make' => 'Lexus',
        'model' => 'RX350',
        'year_from' => 2010,
        'year_to' => 2015,
        'engine' => '3.5L 6-Cylinder',
        'oil_filter_part_no' => '90915-YZZD4',
        'oil_grade' => '0W-20',
        'oil_capacity_quarts' => 6.4,
    ]);

    $decoded = app(VinDecoderService::class)->decode('2T2BK1BA8CC346849');

    $vehicle = new Vehicle([
        'year' => $decoded['year'],
        'make' => $decoded['make'],
        'model' => $decoded['model'],
        'trim' => $decoded['trim'],
        'engine' => $decoded['engine'],
    ]);

    $fitment = app(OilFitmentLookupService::class)->find($vehicle);

    expect($fitment)->not->toBeNull()
        ->and($fitment->oil_filter_part_no)->toBe('90915-YZZD4');
})->group('integration');

it('seeded lexus rx350 fitment resolves from real vin decode', function () {
    $this->seed(OilFitmentSeeder::class);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('vin.decode'), ['vin' => '2T2BK1BA8CC346849'])
        ->assertSuccessful()
        ->assertJsonPath('oil_spec.oil_filter_part_no', '90915-YZZD4')
        ->assertJsonPath('oil_spec.oil_grade', '0W-20');
})->group('integration');
