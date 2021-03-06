<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\User;
use App\Book;
use App\UserActionLog;
use Tymon\JWTAuth\Facades\JWTAuth;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertFalse;
use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;
use function PHPUnit\Framework\assertTrue;

class BookTest extends TestCase
{
    use RefreshDatabase;

    protected $access_token;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = factory(User::class)->create();
        $this->access_token = JWTAuth::fromUser($this->user);
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

    public function testUnauthorizedNewest()
    {
        $response = $this->getJson('/api/books/newest');

        $response->assertUnauthorized();
    }

    public function testAuthorizedNewestShouldReturnBooks()
    {
        factory(Book::class, 40)->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->access_token)
            ->getJson('/api/books/newest');

        $response->assertStatus(200)
            ->assertJsonCount(30);
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

    public function testShouldNotCheckoutBookWithoutAuthorzation()
    {
        $response = $this->postJson("/api/books/1/checkout", []);

        $response->assertUnauthorized();
    }

    public function testShouldNotCheckoutUnavailableBook()
    {
        $book = factory(Book::class)->states('checked_out')->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->access_token)
            ->postJson("/api/books/$book->id/checkout", []);

        $response->assertStatus(422)->assertJsonValidationErrors('checked_out');
    }

    public function testShouldCheckoutBook()
    {
        $book = factory(Book::class)->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->access_token)
            ->postJson("/api/books/$book->id/checkout", []);

        $response->assertStatus(200);

        $userLog = UserActionLog::where('user_id', $this->user->id)
            ->where('book_id', $book->id)
            ->where('action', 'CHECKOUT')
            ->first();
        assertNotNull($userLog);

        $updatedBook = Book::find($book->id);
        assertFalse($updatedBook->isAvailable());
        assertEquals($this->user->id, $updatedBook->borrower_id);
    }

    public function testShouldNotCheckinBookWithoutAuthorzation()
    {
        $response = $this->postJson("/api/books/1/checkin", []);

        $response->assertUnauthorized();
    }

    public function testShouldNotCheckinAlreadyAvailableBook()
    {
        $book = factory(Book::class)->create();

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->access_token)
            ->postJson("/api/books/$book->id/checkin", []);

        $response->assertStatus(422)->assertJsonValidationErrors('already_available');
    }

    public function testShouldNotCheckinBookByDifferentUser()
    {
        $book = factory(Book::class)->states('checked_out')->create();
        $userLog = new UserActionLog(['action' => 'CHECKOUT']);
        $userLog->user_id = $this->user->id;
        $userLog->book_id = $book->id;
        $userLog->save();

        $newUser = factory(User::class)->create();
        $newToken = JWTAuth::fromUser($newUser);

        $response = $this->withHeader('Authorization', 'Bearer ' . $newToken)
            ->postJson("/api/books/$book->id/checkin", []);

        $response->assertNotFound();
    }

    public function testShouldCheckinBook()
    {
        $book = factory(Book::class)->states('checked_out')->create();
        $book->borrower_id = $this->user->id;
        $book->save();

        $userLog = new UserActionLog(['action' => 'CHECKOUT']);
        $userLog->user_id = $this->user->id;
        $userLog->book_id = $book->id;
        $userLog->save();

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->access_token)
            ->postJson("/api/books/$book->id/checkin", []);

        $response->assertStatus(200);

        $userLog = UserActionLog::where('user_id', $this->user->id)
            ->where('book_id', $book->id)
            ->where('action', 'CHECKIN')
            ->first();
        assertNotNull($userLog);

        $updatedBook = Book::find($book->id);
        assertTrue($updatedBook->isAvailable());
        assertNull($updatedBook->borrower_id);
    }
}
