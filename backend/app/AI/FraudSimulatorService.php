<?php

namespace App\AI;

use App\AI\Scenarios\GpsTeleportation;
use App\AI\Scenarios\FlashBot;
use Illuminate\Support\Facades\Log;

class FraudSimulatorService {
    /**
     * CENTRAL REGISTRY OF ALL SCENARIOS
     */
    protected $scenarios = [
        'gps_teleport' => GpsTeleportation::class,
        'flash_bot' => FlashBot::class,
        // Add more scenarios here as separate files...
    ];

    /**
     * UNIVERSAL DISPATCHER (Execute by Name)
     */
    public function execute(string $name, array $params = []) {
        if (!isset($this->scenarios[$name])) {
            return "ERROR: Scenario '$name' not found in AI Hub.";
        }

        $class = $this->scenarios[$name];
        $scenario = new $class();
        
        Log::info("AI Sandbox: Executing '$name' with params.", $params);
        return $scenario->run($params);
    }

    /**
     * RETURN LIST OF ALL SCENARIOS FOR ADMIN PANEL
     */
    public function listScenarios() {
        return array_keys($this->scenarios);
    }
}
