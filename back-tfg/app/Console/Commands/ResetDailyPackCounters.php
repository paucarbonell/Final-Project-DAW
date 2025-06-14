<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class ResetDailyPackCounters extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'packs:reset-daily-counters';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Resetea los contadores diarios de sobres abiertos para todos los usuarios';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando reseteo de contadores diarios...');
        
        $updated = User::query()
            ->where('daily_pack_count', '>', 0)
            ->update(['daily_pack_count' => 0]);

        $this->info("Contadores reseteados para {$updated} usuarios.");
        
        return Command::SUCCESS;
    }
}
