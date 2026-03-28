<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ActionLogController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'type' => 'required|string',
            'payload' => 'nullable|array',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
        ]);

        $log = ActionLog::create([
            'user_id' => $validated['user_id'] ?? null,
            'type' => $validated['type'],
            'payload' => $validated['payload'] ?? [],
            'lat' => $validated['lat'] ?? null,
            'lng' => $validated['lng'] ?? null,
            'created_at' => Carbon::now(),
        ]);

        return response()->json([
            'status' => 'success',
            'log_id' => $log->id,
            'timestamp' => $log->created_at->toIso8601String(),
        ], 201);
    }
}
