<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin only
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // US-13: manage SPPG & schools
    });

    // SPPG only
    Route::middleware('role:sppg')->prefix('sppg')->group(function () {
        // US-05: input menu
        // US-08: update distribusi
    });

    // Siswa only
    Route::middleware('role:siswa')->prefix('siswa')->group(function () {
        // US-09: ulasan & foto
    });

    // Guru only
    Route::middleware('role:guru')->prefix('guru')->group(function () {
        // US-10: flag ulasan
    });
});

Route::prefix('public')->group(function () {
  
});
