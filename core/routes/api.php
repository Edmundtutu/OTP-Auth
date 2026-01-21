<?php

use App\Http\Controllers\MeController;
use App\Http\Controllers\OtpAuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/request-otp', [OtpAuthController::class, 'requestOtp'])
    ->middleware('throttle:otp-requests');
Route::post('/auth/verify-otp', [OtpAuthController::class, 'verifyOtp']);

// Admin routes (intentionally unprotected for Postman testing as per requirements)
// NOTE: In production, these should be protected with proper authentication
Route::post('/users', [UserController::class, 'store']);
Route::post('/users/bulk', [UserController::class, 'bulkImport']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [MeController::class, 'show']);
    Route::post('/auth/logout', [OtpAuthController::class, 'logout']);
});
