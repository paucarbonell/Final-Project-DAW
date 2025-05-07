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
            'price' => 'required|numeric',
            'max_cards' => 'required|integer',
            'description' => 'required|string',
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
            'price' => 'sometimes|numeric',
            'max_cards' => 'sometimes|integer',
            'description' => 'sometimes|string',
        ]);

        $pack->update($data);

        return response()->json($pack, 200);
    }

    public function destroy(Pack $pack)
    {
        $pack->delete();
        return response()->json(null, 204);
    }
}
