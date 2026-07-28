<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = $this->profileRules($this->user()->id);
        $rules['name'] = ['nullable', 'string', 'max:255'];

        // Settings profile form only edits name/email/avatar/password.
        unset(
            $rules['phone'],
            $rules['address_line'],
            $rules['city'],
            $rules['state'],
            $rules['zip'],
        );

        return $rules;
    }
}
