<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function testShouldNotRegisterForBadData()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => '',
            'email' => '',
            'password' => '',
            'date_of_birth' => '',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors([
            'name',
            'email',
            'password',
            'date_of_birth'
        ]);
    }

    public function testShouldRegisterAndReturnJWT()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'George Lucas',
            'email' => 'george@lucasarts.com',
            'date_of_birth' => '1944-05-14',
            'password' => '5T4r W4Rs',
        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'access_token',
            'token_type',
            'expires_in'
        ]);
    }

    public function testShouldNotLoginWithBadData()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => '',
            'password' => '',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors([
            'email',
            'password',
        ]);
    }

    public function testShouldLoginAndReturnJWT()
    {
        $userPassword = 'password';
        $user = factory(\App\User::class)->create(['password' => bcrypt($userPassword)]);

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => $userPassword
        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'access_token',
            'token_type',
            'expires_in'
        ]);
    }

    public function testShouldLogout()
    {
        $userPassword = 'password';
        $user = factory(\App\User::class)->create(['password' => bcrypt($userPassword)]);

        $access_token = JWTAuth::fromUser($user);
        $response = $this->withHeader('Authorization', "Bearer $access_token")
            ->post('/api/auth/logout');

        $response->assertStatus(200);

        // Tries to retrieve data with blocklisted token
        $response2 = $this->withHeader('Authorization', "Bearer $access_token")
            ->getJson('/api/auth/me');

        $response2->assertUnauthorized();
    }

    public function testShouldNotGetUserWhenUnauthorized()
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertUnauthorized();
    }

    public function testShouldGetUserData()
    {
        $userPassword = 'password';
        $user = factory(\App\User::class)->create(['password' => bcrypt($userPassword)]);

        $access_token = JWTAuth::fromUser($user);
        $response = $this->withHeader('Authorization', "Bearer $access_token")
            ->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJsonStructure(['id', 'name', 'email', 'date_of_birth'])
            ->assertJson([
                'name' => $user->name,
                'email' => $user->email,
                'date_of_birth' =>  date_format($user->date_of_birth, 'Y-m-d'),
            ]);
    }
}
