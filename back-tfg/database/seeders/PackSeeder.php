<?php

namespace Database\Seeders;

use App\Models\Pack;
use App\Models\Card;
use Illuminate\Database\Seeder;

class PackSeeder extends Seeder
{
    public function run(): void
    {
        $packNames = ['Pack Rojo', 'Pack Azul', 'Pack Verde'];

        $cards = Card::all()->shuffle();
        $pools = $cards->chunk(51);

        foreach ($pools as $i => $pool) {
            $pack = Pack::create([
                'name' => $packNames[$i],
                'price' => 10 + $i * 5,
                'max_cards' => 5,
                'description' => "Pack con cartas variadas del pool #" . ($i + 1),
            ]);

            $pack->cards()->attach($pool->pluck('id'));
        }
    }
}
