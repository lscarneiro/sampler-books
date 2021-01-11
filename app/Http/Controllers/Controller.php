<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *  title="Sampler Book Library API", 
 *  version="0.0.1",
 *  description="This is the documentation of the Sampler Book Library API, with this API you can check-in and out books after you register as an user"
 * )
 * 
 * @OA\SecurityScheme(
 *  securityScheme="access_token",
 *  type="http",
 *  bearerFormat="JWT",
 *  scheme="bearer"
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
