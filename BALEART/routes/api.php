<?php

use App\Models\User;
use App\Models\Space;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SpaceController;
use App\Http\Controllers\Api\FilterController;
use App\Http\Controllers\Api\CommentController;

// Noves rutes
Route::bind('space', function ($value) {
    return is_numeric($value)
        ? Space::findOrFail($value)
        : Space::where('regNumber', $value)->firstOrFail();
});
Route::bind('user', function ($value) {
    return is_numeric($value)
        ? User::findOrFail($value)
        : User::where('email', $value)->firstOrFail();
});

// Rutes sense autenticació
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::apiresource('/space', SpaceController::class)->only(['index', 'show', 'store']);
Route::get('/filters', [FilterController::class, 'getFilters']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/comments', [CommentController::class, 'getUserComments']);
    Route::apiresource('/user', UserController::class)->only(['show', 'update', 'destroy']);
    Route::get('/user', [UserController::class, 'show']);
    Route::delete('/comments/{id}', [CommentController::class, 'deleteComment']);
    Route::post('/comments', [CommentController::class, 'store']);
});
