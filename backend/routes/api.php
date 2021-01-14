<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'auth'], function ($router) {
    Route::post('register', 'AuthController@register');
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
});

Route::group(['middleware' => 'auth:api'], function ($router) {
    Route::get('user', 'UserController@me');
    Route::get('user/books', 'UserController@userBooks');
});

Route::group(['middleware' => 'auth:api', 'prefix' => 'books'], function ($router) {
    Route::post('/search', 'BooksController@search');
    Route::post('/{id}/checkout', 'BooksController@checkout')->where('id', '[0-9]+');
    Route::post('/{id}/checkin', 'BooksController@checkin')->where('id', '[0-9]+');
    Route::post('/', 'BooksController@create');
});
