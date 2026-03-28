<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActionLog extends Model {
    protected $fillable = [
        'user_id',
        'type',
        'is_anomaly',
        'is_synthetic_fraud',
        'fraud_scenario_id',
        'payload',
        'lat',
        'lng',
    ];

    protected $casts = [
        'payload' => 'json',
        'is_anomaly' => 'boolean',
        'is_synthetic_fraud' => 'boolean',
    ];

    // AI telemetry logs are usually immutable
    public $timestamps = false; // We use created_at from migration manually or default
    const UPDATED_AT = null;
}
