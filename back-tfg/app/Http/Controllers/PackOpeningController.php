<?php

namespace App\Http\Controllers;

use App\Models\PackOpening;
use Illuminate\Http\Request;

class PackOpeningController extends Controller
{
    public function index()
    {
        return response()->json(PackOpening::with(['user', 'pack'])->get(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'pack_id' => 'required|exists:packs,id',
            'opened_at' => 'required|date',
        ]);

        $packOpening = PackOpening::create($data);
        return response()->json($packOpening, 201);
    }

    public function show(PackOpening $packOpening)
    {
        return response()->json($packOpening->load(['user', 'pack']), 200);
    }

    public function destroy(PackOpening $packOpening)
    {
        $packOpening->delete();
        return response()->json(null, 204);
    }
}
