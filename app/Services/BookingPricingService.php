<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Service;

class BookingPricingService
{
    /**
     * @param  array{
     *     extra_quarts?: int|string|null,
     *     extra_charge_amount?: float|string|null,
     *     extra_charge_label?: string|null,
     *     discount_percent?: float|string|null
     * }  $adjustments
     * @return array{
     *     package_price: float,
     *     extra_quarts: int,
     *     extra_quarts_amount: float,
     *     extra_charge_amount: float,
     *     extra_charge_label: ?string,
     *     discount_percent: float,
     *     discount_amount: float,
     *     total_price: float
     * }
     */
    public function calculate(Service $service, array $adjustments = []): array
    {
        $packagePrice = round((float) $service->base_price, 2);
        $extraQuarts = max(0, (int) ($adjustments['extra_quarts'] ?? 0));
        $quartUnitPrice = round((float) ($service->additional_quart_price ?? 0), 2);
        $extraQuartsAmount = round($extraQuarts * $quartUnitPrice, 2);
        $extraChargeAmount = round(max(0, (float) ($adjustments['extra_charge_amount'] ?? 0)), 2);
        $extraChargeLabel = filled($adjustments['extra_charge_label'] ?? null)
            ? trim((string) $adjustments['extra_charge_label'])
            : null;
        $discountPercent = round(min(100, max(0, (float) ($adjustments['discount_percent'] ?? 0))), 2);

        $subtotal = round($packagePrice + $extraQuartsAmount + $extraChargeAmount, 2);
        $discountAmount = round($subtotal * ($discountPercent / 100), 2);
        $totalPrice = round(max(0, $subtotal - $discountAmount), 2);

        return [
            'package_price' => $packagePrice,
            'extra_quarts' => $extraQuarts,
            'extra_quarts_amount' => $extraQuartsAmount,
            'extra_charge_amount' => $extraChargeAmount,
            'extra_charge_label' => $extraChargeLabel,
            'discount_percent' => $discountPercent,
            'discount_amount' => $discountAmount,
            'total_price' => $totalPrice,
        ];
    }

    /**
     * @param  array{
     *     extra_quarts?: int|string|null,
     *     extra_charge_amount?: float|string|null,
     *     extra_charge_label?: string|null,
     *     discount_percent?: float|string|null
     * }  $adjustments
     */
    public function applyToBooking(Booking $booking, Service $service, array $adjustments = []): Booking
    {
        $booking->fill($this->calculate($service, $adjustments));

        return $booking;
    }
}
