<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('action_logs', function (Blueprint $table) {
            $table->boolean('is_anomaly')->default(false)->after('type'); // Mark behavior as suspicious
            $table->index('is_anomaly'); // For fast cleanup later
            $table->index('created_at'); // For time-based cleanup
        });
    }

    public function down(): void {
        Schema::table('action_logs', function (Blueprint $table) {
            $table->dropColumn('is_anomaly');
        });
    }
};
