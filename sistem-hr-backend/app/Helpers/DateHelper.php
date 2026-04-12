<?php

namespace App\Helpers;

use Carbon\Carbon;

class DateHelper
{
    /**
     * Format date to Indonesian human readable format.
     * Example: 2026-04-12 -> 12 April 2026
     */
    public static function formatIndonesian(string|Carbon $date): string
    {
        if (is_string($date)) {
            $date = Carbon::parse($date);
        }

        $months = [
            1 => 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        return $date->day . ' ' . $months[$date->month] . ' ' . $date->year;
    }
}
