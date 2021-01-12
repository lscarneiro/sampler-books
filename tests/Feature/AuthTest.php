<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
