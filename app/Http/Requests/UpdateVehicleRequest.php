<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->id === $this->route('vehicle')?->user_id;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'vin' => [
                'sometimes',
                'string',
                'size:17',
                'regex:/^[A-HJ-NPR-Z0-9]{17}$/i',
                Rule::unique('vehicles', 'vin')
                    ->where(fn ($query) => $query->where('user_id', $this->user()->id))
                    ->ignore($this->route('vehicle')),
            ],
            'mileage' => ['nullable', 'integer', 'min:0', 'max:999999'],
            'license_plate' => ['nullable', 'string', 'max:20'],
            'color' => ['nullable', 'string', 'max:50'],
        ];
    }
}
