<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\AuthController;

// Rutas de autenticación
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Rutas públicas
Route::get('/packs', [PackController::class, 'index']);
Route::get('/cards', [CardController::class, 'index']);

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    // Información del usuario
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/user/cards', [UserController::class, 'cards']);
    
    // Acciones que requieren autenticación
    Route::post('/packs/{pack}/open', [PackController::class, 'open']);
    Route::get('/cards/{card}', [CardController::class, 'show']);
    
    // Ruta temporal para resetear contadores
    Route::post('/user/reset-pack-counters', [UserController::class, 'resetPackCounters']);
    Route::post('/user/daily-coins', [UserController::class, 'getDailyCoins']);
    
    // Rutas de autenticación
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});