<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // --- 1. FINANCIAL WALLETS (Core & AI Sandbox) ---
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('balance', 15, 2)->default(0.00);
            $table->decimal('escrow_balance', 15, 2)->default(0.00); // Pending commission (Escrow)
            $table->string('currency')->default('VND'); // New: Multi-currency support
            $table->timestamps();
        });

        // --- 2. COMMERCE ORDERS (Inherited & Sandbox Logistics) ---
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->decimal('total_amount', 15, 2);
            $table->decimal('shipping_fee', 15, 2)->default(0.00);
            $table->enum('status', [
                'pending', 'paid', 'confirmed', 'hub_transfer', 
                'out_for_delivery', 'delivered', 'completed', 'cancelled', 'refunded'
            ])->default('pending');
            $table->string('payment_method')->default('cod'); // cod, wallet, etc.
            $table->string('payment_status')->default('unpaid');
            $table->foreignId('address_id')->nullable()->constrained('addresses')->onDelete('set null');
            $table->boolean('is_anomaly')->default(false); // Sandbox: Fraud detection
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // --- 3. ORDER ITEMS (Depth & Variants) ---
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('set null');
            $table->string('product_title'); // Snapshot at time of purchase
            $table->decimal('price', 15, 2); // Price at time of purchase
            $table->integer('quantity')->default(1);
            $table->json('selected_options')->nullable(); // Legacy: Store selected variant labels
            $table->json('variant_ids')->nullable(); // Integration: New variant mapping
            $table->timestamps();
        });

        // --- 4. SELLER FINANCES ---
        Schema::create('seller_finances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['income', 'withdrawal', 'refund', 'penalty']);
            $table->decimal('amount', 15, 2);
            $table->string('status')->default('completed'); // pending, completed, failed
            $table->text('description')->nullable();
            $table->string('reference_order_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('seller_finances');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('wallets');
    }
};
