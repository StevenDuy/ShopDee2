<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ActionLogController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// --- SHOPDEE2 AI SANDBOX TELEMETRY ---
Route::post('/action-logs', [ActionLogController::class, 'store']);

// Diagnostic endpoint
Route::get('/p-check', function() {
    return response()->json(['status' => 'online', 'sandbox' => 'active']);
});
