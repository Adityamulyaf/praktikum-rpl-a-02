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
use App\Http\Controllers\Api\Sppg\FollowupController;
use App\Http\Controllers\Api\Siswa\ReviewController;
use App\Http\Controllers\Api\Guru\ReviewController as GuruReviewController;
use App\Http\Controllers\Api\PublicReviewController;
use App\Http\Controllers\Api\PublicSppgController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register/siswa', [RegisterController::class, 'registerSiswa']);
Route::post('/register/guru',  [RegisterController::class, 'registerGuru']);
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Notifications (available to all authenticated users)
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead']);

   Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('dashboard/stats', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'stats']);
        Route::apiResource('sppg', SppgController::class);
        Route::get('schools/provinces', [SchoolController::class, 'provinces']);
        Route::apiResource('schools', SchoolController::class);
        Route::put('sppg/{sppg}/schools/sync', [SppgSchoolController::class, 'sync']);
        Route::post('sppg/{sppg}/schools/attach', [SppgSchoolController::class, 'attach']);
        Route::delete('sppg/{sppg}/schools/detach', [SppgSchoolController::class, 'detach']);
    });

    Route::get('/sppg/profile', [ProfileController::class, 'show'])->middleware('role:sppg,admin,siswa,guru');
    Route::put('/sppg/profile', [ProfileController::class, 'update'])->middleware('role:sppg,admin');

    // SPPG only
    Route::middleware('role:sppg')->prefix('sppg')->group(function () {
        Route::get('/profile/reviews', [ProfileController::class, 'reviews']);
        Route::post('/menu/validate-nutrition', [MenuController::class, 'validateNutrition']);
        Route::apiResource('menu', MenuController::class)->except(['show']);
        Route::get('/distribution',                    [DistributionController::class, 'index']);
        Route::put('/distribution/{distribution}',     [DistributionController::class, 'update']);
        Route::get('/followups',                       [FollowupController::class, 'index']);
        Route::get('/followups/{followup}',            [FollowupController::class, 'show']);
        Route::put('/followups/{followup}',            [FollowupController::class, 'update']);
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
        Route::get('/reviews',                [GuruReviewController::class, 'index']);
        Route::post('/reviews/{review}/flag', [GuruReviewController::class, 'flag']);
        Route::get('/sppg-profile',           [ProfileController::class, 'show']);
        Route::get('/sppg-profile/reviews',   [ProfileController::class, 'reviews']);
    });
});

Route::prefix('public')->group(function () {
    Route::get('/schools',      [PublicController::class, 'schools']);
    Route::get('/verify-nisn',  [PublicController::class, 'verifyNisn']);
    Route::get('/verify-nip',   [PublicController::class, 'verifyNip']);
    Route::get('/distribution', [PublicDistributionController::class, 'index']);
    Route::get('/reviews',      [PublicReviewController::class, 'index']);
    Route::get('/sppg',         [PublicSppgController::class, 'index']);
    Route::get('/sppg/{id}',    [PublicSppgController::class, 'show']);
});
