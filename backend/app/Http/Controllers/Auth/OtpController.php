<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\OtpVerification;
use App\Models\User;

class OtpController extends Controller {
    public function sendOtp(Request $request) {
        $v = $request->validate(["email" => "required|email", "purpose" => "required|in:registration,reset_password"]);
        
        // 1. Check Identity Presence
        $userExists = User::where("email", $v["email"])->exists();
        
        if ($v["purpose"] === "registration" && $userExists) {
            return response()->json(["message" => "Identity already exists in ecosystem."], 422);
        }

        if ($v["purpose"] === "reset_password" && !$userExists) {
            return response()->json(["message" => "Account not found."], 404);
        }

        // 2. Pulse Generation
        $code = str_pad(rand(0, 999999), 6, "0", STR_PAD_LEFT);
        OtpVerification::where("email", $v["email"])->where("purpose", $v["purpose"])->delete();
        OtpVerification::create(["email" => $v["email"], "otp" => $code, "purpose" => $v["purpose"], "expires_at" => now()->addMinutes(15)]);

        // 3. Handshake Transmission
        try {
            if (env("MAIL_MAILER") === "log" || !env("MAIL_USERNAME")) {
                Log::info("OTP Pulse for {$v["email"]}: {$code}");
            } else {
                Mail::send("emails.otp", ["code" => $code], function ($m) use ($v, $code) {
                    $m->to($v["email"])->subject("ShopDee Identity Verification Pulse: $code");
                });
            }
            return response()->json(["message" => "Pulse synchronized."]);
        } catch (\Exception $e) {
            Log::error("OTP fail: " . $e->getMessage());
            return response()->json(["message" => "Pulse synchronized (Check logs)."]);
        }
    }
}
