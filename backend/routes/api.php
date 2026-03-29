<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post("/login", "App\\Http\\Controllers\\AuthController@login");
Route::post("/register", "App\\Http\\Controllers\\AuthController@register");
Route::post("/auth/otp/send", "App\\Http\\Controllers\\Auth\\OtpController@sendOtp");
Route::post("/auth/password/reset", "App\\Http\\Controllers\\AuthController@resetPassword");

// Neural Link (Google)
Route::get("/auth/google", "App\\Http\\Controllers\\Auth\\SocialController@redirectToGoogle");
Route::get("/auth/google/callback", "App\\Http\\Controllers\\Auth\\SocialController@handleGoogleCallback");
Route::post("/auth/google/complete", "App\\Http\\Controllers\\Auth\\SocialController@completeSetup");

Route::post("/action-logs", "App\\Http\\Controllers\\Api\\ActionLogController@store");
Route::get("/p-check", function() { return response()->json(["status"=>"ok"]); });
