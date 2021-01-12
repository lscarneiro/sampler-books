<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\User;
use App\Book;
use Tymon\JWTAuth\Facades\JWTAuth;

class BookTest extends TestCase
{
    use RefreshDatabase;

    protected $access_token;

    public function setUp(): void
    {
        parent::setUp();

        $user = factory(User::class)->create();
        $this->access_token = JWTAuth::fromUser($user);
    }

    public function testUnauthorizedSearch()
    {
        $response = $this->postJson('/api/books/search', ['isbn' => '9643675319']);

        $response->assertUnauthorized();
    }

    public function testAuthorizedSearchShouldReturnBooks()
    {
        $book = factory(Book::class)->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->access_token)
            ->postJson('/api/books/search', ['isbn' => $book->isbn]);

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function testUnauthorizedBookCreation()
    {
        $response = $this->postJson('/api/books', []);

        $response->assertUnauthorized();
    }

    public function testShouldCreateBook()
    {
        $data = [
            'title' => 'Harry Potter and the Philosopher\'s Stone',
            'isbn' => '0978168968',
            'published_at' => '2014-01-22'
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->access_token)
            ->postJson('/api/books', $data);

        $response->assertStatus(200)
            ->assertJson($data);
    }

    public function testShouldReturnErrorForInvalidData()
    {
        $data = [
            'title' => 'Harry Potter and the Philosopher\'s Stone',
            'isbn' => '1234567890',
            'published_at' => '2014-01-22'
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->access_token)
            ->postJson('/api/books', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('isbn');
    }
}