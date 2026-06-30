<?php

namespace Database\Factories;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'vehicle_id' => Vehicle::factory(),
            'service_id' => Service::factory(),
            'status' => BookingStatus::Pending,
            'payment_status' => PaymentStatus::Unpaid,
            'scheduled_at' => fake()->dateTimeBetween('+1 day', '+2 weeks'),
            'service_address' => fake()->streetAddress(),
            'service_city' => 'Victoria',
            'service_state' => 'TX',
            'service_zip' => '77901',
            'total_price' => fake()->randomFloat(2, 99, 180),
        ];
    }

    public function cancelled(): static
    {
        return $this->state(fn(): array => [
            'status' => BookingStatus::Cancelled,
        ]);
    }
}
