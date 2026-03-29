<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ActionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
class ActionLogController extends Controller {
    public function store(Request $request) {
        $v = $request->validate(["user_id" => "nullable", "type" => "required", "payload" => "required", "lat" => "nullable", "lng" => "nullable"]);
        ActionLog::create($v + ["created_at" => Carbon::now()]);
        return response()->json(["status" => "success"], 201);
    }
}
