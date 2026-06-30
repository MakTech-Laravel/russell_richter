<?php

namespace App\Http\Requests;

use App\Enums\BookingStatus;
use App\Rules\AvailableBookingSlot;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->id === $this->route('booking')?->user_id;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'scheduled_at' => ['sometimes', 'date', 'after:now', new AvailableBookingSlot($this->route('booking'))],
            'service_address' => ['sometimes', 'string', 'max:255'],
            'service_city' => ['sometimes', 'string', 'max:100'],
            'service_state' => ['sometimes', 'string', 'size:2'],
            'service_zip' => ['sometimes', 'string', 'max:10'],
            'mileage_at_service' => ['nullable', 'integer', 'min:0', 'max:999999'],
            'customer_notes' => ['nullable', 'string', 'max:1000'],
            'status' => ['sometimes', Rule::in([BookingStatus::Cancelled->value])],
        ];
    }
}
