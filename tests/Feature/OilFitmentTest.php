<?php

use App\Enums\RecommendationPartType;
use App\Models\Admin;
use App\Models\OilFitment;
use App\Models\Service;
use App\Models\Vehicle;
use App\Services\OilFitmentLookupService;
use App\Services\RecommendationService;

// ── Lookup Service ──────────────────────────────────────────────────────────

it('finds exact engine-specific fitment', function () {
    OilFitment::factory()->create([
        'make' => 'Ford', 'model' => 'F-150',
        'year_from' => 2015, 'year_to' => 2020,
        'engine' => '3.5L 6-Cylinder',
        'oil_filter_part_no' => 'FL-820-S',
        'oil_grade' => '5W-30',
        'oil_capacity_quarts' => 6.0,
    ]);

    $vehicle = Vehicle::factory()->make([
        'make' => 'Ford', 'model' => 'F-150', 'year' => 2018,
        'engine' => '3.5L 6-Cylinder',
    ]);

    $result = app(OilFitmentLookupService::class)->find($vehicle);

    expect($result)->not->toBeNull()
        ->and($result->oil_filter_part_no)->toBe('FL-820-S')
        ->and($result->oil_grade)->toBe('5W-30');
});

it('falls back to generic (null engine) row when engine does not match', function () {
    OilFitment::factory()->create([
        'make' => 'Honda', 'model' => 'Civic',
        'year_from' => 2016, 'year_to' => 2021,
        'engine' => null,
        'oil_filter_part_no' => '15400-PLM-A02',
        'oil_grade' => '0W-20',
        'oil_capacity_quarts' => 3.7,
    ]);

    $vehicle = Vehicle::factory()->make([
        'make' => 'Honda', 'model' => 'Civic', 'year' => 2019,
        'engine' => '1.5L 4-Cylinder',
    ]);

    $result = app(OilFitmentLookupService::class)->find($vehicle);

    expect($result)->not->toBeNull()
        ->and($result->oil_filter_part_no)->toBe('15400-PLM-A02');
});

it('normalizes make/model with dashes and spaces', function () {
    OilFitment::factory()->create([
        'make' => 'Ford', 'model' => 'F-150',
        'year_from' => 2015, 'year_to' => 2020,
        'engine' => null,
        'oil_filter_part_no' => 'FL-820-S',
        'oil_grade' => '5W-30',
        'oil_capacity_quarts' => 6.0,
    ]);

    // NHTSA may return "F 150" or "F150" — both should match "F-150"
    $vehicle = Vehicle::factory()->make([
        'make' => 'Ford', 'model' => 'F 150', 'year' => 2017, 'engine' => null,
    ]);

    $result = app(OilFitmentLookupService::class)->find($vehicle);

    expect($result)->not->toBeNull()
        ->and($result->oil_filter_part_no)->toBe('FL-820-S');
});

it('returns null when year is outside range', function () {
    OilFitment::factory()->create([
        'make' => 'Toyota', 'model' => 'Camry',
        'year_from' => 2018, 'year_to' => 2024,
        'engine' => null, 'oil_filter_part_no' => '04152-YZZA1',
        'oil_grade' => '0W-20', 'oil_capacity_quarts' => 4.8,
    ]);

    $vehicle = Vehicle::factory()->make([
        'make' => 'Toyota', 'model' => 'Camry', 'year' => 2010, 'engine' => null,
    ]);

    expect(app(OilFitmentLookupService::class)->find($vehicle))->toBeNull();
});

it('returns null when vehicle has no make/model/year', function () {
    $vehicle = Vehicle::factory()->make(['make' => null, 'model' => null, 'year' => null]);

    expect(app(OilFitmentLookupService::class)->find($vehicle))->toBeNull();
});

// ── Recommendation Service ──────────────────────────────────────────────────

it('generates oil filter with real part number when fitment record exists', function () {
    OilFitment::factory()->create([
        'make' => 'Toyota', 'model' => 'Camry',
        'year_from' => 2018, 'year_to' => 2024,
        'engine' => '2.5L 4-Cylinder',
        'oil_filter_part_no' => '04152-YZZA1',
        'oil_filter_brand' => 'Toyota OEM',
        'oil_grade' => '0W-20',
        'oil_capacity_quarts' => 4.8,
    ]);

    $vehicle = Vehicle::factory()->make([
        'make' => 'Toyota', 'model' => 'Camry', 'year' => 2021,
        'engine' => '2.5L 4-Cylinder', 'fuel_type' => 'Gasoline',
    ]);

    $service = Service::factory()->make(['slug' => 'full-synthetic-oil-change', 'base_price' => 120, 'included_quarts' => 6]);

    $recs = app(RecommendationService::class)->buildRecommendations($vehicle, $service);
    $filter = $recs->first(fn ($r) => $r['part_type'] === RecommendationPartType::OilFilter);

    expect($filter['part_number'])->toBe('04152-YZZA1')
        ->and($filter['part_name'])->toContain('Toyota OEM')
        ->and($filter['notes'])->toContain('OEM cross-reference');
});

it('oil recommendation uses fitment grade and capacity', function () {
    OilFitment::factory()->create([
        'make' => 'Honda', 'model' => 'Civic',
        'year_from' => 2016, 'year_to' => 2021,
        'engine' => null,
        'oil_filter_part_no' => '15400-PLM-A02',
        'oil_filter_brand' => 'Honda OEM',
        'oil_grade' => '0W-20',
        'oil_capacity_quarts' => 3.7,
    ]);

    $vehicle = Vehicle::factory()->make([
        'make' => 'Honda', 'model' => 'Civic', 'year' => 2019,
        'engine' => '1.5L 4-Cylinder', 'fuel_type' => 'Gasoline',
    ]);

    $service = Service::factory()->make(['slug' => 'full-synthetic-oil-change', 'base_price' => 120, 'included_quarts' => 6]);

    $recs = app(RecommendationService::class)->buildRecommendations($vehicle, $service);
    $oil = $recs->first(fn ($r) => $r['part_type'] === RecommendationPartType::Oil);

    expect($oil['specification'])->toBe('0W-20')
        ->and((float) $oil['quantity'])->toBe(3.7);
});

it('graceful fallback when no fitment record exists', function () {
    $vehicle = Vehicle::factory()->make([
        'make' => 'Ferrari', 'model' => '488', 'year' => 2020,
        'engine' => '3.9L V8', 'fuel_type' => 'Gasoline',
    ]);

    $service = Service::factory()->make(['slug' => 'full-synthetic-oil-change', 'base_price' => 120, 'included_quarts' => 6]);

    $recs = app(RecommendationService::class)->buildRecommendations($vehicle, $service);
    $filter = $recs->first(fn ($r) => $r['part_type'] === RecommendationPartType::OilFilter);

    expect($filter['part_number'])->toBeNull()
        ->and($filter['notes'])->toContain('Technician must verify');
});

// ── Admin CRUD ──────────────────────────────────────────────────────────────

it('admin can view oil fitments index', function () {
    $admin = Admin::factory()->create();
    OilFitment::factory()->count(3)->create();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.oil-fitments.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('backend/Admin/OilFitments/Index')
            ->has('fitments', 3)
        );
});

it('admin can create an oil fitment', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->post(route('admin.oil-fitments.store'), [
            'make' => 'BMW', 'model' => '3 Series',
            'year_from' => 2019, 'year_to' => 2023,
            'engine' => '2.0L 4-Cylinder',
            'oil_filter_part_no' => '11428575211',
            'oil_filter_brand' => 'BMW OEM',
            'oil_grade' => '0W-20',
            'oil_capacity_quarts' => 5.3,
            'supports_synthetic' => '1',
        ])
        ->assertRedirect();

    expect(OilFitment::query()->where('make', 'BMW')->exists())->toBeTrue();
});

it('admin can delete an oil fitment', function () {
    $admin = Admin::factory()->create();
    $fitment = OilFitment::factory()->create();

    $this->actingAs($admin, 'admin')
        ->delete(route('admin.oil-fitments.destroy', $fitment))
        ->assertRedirect();

    expect(OilFitment::query()->find($fitment->id))->toBeNull();
});
