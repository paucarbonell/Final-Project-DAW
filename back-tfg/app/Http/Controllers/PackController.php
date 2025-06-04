<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use Illuminate\Http\Request;

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
        $cards = $pack->open();
        
        // Asociar las cartas al usuario
        foreach ($cards as $card) {
            $user->cards()->attach($card->id);
        }

        return response()->json($cards);
    }
}
