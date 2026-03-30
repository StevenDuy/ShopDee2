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

// --- ADMIN API (Elite Governance) ---
Route::group(['prefix' => 'admin'], function () {
    // Products
    Route::get('/products/search', "App\\Http\\Controllers\\Admin\\ProductController@search");

    // Banners
    Route::get('/banners', "App\\Http\\Controllers\\Admin\\BannerController@index");
    Route::post('/banners', "App\\Http\\Controllers\\Admin\\BannerController@store");
    Route::put('/banners/{id}', "App\\Http\\Controllers\\Admin\\BannerController@update");
    Route::delete('/banners/{id}', "App\\Http\\Controllers\\Admin\\BannerController@destroy");
    Route::patch('/banners/{id}/toggle', "App\\Http\\Controllers\\Admin\\BannerController@toggleStatus");

    // Categories
    Route::get('/categories', "App\\Http\\Controllers\\Admin\\CategoryController@index");
    Route::get('/categories/flat', "App\\Http\\Controllers\\Admin\\CategoryController@getList");
    Route::post('/categories', "App\\Http\\Controllers\\Admin\\CategoryController@store");
    Route::put('/categories/{id}', "App\\Http\\Controllers\\Admin\\CategoryController@update");
    Route::delete('/categories/{id}', "App\\Http\\Controllers\\Admin\\CategoryController@destroy");
});

// --- SELLER API (Market Operations) ---
Route::group(['prefix' => 'seller'], function () {
    // Products
    Route::get('/products', "App\\Http\\Controllers\\Seller\\ProductController@index");
    Route::post('/products', "App\\Http\\Controllers\\Seller\\ProductController@store");
    Route::post('/media/upload', "App\\Http\\Controllers\\Seller\\ProductController@uploadMedia");
    Route::put('/products/{id}', "App\\Http\\Controllers\\Seller\\ProductController@update");
    Route::delete('/products/{id}', "App\\Http\\Controllers\\Seller\\ProductController@destroy");
    Route::patch('/products/{id}/toggle', "App\\Http\\Controllers\\Seller\\ProductController@toggleStatus");
});
