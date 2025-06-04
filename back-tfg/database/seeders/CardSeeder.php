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
            $imageUrl = $pokemonDetails['sprites']['front_default'];
            $shinyImageUrl = $pokemonDetails['sprites']['front_shiny'];

            $powerLevel = $this->calculatePowerLevel($pokemonDetails['stats']);
            $rarity = $this->assignRarity($powerLevel);

            Card::firstOrCreate(
                ['name' => $pokemonDetails['name']],
                [
                    'image_url' => $imageUrl,
                    'shiny_image_url' => $shinyImageUrl,
                    'rarity' => $rarity,
                    'is_shiny' => $isShiny,
                    'type_1' => $pokemonDetails['types'][0]['type']['name'],
                    'type_2' => $pokemonDetails['types'][1]['type']['name'] ?? null,
                    'power_level' => $powerLevel,
                ]
            );

            $createdPokemon[] = $pokemonDetails['name'];
        }
    }

    private function calculatePowerLevel($stats): int
    {
        return array_sum(array_column($stats, 'base_stat'));
    }

    private function assignRarity(int $powerLevel): string
    {
        return match (true) {
            $powerLevel >= 600 => 'legendary',    // Solo los más poderosos
            $powerLevel >= 500 => 'epic',         // Pokémon muy fuertes
            $powerLevel >= 400 => 'rare',         // Pokémon fuertes
            default => 'common',                  // El resto son comunes
        };
    }
}
