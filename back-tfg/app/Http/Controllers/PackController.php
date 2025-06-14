<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use App\Models\CardUser;
use App\Models\PackOpening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Card;

class PackController extends Controller
{
    public function index()
    {
        return Pack::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'cards_per_pack' => 'required|integer',
        ]);

        $pack = Pack::create($data);
        return response()->json($pack, 201);
    }

    public function show(Pack $pack)
    {
        return response()->json($pack, 200);
    }

    public function update(Request $request, Pack $pack)
    {
        $data = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'cards_per_pack' => 'sometimes|integer',
        ]);

        $pack->update($data);
        return response()->json($pack, 200);
    }

    public function destroy(Pack $pack)
    {
        $pack->delete();
        return response()->json(null, 204);
    }

    public function open(Pack $pack, Request $request)
    {
        $user = $request->user();
        
        // Verificar si el usuario puede abrir un sobre
        if (!$user->canOpenPack()) {
            $stats = $user->getPackOpeningStats();
            $awarenessMessage = $this->getRandomAwarenessMessage();
            
            return response()->json([
                'message' => 'Debes esperar antes de abrir otro sobre',
                'remaining_time' => $stats['remaining_cooldown'],
                'awareness_message' => $awarenessMessage
            ], 429);
        }

        // Verificar si el usuario tiene suficientes monedas
        if ($user->coins < $pack->price) {
            return response()->json(['message' => 'No tienes suficientes monedas para abrir este sobre.'], 403);
        }

        // Deducir el precio del sobre de las monedas del usuario
        $user->coins -= $pack->price;
        $user->save();

        // Obtener 5 cartas aleatorias directamente de la base de datos
        $selectedCards = Card::inRandomOrder()->take(5)->get();
        
        // Crear registros en card_user para cada carta
        $cardUsers = [];
        foreach ($selectedCards as $card) {
            $cardUser = CardUser::create([
                'user_id' => $user->id,
                'card_id' => $card->id,
                'is_shiny' => rand(1, 100) <= 5, // 5% de probabilidad de ser shiny
                'quantity' => 1,
                'obtained_at' => now()
            ]);
            
            $cardUsers[] = [
                'id' => $card->id,
                'name' => $card->name,
                'image_url' => $card->image_url,
                'rarity' => $card->rarity,
                'is_shiny' => $cardUser->is_shiny
            ];
        }

        // Actualizar el contador de sobres abiertos
        $user->update([
            'last_pack_opened_at' => now(),
            'daily_pack_count' => $user->daily_pack_count + 1,
            'total_cards' => $user->total_cards + 5 // Incrementar en 5 por cada sobre abierto
        ]);

        // Recargar el objeto de usuario para asegurar que 'canOpenPack' refleje los cambios
        $user->refresh();

        // Registrar la apertura del sobre
        $packOpening = PackOpening::create([
            'user_id' => $user->id,
            'pack_id' => $pack->id,
            'opened_at' => now()
        ]);

        // Actualizar el from_pack_opening_id en las cartas obtenidas
        foreach ($cardUsers as $cardUser) {
            CardUser::where('user_id', $user->id)
                   ->where('card_id', $cardUser['id'])
                   ->whereNull('from_pack_opening_id')
                   ->update(['from_pack_opening_id' => $packOpening->id]);
        }

        return response()->json([
            'message' => 'Sobre abierto exitosamente',
            'cards' => $cardUsers
        ]);
    }

    private function getRandomAwarenessMessage()
    {
        $messages = [
            "¿Sabías que la apertura compulsiva de sobres puede generar adicción?",
            "Tómate tu tiempo entre aperturas para disfrutar de tu colección",
            "La emoción de la apertura es temporal, el valor real está en la colección",
            "Recuerda: este es un juego de colección, no de azar",
            "Si sientes la necesidad de abrir sobres constantemente, considera tomar un descanso"
        ];

        return $messages[array_rand($messages)];
    }
}
