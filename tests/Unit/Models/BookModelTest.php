<?php

namespace Tests\Unit\Models;

use Tests\TestCase;

class BookModelTest extends TestCase
{
    public function testBookIsAvailable()
    {
        $book = factory(\App\Book::class)->make();

        $this->assertTrue($book->isAvailable());
    }

    public function testBookNotIsAvailable()
    {
        $book = factory(\App\Book::class)->states('checked_out')->make();

        $this->assertFalse($book->isAvailable());
    }
}
