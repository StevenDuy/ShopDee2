<?php

namespace App\AI\Scenarios;

use App\Models\User;
use Illuminate\Support\Carbon;

class GpsTeleportation extends BaseScenario {
    public function __construct() {
        parent::__construct('GPS_TELEPORT_MODULAR');
    }

    /**
     * @param array $params [ 'intensity', 'center_lat', 'center_lng', 'user_id', 'radius' ]
     */
    public function run(array $params = []) {
        $count = $params['intensity'] ?? 1;
        $users = User::where('role', 'shipper')->get();
        if ($users->isEmpty()) return "NO_SHIPPERS_AVAILABLE";

        $logs = 0;
        for ($i = 0; $i < $count; $i++) {
            $user = isset($params['user_id']) ? User::find($params['user_id']) : $users->random();
            if (!$user) continue;

            // --- POINT A: Start Position (Default or Random) ---
            $startLat = $params['center_lat'] ?? (10.0333 + (rand(-1000, 1000) / 10000));
            $startLng = $params['center_lng'] ?? (105.7833 + (rand(-1000, 1000) / 10000));
            
            $this->log([
                'user_id' => $user->id,
                'type' => 'GPS_TICK',
                'lat' => $startLat,
                'lng' => $startLng,
                'payload' => ['desc' => 'Normal telemetry start'],
                'created_at' => Carbon::now()->subMinutes(10),
            ]);

            // --- POINT B: Teleport (Impossible Jump - e.g. HCM) ---
            // We use a high offset for latitude or longitude to simulate teleportation.
            $teleportLat = $startLat + (rand(1, 2) === 1 ? 0.7 : -0.7); // Roughly 80km jump
            $teleportLng = $startLng + (rand(1, 2) === 1 ? 0.8 : -0.8);
            
            $this->log([
                'user_id' => $user->id,
                'type' => 'GPS_TICK',
                'lat' => $teleportLat,
                'lng' => $teleportLng,
                'payload' => ['desc' => 'CRITICAL: Teleport jump detected'],
                'created_at' => Carbon::now()->subMinutes(5),
            ]);

            $logs += 2;
        }

        return "SUCCESS: Injected $logs teleportation ticks for $count agents.";
    }
}
