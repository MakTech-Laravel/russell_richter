<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingPricingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'extra_quarts' => ['nullable', 'integer', 'min:0', 'max:50'],
            'extra_charge_amount' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'extra_charge_label' => ['nullable', 'string', 'max:255'],
            'discount_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'scheduled_at' => ['nullable', 'date'],
            'service_address' => ['nullable', 'string', 'max:255'],
            'service_city' => ['nullable', 'string', 'max:100'],
            'service_state' => ['nullable', 'string', 'size:2'],
            'service_zip' => ['nullable', 'string', 'max:10'],
            'customer_notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'extra_quarts.max' => 'Extra quarts cannot exceed 50.',
            'discount_percent.max' => 'Discount cannot exceed 100%.',
        ];
    }
}
