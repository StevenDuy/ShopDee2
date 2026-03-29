<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\OtpVerification;

class AuthController extends Controller {
    public function login(Request $request) {
        $v = $request->validate(["email" => "required|email", "password" => "required"]);
        if (Auth::attempt($v)) {
            $user = Auth::user();
            return response()->json(["user" => $user, "token" => $user->createToken("token")->plainTextToken]);
        }
        return response()->json(["message" => "Failed"], 401);
    }
    public function register(Request $request) {
        $v = $request->validate(["name" => "required", "email" => "required|email|unique:users", "password" => "required|min:8", "role" => "required", "code" => "required|size:6"]);
        $otp = OtpVerification::where("email", $v["email"])->where("code", $v["code"])->where("purpose", "registration")->where("expires_at", ">", now())->first();
        if (!$otp) return response()->json(["message" => "Expired"], 422);
        $user = User::create(["name" => $v["name"], "email" => $v["email"], "password" => Hash::make($v["password"]), "role" => $v["role"], "trust_score" => 100.0]);
        $otp->delete();
        return response()->json(["user" => $user, "token" => $user->createToken("token")->plainTextToken], 201);
    }
    public function resetPassword(Request $request) {
        $v = $request->validate(["email" => "required|exists:users", "code" => "required|size:6", "password" => "required|min:8|confirmed"]);
        $otp = OtpVerification::where("email", $v["email"])->where("code", $v["code"])->where("purpose", "reset_password")->where("expires_at", ">", now())->first();
        if (!$otp) return response()->json(["message" => "Expired"], 422);
        $u = User::where("email", $v["email"])->first();
        $u->update(["password" => Hash::make($v["password"])]);
        $otp->delete();
        return response()->json(["status" => "success"]);
    }
}
