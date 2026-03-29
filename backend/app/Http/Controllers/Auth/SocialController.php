<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

class SocialController extends Controller {
    public function redirectToGoogle() {
        return Socialite::driver("google")->stateless()->redirect();
    }

    public function handleGoogleCallback() {
        try {
            $gt = Socialite::driver("google")->stateless()->user();
            $user = User::where("email", $gt->email)->first();
            $f = env("FRONTEND_URL", "https://shopdee.io.vn");

            if ($user) {
                $user->load('role');
                return redirect($f . "/auth/callback?" . http_build_query([
                    "token" => $user->createToken("token")->plainTextToken,
                    "user" => urlencode(json_encode($user))
                ]));
            }
            
            // Redirect to Role Selection Sandbox
            return redirect($f . "/auth/google-setup?" . http_build_query([
                "email" => $gt->email, 
                "name" => $gt->name, 
                "google_id" => $gt->id
            ]));
        } catch (\Exception $e) {
            Log::error("Google Neural Sync Fail: " . $e->getMessage());
            return redirect(env("FRONTEND_URL", "https://shopdee.io.vn") . "/auth/login?error=sync_failed");
        }
    }

    public function completeSetup(Request $request) {
        $v = $request->validate([
            "email" => "required|email",
            "name" => "required",
            "google_id" => "required",
            "role" => "required|in:customer,seller,shipper,linehaul"
        ]);

        $role = \App\Models\Role::where("name", $v["role"])->first();
        if (!$role) return response()->json(["message" => "Invalid role selected"], 422);

        $user = User::create([
            "name" => $v["name"],
            "email" => $v["email"],
            "password" => Hash::make(Str::random(16)), // Randomized password for OAuth nodes
            "role_id" => $role->id,
            "trust_score" => 100.0,
            "email_verified_at" => now(),
        ]);

        $user->load('role');

        return response()->json([
            "user" => $user,
            "token" => $user->createToken("token")->plainTextToken
        ], 201);
    }
}
