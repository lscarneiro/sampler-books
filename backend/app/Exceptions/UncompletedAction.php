<?php

namespace App\Exceptions;

use Exception;

class UncompletedAction extends Exception
{
    public $errors = [];

    public function __construct($errors)
    {
        $this->errors = $errors;
    }

    public function render()
    {
        return response()->json([
            'message' => "Action could be completed.",
            'errors' => $this->errors,
        ], 422);
    }
}
