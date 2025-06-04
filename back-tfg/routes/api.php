<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\CardController;

// Rutas de autenticación
Route::post('register', [UserController::class, 'store']);
Route::post('login', [UserController::class, 'login']);

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    // Información del usuario
    Route::get('user', [UserController::class, 'show']);
    Route::get('user/cards', [UserController::class, 'cards']);
    
    // Sobres
    Route::get('packs', [PackController::class, 'index']);
    Route::post('packs/{pack}/open', [PackController::class, 'open']);
    
    // Cartas
    Route::get('cards', [CardController::class, 'index']);
    Route::get('cards/{card}', [CardController::class, 'show']);
});