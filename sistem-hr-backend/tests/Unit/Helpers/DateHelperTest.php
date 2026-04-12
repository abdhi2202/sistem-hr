<?php

namespace Tests\Unit\Helpers;

use App\Helpers\DateHelper;
use PHPUnit\Framework\TestCase;
use Carbon\Carbon;

class DateHelperTest extends TestCase
{
    /**
     * Test that formatIndonesian correctly formats a date string.
     */
    public function test_it_formats_date_string_correctly(): void
    {
        $date = '2026-04-12';
        $formatted = DateHelper::formatIndonesian($date);

        $this->assertEquals('12 April 2026', $formatted);
    }

    /**
     * Test that formatIndonesian correctly formats a Carbon instance.
     */
    public function test_it_formats_carbon_instance_correctly(): void
    {
        $date = Carbon::create(2026, 8, 17);
        $formatted = DateHelper::formatIndonesian($date);

        $this->assertEquals('17 Agustus 2026', $formatted);
    }

    /**
     * Test formatting for different months.
     */
    public function test_it_formats_various_months_correctly(): void
    {
        $this->assertEquals('1 Januari 2024', DateHelper::formatIndonesian('2024-01-01'));
        $this->assertEquals('25 Desember 2024', DateHelper::formatIndonesian('2024-12-25'));
    }
}
