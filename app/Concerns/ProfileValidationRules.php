<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($userId),
            ...$this->contactRules(),
            'avatar' => $this->avatarRules(),
            'password' => $this->passwordRules(),
            'password_confirmation' => $this->passwordConfirmationRules(),
        ];
    }

    /**
     * Get the validation rules used to validate customer contact details.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>>
     */
    protected function contactRules(): array
    {
        return [
            'phone' => $this->phoneRules(),
            'address_line' => $this->addressLineRules(),
            'city' => $this->cityRules(),
            'state' => $this->stateRules(),
            'zip' => $this->zipRules(),
        ];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function phoneRules(): array
    {
        return ['required', 'string', 'max:30'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function addressLineRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function cityRules(): array
    {
        return ['required', 'string', 'max:100'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function stateRules(): array
    {
        return ['required', 'string', 'size:2'];
    }

    /**
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function zipRules(): array
    {
        return ['required', 'string', 'max:10'];
    }

    /**
     * Get the validation rules used to validate user avatars.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function avatarRules(): array
    {
        return ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:2048'];
    }

    /**
     * Get the validation rules used to validate new password.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function passwordRules(): array
    {
        return ['nullable', 'string', 'min:8', 'confirmed'];
    }

    /**
     * Get the validation rules used to validate password confirmation.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function passwordConfirmationRules(): array
    {
        return ['nullable'];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }
}
