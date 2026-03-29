<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // --- 1. LOGISTICS HUBS ---
        Schema::create('hubs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('transit'); // storage, transit, handover
            $table->string('address')->nullable();
            $table->decimal('lat', 10, 8);
            $table->decimal('lng', 11, 8);
            $table->integer('capacity')->default(1000);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // --- 2. LOGISTICS TRIPS (The Chain of Custody) ---
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('driver_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('start_node_id')->nullable(); // Hub ID or User ID (Seller/Hub)
            $table->unsignedBigInteger('end_node_id')->nullable();   // Hub ID or User ID (Hub/Customer)
            $table->enum('type', ['seller_to_hub', 'hub_to_hub', 'hub_to_customer']);
            $table->enum('status', ['assigned', 'started', 'finished', 'delayed', 'cancelled'])->default('assigned');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // --- 3. THE BRAIN: ACTION LOGS (AI Behavioral Dataset) ---
        Schema::create('action_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('type'); // GPS_TICK, INTERACTION, PRICE_CHANGE, AUTH_ATTEMPT
            $table->json('payload'); // Granular metadata: hardware, signal, speed, path
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->boolean('is_anomaly')->default(false); // Sandbox: Mark for AI Training
            $table->timestamp('created_at'); // Telemetry timestamp
        });
    }

    public function down(): void {
        Schema::dropIfExists('action_logs');
        Schema::dropIfExists('trips');
        Schema::dropIfExists('hubs');
    }
};
