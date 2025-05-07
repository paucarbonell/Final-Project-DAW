<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Card;

class CardSeeder extends Seeder
{
    public function run()
    {
        // Obtener los primeros 151 Pokémon
        $response = Http::get('https://pokeapi.co/api/v2/pokemon?limit=151');

        if ($response->failed()) {
            Log::error('No se pudo obtener la lista de Pokémon de la API.');
            return;
        }

        $pokemons = $response->json('results');

        $createdPokemon = [];

        foreach ($pokemons as $pokemon) {
            if (in_array($pokemon['name'], $createdPokemon)) {
                continue;
            }

            $pokemonDetailsResponse = Http::get($pokemon['url']);

            if ($pokemonDetailsResponse->failed()) {
                Log::warning("No se pudo obtener detalles para el Pokémon: {$pokemon['name']}");
                continue;
            }

            $pokemonDetails = $pokemonDetailsResponse->json();

            $isShiny = fake()->boolean(1);
            $imageUrl = $isShiny 
                        ? $pokemonDetails['sprites']['front_shiny'] 
                        : $pokemonDetails['sprites']['front_default'];

            $rarity = $this->assignRarity($pokemonDetails['stats']);

            Card::firstOrCreate(
                ['name' => $pokemonDetails['name']],
                [
                    'image_url' => $imageUrl,
                    'rarity' => $rarity,
                    'is_shiny' => $isShiny,
                    'type_1' => $pokemonDetails['types'][0]['type']['name'],
                    'type_2' => $pokemonDetails['types'][1]['type']['name'] ?? null,
                ]
            );

            $createdPokemon[] = $pokemonDetails['name'];
        }
    }

    private function assignRarity($stats): string
    {
        $totalStats = array_sum(array_column($stats, 'base_stat'));

        return match (true) {
            $totalStats >= 600 => 'legendary',
            $totalStats >= 450 => 'epic',
            $totalStats >= 300 => 'rare',
            default => 'common',
        };
    }
}
