<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\PackOpeningController;

Route::post('register', [UserController::class, 'store']);
Route::post('login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::resource('users', UserController::class)->except(['store', 'login']);
    Route::resource('packs', PackController::class);
    Route::resource('cards', CardController::class);
    Route::resource('pack-openings', PackOpeningController::class);
});
