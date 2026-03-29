<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // --- 1. BANNERS (Marketing & AI Personalization) ---
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('image_url');
            $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('set null');
            $table->string('link')->nullable(); // Optional external link fallback
            $table->enum('position', ['home_hero', 'sale_banner', 'popup', 'sidebar'])->default('home_hero');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->string('cloudinary_id')->nullable();
            $table->timestamps();
        });

        // --- 2. SYSTEM SETTINGS (Global Constants) ---
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, json, boolean, number
            $table->string('group')->default('general'); // general, logistic, finance, ai
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('system_settings');
        Schema::dropIfExists('banners');
    }
};
