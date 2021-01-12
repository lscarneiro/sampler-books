<?php

namespace Tests\Unit\Rules;

use PHPUnit\Framework\TestCase;
use App\Rules\ValidPassword;

class ValidPasswordTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->rule = new ValidPassword();
    }

    /**
     * Success for valid passwords
     *
     * @dataProvider validPasswords
     * @param string $password
     * @return void
     */
    public function testShouldPassForValidPassword($password)
    {
        $this->assertTrue($this->rule->passes('', $password));
    }

    /**
     * Fail for invalid passwords
     *
     * @dataProvider invalidPasswords
     * @param string $password
     * @return void
     */
    public function testShouldNotPassForInvalidPassword($password)
    {
        $this->assertFalse($this->rule->passes('', $password));
    }

    public function validPasswords()
    {
        return [
            ['Password0'],
            ['0Password'],
            ['1234567A'],
            ['A1234567'],
            ['Abcdefg7'],
        ];
    }

    public function invalidPasswords()
    {
        return [
            [null],
            [''],
            ['P0'],
            ['password'],
            ['ABCDEFGH'],
            ['12345678'],
        ];
    }
}
