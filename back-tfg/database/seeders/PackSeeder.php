<?php

namespace Database\Seeders;

use App\Models\Pack;
use App\Models\Card;
use Illuminate\Database\Seeder;

class PackSeeder extends Seeder
{
    public function run(): void
    {
        $packConfigs = [
            ['name' => 'Pack Rojo', 'price' => 10],
            ['name' => 'Pack Azul', 'price' => 15],
            ['name' => 'Pack Verde', 'price' => 20],
        ];

        $cardChunks = Card::inRandomOrder()->get()->chunk(51);

        foreach ($packConfigs as $i => $config) {
            if (!isset($cardChunks[$i])) break;

            $pack = Pack::create([
                'name' => $config['name'],
                'price' => $config['price'],
                'max_cards' => 5,
                'description' => "Pack con cartas variadas del pool #" . ($i + 1),
            ]);

            // Asignar las cartas directamente al pack
            $cardChunks[$i]->each(function ($card) use ($pack) {
                $card->update(['pack_id' => $pack->id]);
            });
        }
    }
}
