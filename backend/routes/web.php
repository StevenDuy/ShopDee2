<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/p-check', function () {
    return response()->json(['status' => 'ok']);
});
