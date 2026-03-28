<?php

namespace App\AI\Scenarios;

use App\Models\ActionLog;
use App\Models\Order;
use Illuminate\Support\Carbon;

abstract class BaseScenario {
    protected $scenarioId;

    public function __construct(string $id) {
        $this->scenarioId = $id;
    }

    /**
     * EVERY SCENARIO MUST IMPLEMENT THIS
     */
    abstract public function run(array $params = []);

    /**
     * HELPERS FOR SYNTHETIC DATA
     */
    protected function log(array $data) {
        return ActionLog::create(array_merge($data, [
            'is_synthetic_fraud' => true,
            'is_anomaly' => true,
            'fraud_scenario_id' => $this->scenarioId,
            'created_at' => $data['created_at'] ?? Carbon::now(),
        ]));
    }

    protected function createOrder(array $data) {
        return Order::create(array_merge($data, [
            'is_synthetic_fraud' => true,
            'fraud_scenario_id' => $this->scenarioId,
        ]));
    }
}
