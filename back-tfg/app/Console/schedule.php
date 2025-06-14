<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('packs:reset-daily-counters')->dailyAt('00:00'); 