<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // --- Enhance Action Logs ---
        Schema::table('action_logs', function (Blueprint $table) {
            $table->boolean('is_synthetic_fraud')->default(false)->after('is_anomaly');
            $table->string('fraud_scenario_id')->nullable()->after('is_synthetic_fraud');
            $table->index(['is_synthetic_fraud', 'fraud_scenario_id']);
        });

        // --- Enhance Orders ---
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('is_synthetic_fraud')->default(false);
            $table->string('fraud_scenario_id')->nullable();
        });
    }

    public function down(): void {
        Schema::table('action_logs', function (Blueprint $table) {
            $table->dropColumn(['is_synthetic_fraud', 'fraud_scenario_id']);
        });
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['is_synthetic_fraud', 'fraud_scenario_id']);
        });
    }
};
