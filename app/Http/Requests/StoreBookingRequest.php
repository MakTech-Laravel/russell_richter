<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
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
            'vehicle_id' => [
                'required',
                Rule::exists('vehicles', 'id')->where(fn ($query) => $query->where('user_id', $this->user()->id)),
            ],
            'service_id' => ['required', Rule::exists('services', 'id')->where('is_active', true)],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'service_address' => ['required', 'string', 'max:255'],
            'service_city' => ['required', 'string', 'max:100'],
            'service_state' => ['required', 'string', 'size:2'],
            'service_zip' => ['required', 'string', 'max:10'],
            'mileage_at_service' => ['nullable', 'integer', 'min:0', 'max:999999'],
            'customer_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
