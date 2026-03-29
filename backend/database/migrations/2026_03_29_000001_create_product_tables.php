<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // --- 1. CATEGORIES ---
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('cascade');
            $table->timestamps();
        });

        // --- 2. PRODUCTS (Base Logic + AI Sandbox) ---
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description')->nullable();
            $table->decimal('base_price', 15, 2); // Standard base price
            $table->decimal('current_price', 15, 2); // Sandbox: Dynamic price managed by AI
            $table->unsignedInteger('stock_quantity')->default(0);
            $table->string('sku')->nullable()->unique();
            $table->enum('status', ['draft', 'active', 'inactive', 'banned'])->default('draft');
            $table->float('rating_cache', 3, 2)->default(0.00); // Optimized rating
            $table->boolean('is_anomaly')->default(false); // Sandbox: Fraud detection
            $table->softDeletes(); // Security: Recoverable deletion
            $table->timestamps();
        });

        // --- 3. PRODUCT OPTIONS (Variants Layer 1) ---
        Schema::create('product_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('name'); // e.g., Color, Size
            $table->timestamps();
        });

        // --- 4. PRODUCT OPTION VALUES (Variants Layer 2 & 3 / Granular Separation) ---
        Schema::create('product_option_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('option_id')->constrained('product_options')->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('product_option_values')->onDelete('cascade'); // Deep structure support
            $table->string('value'); // e.g., Red, Blue / L, XL
            $table->decimal('price_adjustment', 15, 2)->default(0.00); // Logic: Extra price
            $table->unsignedInteger('stock_quantity')->default(0);
            $table->string('sku')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        // --- 5. PRODUCT MEDIA ---
        Schema::create('product_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('url');
            $table->string('type')->default('image'); // image, video
            $table->boolean('is_primary')->default(false);
            $table->string('cloudinary_id')->nullable(); // Integration: Cloudinary
            $table->timestamps();
        });

        // --- 6. PRODUCT ATTRIBUTES ---
        Schema::create('product_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('name');
            $table->string('value');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('product_attributes');
        Schema::dropIfExists('product_media');
        Schema::dropIfExists('product_option_values');
        Schema::dropIfExists('product_options');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
