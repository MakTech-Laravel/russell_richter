<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVehicleRequest extends FormRequest
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
            'vin' => [
                'required',
                'string',
                'size:17',
                'regex:/^[A-HJ-NPR-Z0-9]{17}$/i',
                Rule::unique('vehicles', 'vin')->where(fn ($query) => $query->where('user_id', $this->user()->id)),
            ],
            'mileage' => ['nullable', 'integer', 'min:0', 'max:999999'],
            'license_plate' => ['nullable', 'string', 'max:20'],
            'color' => ['nullable', 'string', 'max:50'],
            'year' => ['nullable', 'integer', 'min:1980', 'max:'.(date('Y') + 1)],
            'make' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'trim' => ['nullable', 'string', 'max:100'],
            'engine' => ['nullable', 'string', 'max:150'],
            'fuel_type' => ['nullable', 'string', 'max:100'],
            'body_class' => ['nullable', 'string', 'max:100'],
            'drive_type' => ['nullable', 'string', 'max:100'],
            'decode_vin' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'vin.regex' => 'Please enter a valid 17-character VIN.',
            'vin.unique' => 'This vehicle is already registered to your account.',
        ];
    }
}
