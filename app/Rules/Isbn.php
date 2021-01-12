<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Isbn implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if (!preg_match('/[0-9]{9}[0-9x]/i', $value)) return false;

        $checksum = 0;
        for ($i = 0; $i < 9; $i++) {
            $checksum += $value[$i] * (10 - $i);
        }
        $checkDigit = strtolower($value[9]);
        $checksum += $checkDigit === 'x' ? 10 : $checkDigit;

        return $checksum % 11 == 0;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Must be a valid ISBN-10.';
    }
}
