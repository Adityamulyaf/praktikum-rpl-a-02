<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// BL-08: Check late distributions daily at 11:00 WIB (04:00 UTC)
Schedule::command('distribution:check-late')
    ->timezone('Asia/Jakarta')
    ->dailyAt('12:45')
    ->withoutOverlapping()
    ->onOneServer();
