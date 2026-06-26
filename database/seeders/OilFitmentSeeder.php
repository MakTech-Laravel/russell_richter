<?php

namespace Database\Seeders;

use App\Models\OilFitment;
use Illuminate\Database\Seeder;

class OilFitmentSeeder extends Seeder
{
    public function run(): void
    {
        $fitments = [
            // ─── Ford F-150 ────────────────────────────────────────────────
            ['make' => 'Ford', 'model' => 'F-150', 'year_from' => 2015, 'year_to' => 2020, 'engine' => '3.5L 6-Cylinder', 'oil_filter_part_no' => 'FL-820-S',  'oil_filter_brand' => 'Motorcraft', 'oil_grade' => '5W-30', 'oil_capacity_quarts' => 6.0],
            ['make' => 'Ford', 'model' => 'F-150', 'year_from' => 2015, 'year_to' => 2020, 'engine' => '5.0L 8-Cylinder', 'oil_filter_part_no' => 'FL-500-S',  'oil_filter_brand' => 'Motorcraft', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 6.0],
            ['make' => 'Ford', 'model' => 'F-150', 'year_from' => 2015, 'year_to' => 2020, 'engine' => '2.7L 6-Cylinder', 'oil_filter_part_no' => 'FL-820-S',  'oil_filter_brand' => 'Motorcraft', 'oil_grade' => '5W-30', 'oil_capacity_quarts' => 5.5],
            ['make' => 'Ford', 'model' => 'F-150', 'year_from' => 2021, 'year_to' => 2024, 'engine' => '3.5L 6-Cylinder', 'oil_filter_part_no' => 'FL-820-S',  'oil_filter_brand' => 'Motorcraft', 'oil_grade' => '5W-30', 'oil_capacity_quarts' => 6.0],
            ['make' => 'Ford', 'model' => 'F-150', 'year_from' => 2021, 'year_to' => 2024, 'engine' => '5.0L 8-Cylinder', 'oil_filter_part_no' => 'FL-500-S',  'oil_filter_brand' => 'Motorcraft', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 7.7],

            // ─── Ford F-250 / Super Duty ───────────────────────────────────
            ['make' => 'Ford', 'model' => 'F-250',       'year_from' => 2017, 'year_to' => 2024, 'engine' => '6.7L 8-Cylinder', 'oil_filter_part_no' => 'FL-2051-S', 'oil_filter_brand' => 'Motorcraft', 'oil_grade' => '10W-30', 'oil_capacity_quarts' => 13.0],
            ['make' => 'Ford', 'model' => 'F-250 Super Duty', 'year_from' => 2017, 'year_to' => 2024, 'engine' => '6.7L 8-Cylinder', 'oil_filter_part_no' => 'FL-2051-S', 'oil_filter_brand' => 'Motorcraft', 'oil_grade' => '10W-30', 'oil_capacity_quarts' => 13.0],
            ['make' => 'Ford', 'model' => 'F-250',       'year_from' => 2017, 'year_to' => 2024, 'engine' => '6.2L 8-Cylinder', 'oil_filter_part_no' => 'FL-820-S',  'oil_filter_brand' => 'Motorcraft', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 6.0],

            // ─── Ford Explorer ─────────────────────────────────────────────
            ['make' => 'Ford', 'model' => 'Explorer', 'year_from' => 2020, 'year_to' => 2024, 'engine' => null, 'oil_filter_part_no' => 'FL-500-S', 'oil_filter_brand' => 'Motorcraft', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 5.7],
            ['make' => 'Ford', 'model' => 'Explorer', 'year_from' => 2016, 'year_to' => 2019, 'engine' => null, 'oil_filter_part_no' => 'FL-500-S', 'oil_filter_brand' => 'Motorcraft', 'oil_grade' => '5W-30', 'oil_capacity_quarts' => 5.7],

            // ─── Ford Escape ───────────────────────────────────────────────
            ['make' => 'Ford', 'model' => 'Escape', 'year_from' => 2017, 'year_to' => 2019, 'engine' => null, 'oil_filter_part_no' => 'FL-500-S', 'oil_filter_brand' => 'Motorcraft', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 4.5],
            ['make' => 'Ford', 'model' => 'Escape', 'year_from' => 2020, 'year_to' => 2024, 'engine' => null, 'oil_filter_part_no' => 'FL-500-S', 'oil_filter_brand' => 'Motorcraft', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 4.5],

            // ─── Toyota Camry ──────────────────────────────────────────────
            ['make' => 'Toyota', 'model' => 'Camry', 'year_from' => 2015, 'year_to' => 2017, 'engine' => '2.5L 4-Cylinder', 'oil_filter_part_no' => '90915-YZZD1',  'oil_filter_brand' => 'Toyota OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 4.5],
            ['make' => 'Toyota', 'model' => 'Camry', 'year_from' => 2018, 'year_to' => 2024, 'engine' => '2.5L 4-Cylinder', 'oil_filter_part_no' => '04152-YZZA1',  'oil_filter_brand' => 'Toyota OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 4.8],
            ['make' => 'Toyota', 'model' => 'Camry', 'year_from' => 2015, 'year_to' => 2017, 'engine' => '3.5L 6-Cylinder', 'oil_filter_part_no' => '90915-YZZD4',  'oil_filter_brand' => 'Toyota OEM', 'oil_grade' => '5W-30', 'oil_capacity_quarts' => 6.4],
            ['make' => 'Toyota', 'model' => 'Camry', 'year_from' => 2018, 'year_to' => 2024, 'engine' => '3.5L 6-Cylinder', 'oil_filter_part_no' => '90915-YZZD4',  'oil_filter_brand' => 'Toyota OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 6.4],

            // ─── Toyota Corolla ────────────────────────────────────────────
            ['make' => 'Toyota', 'model' => 'Corolla', 'year_from' => 2014, 'year_to' => 2018, 'engine' => null, 'oil_filter_part_no' => '90915-YZZN1', 'oil_filter_brand' => 'Toyota OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 4.4],
            ['make' => 'Toyota', 'model' => 'Corolla', 'year_from' => 2019, 'year_to' => 2024, 'engine' => null, 'oil_filter_part_no' => '04152-YZZA1', 'oil_filter_brand' => 'Toyota OEM', 'oil_grade' => '0W-16', 'oil_capacity_quarts' => 4.4],

            // ─── Toyota Tacoma ─────────────────────────────────────────────
            ['make' => 'Toyota', 'model' => 'Tacoma', 'year_from' => 2016, 'year_to' => 2023, 'engine' => '3.5L 6-Cylinder', 'oil_filter_part_no' => '90915-YZZD4', 'oil_filter_brand' => 'Toyota OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 6.2],
            ['make' => 'Toyota', 'model' => 'Tacoma', 'year_from' => 2016, 'year_to' => 2023, 'engine' => '2.7L 4-Cylinder', 'oil_filter_part_no' => '04152-YZZA4', 'oil_filter_brand' => 'Toyota OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 5.5],

            // ─── Toyota Highlander ─────────────────────────────────────────
            ['make' => 'Toyota', 'model' => 'Highlander', 'year_from' => 2014, 'year_to' => 2019, 'engine' => '3.5L 6-Cylinder', 'oil_filter_part_no' => '90915-YZZD4', 'oil_filter_brand' => 'Toyota OEM', 'oil_grade' => '5W-30', 'oil_capacity_quarts' => 6.4],
            ['make' => 'Toyota', 'model' => 'Highlander', 'year_from' => 2020, 'year_to' => 2024, 'engine' => '3.5L 6-Cylinder', 'oil_filter_part_no' => '90915-YZZD4', 'oil_filter_brand' => 'Toyota OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 6.4],

            // ─── Honda Civic ───────────────────────────────────────────────
            ['make' => 'Honda', 'model' => 'Civic', 'year_from' => 2016, 'year_to' => 2021, 'engine' => null, 'oil_filter_part_no' => '15400-PLM-A02', 'oil_filter_brand' => 'Honda OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 3.7],
            ['make' => 'Honda', 'model' => 'Civic', 'year_from' => 2022, 'year_to' => 2024, 'engine' => null, 'oil_filter_part_no' => '15400-PLM-A02', 'oil_filter_brand' => 'Honda OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 3.7],

            // ─── Honda Accord ──────────────────────────────────────────────
            ['make' => 'Honda', 'model' => 'Accord', 'year_from' => 2018, 'year_to' => 2022, 'engine' => '1.5L 4-Cylinder', 'oil_filter_part_no' => '15400-PLM-A02', 'oil_filter_brand' => 'Honda OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 3.7],
            ['make' => 'Honda', 'model' => 'Accord', 'year_from' => 2018, 'year_to' => 2022, 'engine' => '2.0L 4-Cylinder', 'oil_filter_part_no' => '15400-RTA-003', 'oil_filter_brand' => 'Honda OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 5.7],
            ['make' => 'Honda', 'model' => 'Accord', 'year_from' => 2023, 'year_to' => 2024, 'engine' => null, 'oil_filter_part_no' => '15400-PLM-A02', 'oil_filter_brand' => 'Honda OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 3.7],

            // ─── Honda Pilot ───────────────────────────────────────────────
            ['make' => 'Honda', 'model' => 'Pilot', 'year_from' => 2016, 'year_to' => 2022, 'engine' => null, 'oil_filter_part_no' => '15400-RTA-003', 'oil_filter_brand' => 'Honda OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 5.7],

            // ─── Chevrolet Silverado 1500 ──────────────────────────────────
            ['make' => 'Chevrolet', 'model' => 'Silverado 1500', 'year_from' => 2014, 'year_to' => 2018, 'engine' => '5.3L 8-Cylinder', 'oil_filter_part_no' => 'PF63E', 'oil_filter_brand' => 'ACDelco', 'oil_grade' => '5W-30', 'oil_capacity_quarts' => 6.0],
            ['make' => 'Chevrolet', 'model' => 'Silverado 1500', 'year_from' => 2019, 'year_to' => 2024, 'engine' => '5.3L 8-Cylinder', 'oil_filter_part_no' => 'PF63E', 'oil_filter_brand' => 'ACDelco', 'oil_grade' => '5W-30', 'oil_capacity_quarts' => 6.0],
            ['make' => 'Chevrolet', 'model' => 'Silverado 1500', 'year_from' => 2019, 'year_to' => 2024, 'engine' => '6.2L 8-Cylinder', 'oil_filter_part_no' => 'PF63E', 'oil_filter_brand' => 'ACDelco', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 8.0],

            // ─── GMC Sierra 1500 ───────────────────────────────────────────
            ['make' => 'GMC', 'model' => 'Sierra 1500', 'year_from' => 2014, 'year_to' => 2018, 'engine' => '5.3L 8-Cylinder', 'oil_filter_part_no' => 'PF63E', 'oil_filter_brand' => 'ACDelco', 'oil_grade' => '5W-30', 'oil_capacity_quarts' => 6.0],
            ['make' => 'GMC', 'model' => 'Sierra 1500', 'year_from' => 2019, 'year_to' => 2024, 'engine' => '5.3L 8-Cylinder', 'oil_filter_part_no' => 'PF63E', 'oil_filter_brand' => 'ACDelco', 'oil_grade' => '5W-30', 'oil_capacity_quarts' => 6.0],

            // ─── Chevrolet Equinox ─────────────────────────────────────────
            ['make' => 'Chevrolet', 'model' => 'Equinox', 'year_from' => 2018, 'year_to' => 2024, 'engine' => null, 'oil_filter_part_no' => 'PF63E', 'oil_filter_brand' => 'ACDelco', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 4.2],

            // ─── RAM 1500 ──────────────────────────────────────────────────
            ['make' => 'Ram', 'model' => '1500', 'year_from' => 2019, 'year_to' => 2024, 'engine' => '5.7L 8-Cylinder', 'oil_filter_part_no' => 'MO388',  'oil_filter_brand' => 'Mopar', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 7.0],
            ['make' => 'Ram', 'model' => '1500', 'year_from' => 2019, 'year_to' => 2024, 'engine' => '3.6L 6-Cylinder', 'oil_filter_part_no' => 'MO090',  'oil_filter_brand' => 'Mopar', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 5.0],
            ['make' => 'Ram', 'model' => '1500', 'year_from' => 2014, 'year_to' => 2018, 'engine' => '5.7L 8-Cylinder', 'oil_filter_part_no' => 'MO388',  'oil_filter_brand' => 'Mopar', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 7.0],

            // ─── RAM 2500 (Diesel) ─────────────────────────────────────────
            ['make' => 'Ram', 'model' => '2500', 'year_from' => 2019, 'year_to' => 2024, 'engine' => '6.7L 6-Cylinder', 'oil_filter_part_no' => 'MO999', 'oil_filter_brand' => 'Mopar', 'oil_grade' => '10W-30', 'oil_capacity_quarts' => 12.0, 'supports_synthetic' => false],

            // ─── Jeep Wrangler ─────────────────────────────────────────────
            ['make' => 'Jeep', 'model' => 'Wrangler', 'year_from' => 2018, 'year_to' => 2023, 'engine' => '3.6L 6-Cylinder', 'oil_filter_part_no' => 'MO090', 'oil_filter_brand' => 'Mopar', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 5.0],
            ['make' => 'Jeep', 'model' => 'Wrangler', 'year_from' => 2018, 'year_to' => 2023, 'engine' => '2.0L 4-Cylinder', 'oil_filter_part_no' => 'MO090', 'oil_filter_brand' => 'Mopar', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 5.5],

            // ─── Jeep Grand Cherokee ───────────────────────────────────────
            ['make' => 'Jeep', 'model' => 'Grand Cherokee', 'year_from' => 2014, 'year_to' => 2021, 'engine' => '3.6L 6-Cylinder', 'oil_filter_part_no' => 'MO090', 'oil_filter_brand' => 'Mopar', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 5.9],
            ['make' => 'Jeep', 'model' => 'Grand Cherokee', 'year_from' => 2014, 'year_to' => 2021, 'engine' => '5.7L 8-Cylinder', 'oil_filter_part_no' => 'MO388', 'oil_filter_brand' => 'Mopar', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 7.0],

            // ─── Dodge Charger ─────────────────────────────────────────────
            ['make' => 'Dodge', 'model' => 'Charger', 'year_from' => 2015, 'year_to' => 2023, 'engine' => '3.6L 6-Cylinder', 'oil_filter_part_no' => 'MO090', 'oil_filter_brand' => 'Mopar', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 5.9],
            ['make' => 'Dodge', 'model' => 'Charger', 'year_from' => 2015, 'year_to' => 2023, 'engine' => '5.7L 8-Cylinder', 'oil_filter_part_no' => 'MO388', 'oil_filter_brand' => 'Mopar', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 7.0],

            // ─── Nissan Altima ─────────────────────────────────────────────
            ['make' => 'Nissan', 'model' => 'Altima', 'year_from' => 2019, 'year_to' => 2024, 'engine' => '2.5L 4-Cylinder', 'oil_filter_part_no' => '15208-65F0A', 'oil_filter_brand' => 'Nissan OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 4.2],
            ['make' => 'Nissan', 'model' => 'Altima', 'year_from' => 2015, 'year_to' => 2018, 'engine' => '2.5L 4-Cylinder', 'oil_filter_part_no' => '15208-65F0A', 'oil_filter_brand' => 'Nissan OEM', 'oil_grade' => '5W-30', 'oil_capacity_quarts' => 4.2],

            // ─── Nissan Frontier ───────────────────────────────────────────
            ['make' => 'Nissan', 'model' => 'Frontier', 'year_from' => 2016, 'year_to' => 2021, 'engine' => '4.0L 6-Cylinder', 'oil_filter_part_no' => '15208-31U01', 'oil_filter_brand' => 'Nissan OEM', 'oil_grade' => '5W-30', 'oil_capacity_quarts' => 5.4],

            // ─── Hyundai Elantra ───────────────────────────────────────────
            ['make' => 'Hyundai', 'model' => 'Elantra', 'year_from' => 2017, 'year_to' => 2021, 'engine' => null, 'oil_filter_part_no' => '26300-35504', 'oil_filter_brand' => 'Hyundai OEM', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 4.2],

            // ─── Hyundai Tucson ────────────────────────────────────────────
            ['make' => 'Hyundai', 'model' => 'Tucson', 'year_from' => 2016, 'year_to' => 2021, 'engine' => null, 'oil_filter_part_no' => '26300-35504', 'oil_filter_brand' => 'Hyundai OEM', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 4.9],

            // ─── Kia Sorento ───────────────────────────────────────────────
            ['make' => 'Kia', 'model' => 'Sorento', 'year_from' => 2016, 'year_to' => 2021, 'engine' => null, 'oil_filter_part_no' => '26300-35504', 'oil_filter_brand' => 'Kia OEM', 'oil_grade' => '5W-20', 'oil_capacity_quarts' => 4.9],

            // ─── Subaru Outback ────────────────────────────────────────────
            ['make' => 'Subaru', 'model' => 'Outback', 'year_from' => 2015, 'year_to' => 2019, 'engine' => '2.5L 4-Cylinder', 'oil_filter_part_no' => '15208AA100', 'oil_filter_brand' => 'Subaru OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 5.1],
            ['make' => 'Subaru', 'model' => 'Outback', 'year_from' => 2020, 'year_to' => 2024, 'engine' => '2.5L 4-Cylinder', 'oil_filter_part_no' => '15208AA170', 'oil_filter_brand' => 'Subaru OEM', 'oil_grade' => '0W-20', 'oil_capacity_quarts' => 5.1],
        ];

        foreach ($fitments as $row) {
            OilFitment::query()->updateOrCreate(
                [
                    'make' => $row['make'],
                    'model' => $row['model'],
                    'year_from' => $row['year_from'],
                    'year_to' => $row['year_to'],
                    'engine' => $row['engine'] ?? null,
                ],
                array_merge(['supports_synthetic' => true], $row),
            );
        }
    }
}
