<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Skip check in console (e.g., when running artisan clear)
        if (!$this->app->runningInConsole()) {
            $requiredApis = [
                // APP & GENERAL
                'APP_NAME' => env('APP_NAME'),
                'APP_ENV' => env('APP_ENV'),
                'APP_KEY' => env('APP_KEY'),
                'APP_DEBUG' => env('APP_DEBUG'),
                'APP_URL' => env('APP_URL'),
                'APP_TIMEZONE' => env('APP_TIMEZONE'),
                'SESSION_DRIVER' => env('SESSION_DRIVER'),
                'CACHE_STORE' => env('CACHE_STORE'),
                'APP_LOCALE' => env('APP_LOCALE'),
                'APP_FALLBACK_LOCALE' => env('APP_FALLBACK_LOCALE'),
                'FRONTEND_URL' => env('FRONTEND_URL'),
                'SESSION_DOMAIN' => env('SESSION_DOMAIN'),
                // DATABASE
                'DB_CONNECTION' => env('DB_CONNECTION'),
                'DB_HOST' => env('DB_HOST'),
                'DB_PORT' => env('DB_PORT'),
                'DB_DATABASE' => env('DB_DATABASE'),
                'DB_USERNAME' => env('DB_USERNAME'),
                // PUSHER
                'BROADCAST_CONNECTION' => env('BROADCAST_CONNECTION'),
                'PUSHER_APP_ID' => env('PUSHER_APP_ID'),
                'PUSHER_APP_KEY' => [
                    'val' => env('PUSHER_APP_KEY'),
                    'pattern' => '/^[a-f0-9]{20}$/',
                    'help' => '20-character hex string'
                ],
                'PUSHER_APP_SECRET' => [
                    'val' => env('PUSHER_APP_SECRET'),
                    'pattern' => '/^[a-f0-9]{20}$/',
                    'help' => '20-character hex string'
                ],
                'PUSHER_APP_CLUSTER' => env('PUSHER_APP_CLUSTER'),
                // CLOUDINARY
                'CLOUDINARY_URL' => env('CLOUDINARY_URL'),
                'CLOUDINARY_CLOUD_NAME' => env('CLOUDINARY_CLOUD_NAME'),
                'CLOUDINARY_API_KEY' => env('CLOUDINARY_API_KEY'),
                'CLOUDINARY_API_SECRET' => env('CLOUDINARY_API_SECRET'),
                // GOOGLE OAUTH
                'GOOGLE_CLIENT_ID' => [
                    'val' => env('GOOGLE_CLIENT_ID'),
                    'pattern' => '/\.apps\.googleusercontent\.com$/',
                    'help' => 'Must end with .apps.googleusercontent.com'
                ],
                'GOOGLE_CLIENT_SECRET' => [
                    'val' => env('GOOGLE_CLIENT_SECRET'),
                    'pattern' => '/^GOCSPX-/',
                    'help' => 'Usually starts with GOCSPX-'
                ],
                'GOOGLE_REDIRECT_URL' => env('GOOGLE_REDIRECT_URL'),
                // MAIL
                'MAIL_MAILER' => env('MAIL_MAILER'),
                'MAIL_HOST' => env('MAIL_HOST'),
                'MAIL_PORT' => env('MAIL_PORT'),
                'MAIL_USERNAME' => env('MAIL_USERNAME'),
                'MAIL_PASSWORD' => [
                    'val' => env('MAIL_PASSWORD'),
                    'pattern' => '/^[a-z ]{16,20}$/',
                    'help' => '16-character Google App Password'
                ],
                'MAIL_ENCRYPTION' => env('MAIL_ENCRYPTION'),
                // TUNNEL
                'CLOUDFLARE_TUNNEL_URL' => [
                    'val' => env('CLOUDFLARE_TUNNEL_URL'),
                    'pattern' => '/^https?:\/\//',
                    'help' => 'Valid http:// or https:// URL'
                ],
            ];

            foreach ($requiredApis as $key => $check) {
                // Determine if it's a simple check or regex check
                $isConfigArray = is_array($check);
                $val = $isConfigArray ? $check['val'] : $check;
                $val = trim((string)$val, " \t\n\r\0\x0B\"'");
                
                $invalid = false;
                $helpMsg = "This variable is required and cannot be empty.";

                if (empty($val) || str_contains($val, 'NHẬP_')) {
                    $invalid = true;
                } elseif ($isConfigArray) {
                    $pattern = $check['pattern'];
                    // Custom overrides for dynamic regex
                    if ($key === 'GOOGLE_CLIENT_ID') $pattern = '/\.apps\.googleusercontent\.com$/i';
                    if ($key === 'MAIL_PASSWORD') $pattern = '/^[a-z ]{16,20}$/i';
                    
                    if (!preg_match($pattern, $val)) {
                        $invalid = true;
                        $helpMsg = $check['help'];
                    }
                }

                if ($invalid) {
                    // If it's an API request or frontend call, return JSON
                    if (Request::expectsJson() || Request::is('api/*')) {
                        header('Access-Control-Allow-Origin: *');
                        header('Content-Type: application/json', true, 503);
                        echo json_encode([
                            'error' => 'API Configuration Error',
                            'message' => "Invalid or missing variable in backend/.env",
                            'key' => $key,
                            'help' => $helpMsg
                        ]);
                        exit;
                    }

                    // Otherwise, return full HTML Error UI (in English)
                    $html = "
                    <body style='background: #000 !important; color: #fff !important; font-family: ui-monospace, monospace; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;'>
                        <div style='max-width: 600px; text-align: center; border: 1px solid #333; padding: 40px; border-radius: 20px; background: #050505;'>
                            <h1 style='color: #ff3333; font-size: 20px; font-weight: bold; margin-bottom: 20px;'>API BACKEND ERROR</h1>
                            <div style='margin-bottom: 30px;'>
                                <p style='color: #666; font-size: 11px; text-transform: uppercase;'>Problematic Variable</p>
                                <h2 style='color: #fff; font-size: 32px; margin: 5px 0;'>{$key}</h2>
                                <p style='color: #ea580c; font-size: 14px; font-weight: bold;'>File: backend/.env</p>
                            </div>
                            <div style='background: #111; padding: 20px; border-radius: 12px; text-align: left; border-left: 4px solid #ff3333;'>
                                <p style='color: #888; font-size: 12px; margin-bottom: 10px;'>EXPECTED FORMAT:</p>
                                <p style='color: #00ff00; font-size: 14px; margin: 0;'>{$helpMsg}</p>
                            </div>
                        </div>
                    </body>";
                    die($html);
                }
            }
        }
    }
}
