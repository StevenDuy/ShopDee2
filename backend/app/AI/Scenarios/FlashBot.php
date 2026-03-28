<?php

namespace App\AI\Scenarios;

use App\Models\User;
use Illuminate\Support\Carbon;

class FlashBot extends BaseScenario {
    public function __construct() {
        parent::__construct('FLASH_BOT_MODULAR');
    }

    /**
     * @param array $params [ 'intensity', 'ms_delay', 'user_id' ]
     */
    public function run(array $params = []) {
        $count = $params['intensity'] ?? 1;
        $users = User::where('role', 'customer')->get();
        if ($users->isEmpty()) return "NO_CUSTOMERS_AVAILABLE";

        $logs = 0;
        for ($i = 0; $i < $count; $i++) {
            $user = isset($params['user_id']) ? User::find($params['user_id']) : $users->random();
            if (!$user) continue;

            $base_time = Carbon::now()->subMinutes(rand(1,600)); // Random past time
            
            // --- LOG 1: Page View (Start) ---
            $this->log([
                'user_id' => $user->id,
                'type' => 'PAGE_VIEW',
                'payload' => ['duration_ms' => 0],
                'created_at' => $base_time,
            ]);

            // --- LOG 2: Bot Click (Speed varies slightly but always inhumanly fast) ---
            $delay = $params['ms_delay'] ?? rand(10, 80); // 10ms to 80ms is inhuman
            
            $this->log([
                'user_id' => $user->id,
                'type' => 'CLICK_CHECKOUT',
                'payload' => ['duration_ms' => $delay],
                'created_at' => (clone $base_time)->addMilliseconds($delay),
            ]);

            $logs += 2;
        }

        return "SUCCESS: Injected $logs ultra-fast interactions for $count bot agents.";
    }
}
