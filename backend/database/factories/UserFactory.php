<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\User;
use Faker\Generator as Faker;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$defaultPassword = bcrypt('Password0');

$factory->define(User::class, function (Faker $faker) use ($defaultPassword) {
    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'date_of_birth' => date_time_set($faker->dateTimeThisCentury($max = 'now', $timezone = null), 0, 0, 0, 0),
        'password' => $defaultPassword,
    ];
});
