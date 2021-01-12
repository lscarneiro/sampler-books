<?php

namespace Tests\Unit\Rules;

use PHPUnit\Framework\TestCase;
use App\Rules\Isbn;

class IsbnTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->rule = new Isbn();
    }

    public function testShouldPassForValidISBN()
    {
        $result = $this->rule->passes('test', '0005534186');
        $this->assertTrue($result);
    }

    public function testShouldPassForValidISBNWithX()
    {
        $result = $this->rule->passes('test', '044990248X');
        $this->assertTrue($result);
    }

    public function testShouldNotPassForNull()
    {
        $result = $this->rule->passes('test', null);
        $this->assertFalse($result);
    }

    public function testShouldNotPassForEmptyString()
    {
        $result = $this->rule->passes('test', '');
        $this->assertFalse($result);
    }

    public function testShouldNotPassForInvalidISBN()
    {
        $result = $this->rule->passes('test', '012345678');
        $this->assertFalse($result);
    }
}
