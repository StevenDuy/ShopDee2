<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // --- 1. EXTENDED USERS TABLE ---
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role')->default('customer'); // customer, seller, shipper, linehaul, admin
            $table->float('trust_score', 8, 2)->default(100.00); // Max 100
            $table->boolean('is_online')->default(false);
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // --- 2. LOGISTICS HUBS ---
        Schema::create('hubs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('transit'); // storage, transit, handover
            $table->decimal('lat', 10, 8);
            $table->decimal('lng', 11, 8);
            $table->integer('capacity')->default(1000); // Goods current limit
            $table->timestamps();
        });

        // --- 3. PRODUCTS & DYNAMIC PRICING ---
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users');
            $table->string('name');
            $table->string('image')->nullable();
            $table->decimal('base_price', 12, 2);
            $table->decimal('current_price', 12, 2); // Managed by AI
            $table->integer('stock')->default(0);
            $table->timestamps();
        });

        // --- 4. COMMERCE ORDERS ---
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users');
            $table->foreignId('product_id')->constrained('products');
            $table->decimal('amount', 12, 2);
            $table->string('status')->default('pending'); // pending, paid, hub_transfer, out_for_delivery, delivered
            $table->timestamps();
        });

        // --- 5. LOGISTICS TRIPS (Handover Chain) ---
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->foreignId('driver_id')->constrained('users');
            $table->foreignId('start_node_id')->nullable(); // Hub ID or Seller ID
            $table->foreignId('end_node_id')->nullable();   // Hub ID or Customer ID
            $table->enum('type', ['seller_to_hub', 'hub_to_hub', 'hub_to_customer']);
            $table->string('status')->default('assigned'); // assigned, started, finished, delay_warning
            $table->timestamps();
        });

        // --- 6. FINANCIAL WALLETS (Auto-Escrow) ---
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('balance', 15, 2)->default(0.00);
            $table->decimal('escrow_balance', 15, 2)->default(0.00); // Pending commission
            $table->timestamps();
        });

        // --- 7. THE BRAIN: ACTION LOGS (AI Behavioral Dataset) ---
        Schema::create('action_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->string('type'); // GPS_TICK, CLICK_INTERACTION, PRICE_CHANGE, HANDOVER_START
            $table->json('payload'); // Granular metadata: speed, signal_strength, click_path
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->timestamp('created_at'); // Precise telemetry timestamp
        });
    }

    public function down(): void {
        Schema::dropIfExists('action_logs');
        Schema::dropIfExists('wallets');
        Schema::dropIfExists('trips');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('products');
        Schema::dropIfExists('hubs');
        Schema::dropIfExists('users');
    }
};
