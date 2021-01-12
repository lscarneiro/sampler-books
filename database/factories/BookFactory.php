<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Book;
use Faker\Generator as Faker;

$factory->define(Book::class, function (Faker $faker) {
    $sentence = $faker->sentence();
    $bookTitle = substr($sentence, 0, strlen($sentence) - 1); //remove '.' at the end
    return [
        'title' => $bookTitle,
        'isbn' => $faker->unique()->isbn10,
        'published_at' => date_time_set($faker->dateTime($max = 'now', $timezone = null), 0, 0, 0, 0),
        'status' => 'AVAILABLE', // default
    ];
});
