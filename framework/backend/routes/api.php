<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\Admin\SppgController;
use App\Http\Controllers\Api\Admin\SchoolController;
use App\Http\Controllers\Api\Admin\SppgSchoolController;
use App\Http\Controllers\Api\Sppg\ProfileController;
use App\Http\Controllers\Api\Sppg\DistributionController;
use App\Http\Controllers\Api\PublicDistributionController;
use App\Http\Controllers\Api\Sppg\MenuController;
use App\Http\Controllers\Api\Siswa\ReviewController;
use App\Http\Controllers\Api\PublicReviewController;
use App\Http\Controllers\Api\PublicSppgController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register/siswa', [RegisterController::class, 'registerSiswa']);
Route::post('/register/guru',  [RegisterController::class, 'registerGuru']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

   Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::apiResource('sppg', SppgController::class);
        Route::get('schools/provinces', [SchoolController::class, 'provinces']);
        Route::apiResource('schools', SchoolController::class);
        Route::put('sppg/{sppg}/schools/sync', [SppgSchoolController::class, 'sync']);
        Route::post('sppg/{sppg}/schools/attach', [SppgSchoolController::class, 'attach']);
        Route::delete('sppg/{sppg}/schools/detach', [SppgSchoolController::class, 'detach']);
    });

    // SPPG only
    Route::middleware('role:sppg')->prefix('sppg')->group(function () {
        Route::get('/profile',         [ProfileController::class, 'show']);
        Route::put('/profile',         [ProfileController::class, 'update']);
        Route::get('/profile/reviews', [ProfileController::class, 'reviews']);
        Route::post('/menu/validate-nutrition', [MenuController::class, 'validateNutrition']);
        Route::apiResource('menu', MenuController::class)->except(['show']);
        Route::get('/distribution',                    [DistributionController::class, 'index']);
        Route::put('/distribution/{distribution}',     [DistributionController::class, 'update']);
    });

    // Siswa only
    Route::middleware('role:siswa')->prefix('siswa')->group(function () {
        Route::get('/sppg-info',           [ReviewController::class, 'sppgInfo']);
        Route::get('/reviews',             [ReviewController::class, 'index']);
        Route::post('/reviews',            [ReviewController::class, 'store']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);
    });

    // Guru only
    Route::middleware('role:guru')->prefix('guru')->group(function () {
        // US-10: flag ulasan
    });
});

Route::prefix('public')->group(function () {
    Route::get('/schools',      [PublicController::class, 'schools']);
    Route::get('/verify-nisn',  [PublicController::class, 'verifyNisn']);
    Route::get('/distribution', [PublicDistributionController::class, 'index']);
    Route::get('/reviews',      [PublicReviewController::class, 'index']);
    Route::get('/sppg',         [PublicSppgController::class, 'index']);
    Route::get('/sppg/{id}',    [PublicSppgController::class, 'show']);
});
