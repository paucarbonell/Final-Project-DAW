<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class UserController extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function __construct()
    {
        // We will need to adjust middleware later for token authentication using remember_token
        // For now, keeping routes public
        // $this->middleware('auth:sanctum')->except(['store', 'login']);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            return response()->json([
                'user' => $user,
                'token' => $user->createToken('auth_token')->plainTextToken
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken
        ]);
    }

    public function show(Request $request)
    {
        $user = $request->user();
        $user->refresh(); // Forzar la recarga del usuario desde la base de datos

        // Incluir el resultado del método canOpenPack en la respuesta
        return response()->json([
            'user' => $user,
            'can_open_pack' => $user->canOpenPack()
        ]);
    }

    public function cards(Request $request)
    {
        $user = $request->user();
        // Devolver las cartas del usuario, incluyendo los detalles de la tabla pivote y sin paginación del backend
        return response()->json($user->cards()->withPivot('is_shiny', 'quantity', 'obtained_at')->get());
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
        ]);

        $user->update($data);

        return response()->json($user, 200);
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $user->delete();

        return response()->json(null, 204);
    }

    public function resetPackCounters(Request $request)
    {
        $user = $request->user();
        
        $user->update([
            'last_pack_opened_at' => null,
            'daily_pack_count' => 0
        ]);

        return response()->json([
            'message' => 'Contadores reseteados correctamente',
            'user' => $user
        ]);
    }

    public function getDailyCoins(Request $request)
    {
        $user = $request->user();
        
        // Verificar si el usuario ya recibió sus monedas diarias hoy
        $lastDailyCoins = $user->last_daily_coins;
        $today = date('Y-m-d');
        $lastCoinsDate = $lastDailyCoins ? date('Y-m-d', strtotime($lastDailyCoins)) : null;
        
        if ($lastCoinsDate === $today) {
            return response()->json([
                'message' => 'Ya has recibido tus monedas diarias hoy',
                'coins' => $user->coins
            ]);
        }

        // Dar 100 monedas al usuario
        $user->coins += 100;
        $user->last_daily_coins = now();
        $user->save();

        return response()->json([
            'message' => '¡Has recibido 100 monedas!',
            'coins' => $user->coins
        ]);
    }
}
