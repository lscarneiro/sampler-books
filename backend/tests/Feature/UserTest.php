<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = factory(\App\User::class)->create();
        $this->access_token = JWTAuth::fromUser($this->user);
    }

    public function testShouldNotGetUserWhenUnauthorized()
    {
        $response = $this->getJson('/api/user');

        $response->assertUnauthorized();
    }

    public function testShouldGetUserData()
    {
        $response = $this->withHeader('Authorization', "Bearer $this->access_token")
            ->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJsonStructure(['id', 'name', 'email', 'date_of_birth'])
            ->assertJson([
                'name' => $this->user->name,
                'email' => $this->user->email,
                'date_of_birth' =>  date_format($this->user->date_of_birth, 'Y-m-d'),
            ]);
    }

    public function testGetUserBorrowedBooks()
    {
        $book = factory(\App\Book::class)->states('checked_out')->create();
        $book->borrower_id = $this->user->id;
        $book->save();

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->access_token)
            ->getJson('/api/user/books');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function testShouldNotGetBooksWhenNotAuthorized()
    {
        $book = factory(\App\Book::class)->states('checked_out')->create();
        $book->borrower_id = $this->user->id;
        $book->save();

        $response = $this->getJson('/api/user/books');

        $response->assertUnauthorized();
    }
}
