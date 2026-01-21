<?php

namespace App\Rules;

class UserValidationRules
{
    /**
     * Get the validation rules for user creation.
     */
    public static function rules(): array
    {
        return [
            'phone_number' => [
                'required',
                'string',
                'unique:users,phone_number',
                'regex:/^\+[1-9]\d{1,14}$/',
            ],
            'name' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public static function messages(): array
    {
        return [
            'phone_number.regex' => 'The phone number must be in international format (e.g., +256XXXXXXXXX).',
        ];
    }
}
