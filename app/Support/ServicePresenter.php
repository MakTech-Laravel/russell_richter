<?php

namespace App\Support;

use App\Enums\ServiceType;
use App\Models\Service;
use Illuminate\Support\Collection;

class ServicePresenter
{
    /**
     * @return array<int, array{id: int, name: string, price: float, popular: bool, features: array<int, string>}>
     */
    public static function pricingPackages(): array
    {
        return Service::query()
            ->where('is_active', true)
            ->where('service_type', ServiceType::Package)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Service $service) => [
                'id' => $service->id,
                'name' => $service->name,
                'price' => (float) $service->base_price,
                'popular' => $service->is_popular,
                'features' => $service->features ?? [],
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{id: int, name: string, price: string, note: string|null}>
     */
    public static function addOnServices(): array
    {
        return Service::query()
            ->where('is_active', true)
            ->where('service_type', ServiceType::Addon)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Service $service) => [
                'id' => $service->id,
                'name' => $service->name,
                'price' => $service->price_label ?? '$'.number_format((float) $service->base_price, 0),
                'note' => $service->addon_note,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public static function adminList(Collection $services): array
    {
        return $services->map(fn (Service $service) => [
            'id' => $service->id,
            'slug' => $service->slug,
            'name' => $service->name,
            'description' => $service->description,
            'service_type' => $service->service_type->value,
            'service_type_label' => $service->service_type->label(),
            'base_price' => $service->base_price,
            'price_label' => $service->price_label,
            'included_quarts' => $service->included_quarts,
            'additional_quart_price' => $service->additional_quart_price,
            'features' => $service->features ?? [],
            'addon_note' => $service->addon_note,
            'is_popular' => $service->is_popular,
            'is_active' => $service->is_active,
            'sort_order' => $service->sort_order,
            'bookings_count' => $service->bookings_count ?? $service->bookings()->count(),
        ])->all();
    }
}
