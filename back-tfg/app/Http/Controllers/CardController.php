<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index()
    {
        return response()->json(Card::all(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'image_url' => 'required|url',
            'rarity' => 'required|string',
            'is_shiny' => 'required|boolean',
            'type_1' => 'required|string',
            'type_2' => 'nullable|string',
        ]);

        $card = Card::create($data);
        return response()->json($card, 201);
    }

    public function show(Card $card)
    {
        return response()->json($card, 200);
    }

    public function update(Request $request, Card $card)
    {
        $data = $request->validate([
            'name' => 'sometimes|string',
            'image_url' => 'sometimes|url',
            'rarity' => 'sometimes|string',
            'is_shiny' => 'sometimes|boolean',
            'type_1' => 'sometimes|string',
            'type_2' => 'nullable|string',
        ]);

        $card->update($data);

        return response()->json($card, 200);
    }

    public function destroy(Card $card)
    {
        $card->delete();
        return response()->json(null, 204);
    }
}
