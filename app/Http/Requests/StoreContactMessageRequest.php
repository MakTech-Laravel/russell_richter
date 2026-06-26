<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['nullable', 'string', 'max:255'],
            'contact_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'phone' => ['nullable', 'string', 'max:32'],
            'vehicle_count' => ['nullable', 'integer', 'min:1', 'max:999'],
            'vehicle_types' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'contact_name.required' => 'Please add your name.',
            'email.required' => 'We need an email address to reply.',
            'email.email' => 'Please enter a valid email address.',
            'message.required' => 'Please include a short message.',
        ];
    }
}
