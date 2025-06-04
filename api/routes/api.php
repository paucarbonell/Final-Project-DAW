<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\PokemonController;
use App\Http\Controllers\UserController;

// Rutas de autenticación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    // Información del usuario
    Route::get('/user', [UserController::class, 'show']);
    
    // Cartas del usuario
    Route::get('/user/cards', [UserController::class, 'cards']);
    
    // Sobres y apertura de sobres
    Route::get('/cards', [CardController::class, 'index']);
    Route::post('/cards/{card}/open', [CardController::class, 'open']);
    
    // Pokémon
    Route::get('/pokemon', [PokemonController::class, 'index']);
    Route::get('/pokemon/{pokemon}', [PokemonController::class, 'show']);
}); 