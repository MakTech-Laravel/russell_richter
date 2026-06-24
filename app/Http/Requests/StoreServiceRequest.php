<?php

namespace App\Http\Requests;

use App\Enums\ServiceType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('services', 'slug')],
            'service_type' => ['required', Rule::enum(ServiceType::class)],
            'description' => ['nullable', 'string', 'max:2000'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'base_price' => ['required', 'numeric', 'min:0', 'max:99999.99'],
            'price_label' => ['nullable', 'string', 'max:100'],
            'addon_note' => ['nullable', 'string', 'max:255'],
            'included_quarts' => ['nullable', 'integer', 'min:0', 'max:50'],
            'additional_quart_price' => ['nullable', 'numeric', 'min:0', 'max:999.99'],
            'is_popular' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('slug') && $this->filled('name')) {
            $this->merge([
                'slug' => Str::slug($this->string('name')->toString()),
            ]);
        }

        if ($this->has('features') && is_string($this->input('features'))) {
            $this->merge([
                'features' => $this->featuresFromText($this->string('features')->toString()),
            ]);
        }

        $this->merge([
            'is_popular' => $this->boolean('is_popular'),
            'is_active' => $this->boolean('is_active'),
        ]);
    }

    /**
     * @return list<string>
     */
    private function featuresFromText(string $text): array
    {
        return array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $text) ?: [])));
    }
}
