<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use App\Models\CardUser;
use App\Models\PackOpening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PackController extends Controller
{
    public function index()
    {
        return response()->json(Pack::all(), 200);
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

    public function open(Pack $pack)
    {
        $user = request()->user();

        DB::beginTransaction();

        try {
            $packOpening = PackOpening::create([
                'user_id' => $user->id,
                'pack_id' => $pack->id,
                'opened_at' => now(),
            ]);

            $cardsToGive = $pack->cards()->inRandomOrder()->limit($pack->max_cards)->get();

            $obtainedCards = [];

            foreach ($cardsToGive as $card) {
                $cardUser = CardUser::create([
                    'user_id' => $user->id,
                    'card_id' => $card->id,
                    'from_pack_opening_id' => $packOpening->id,
                    'obtained_at' => now(),
                ]);
                $obtainedCards[] = $card;
            }

            DB::commit();

            return response()->json($obtainedCards);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error opening pack: ' . $e->getMessage());
            return response()->json(['message' => 'Error al abrir el sobre.'], 500);
        }
    }
}
