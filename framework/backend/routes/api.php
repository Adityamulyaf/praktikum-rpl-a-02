<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\Admin\SppgController;
use App\Http\Controllers\Api\Admin\SchoolController;
use App\Http\Controllers\Api\Admin\SppgSchoolController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register/siswa', [RegisterController::class, 'registerSiswa']);
Route::post('/register/guru',  [RegisterController::class, 'registerGuru']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin only
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // US-13: manage SPPG & schools
        Route::apiResource('sppg', SppgController::class);
        Route::get('schools/provinces', [SchoolController::class, 'provinces']);
        Route::apiResource('schools', SchoolController::class);
        Route::put('sppg/{sppg}/schools/sync', [SppgSchoolController::class, 'sync']);
        Route::post('sppg/{sppg}/schools/attach', [SppgSchoolController::class, 'attach']);
        Route::delete('sppg/{sppg}/schools/detach', [SppgSchoolController::class, 'detach']);
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
    Route::get('/schools', [PublicController::class, 'schools']);
});
