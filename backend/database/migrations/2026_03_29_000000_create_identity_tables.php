<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // --- 1. ROLES ---
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // admin, seller, customer, shipper, linehaul
            $table->string('display_name')->nullable();
            $table->timestamps();
        });

        // --- 2. USERS (Inherited & Enhanced) ---
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->foreignId('role_id')->nullable()->constrained('roles')->onDelete('set null');
            $table->string('google_id')->nullable();
            $table->string('currency_role')->default('VND'); // New: Currency management
            $table->float('trust_score', 8, 2)->default(100.00); // Sandbox: Fraud detection
            $table->boolean('is_online')->default(false);
            $table->boolean('is_banned')->default(false);
            $table->timestamp('banned_until')->nullable();
            $table->text('ban_reason')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // --- 3. USER PROFILES ---
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('phone')->nullable();
            $table->string('avatar_url')->nullable();
            $table->decimal('lat', 10, 8)->nullable(); // Sandbox: Location tracking
            $table->decimal('lng', 11, 8)->nullable(); // Sandbox: Location tracking
            $table->timestamps();
        });

        // --- 4. ADDRESSES ---
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('receiver_name');
            $table->string('receiver_phone');
            $table->string('province');
            $table->string('district');
            $table->string('ward');
            $table->string('detail_address');
            $table->string('type')->default('home'); // home, office
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        // --- 5. OTP VERIFICATIONS ---
        Schema::create('otp_verifications', function (Blueprint $table) {
            $table->id();
            $table->string('email')->index();
            $table->string('otp');
            $table->string('purpose')->nullable(); // Extended: registration, login, etc.
            $table->timestamp('expires_at');
            $table->boolean('is_used')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('otp_verifications');
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('user_profiles');
        Schema::dropIfExists('users');
        Schema::dropIfExists('roles');
    }
};
