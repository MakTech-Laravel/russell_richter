<?php

namespace App\Http\Requests\Admin;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $customerId = $this->route('customer')?->id;

        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($customerId),
            ...$this->contactRules(),
            'password' => $this->passwordRules(),
            'password_confirmation' => $this->passwordConfirmationRules(),
        ];
    }
}
