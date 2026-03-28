<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ActionLog;
use Illuminate\Support\Carbon;

class CleanupLogs extends Command {
    protected $signature = 'app:cleanup-logs';
    protected $description = 'Deletes normal action logs older than 24 hours, but keeps anomalies forever.';

    public function handle() {
        $threshold = Carbon::now()->subDay();
        
        $count = ActionLog::where('is_anomaly', false)
            ->where('created_at', '<', $threshold)
            ->delete();

        $this->info("AI Sandbox Cleanup Complete. Removed $count routine logs.");
        $this->info("Preserved all anomalous research data.");
    }
}
