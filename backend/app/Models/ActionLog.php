<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActionLog extends Model {
    protected $fillable = ['user_id', 'type', 'payload', 'lat', 'lng', 'is_anomaly'];
    protected $casts = ['payload' => 'json', 'is_anomaly' => 'boolean'];
    public $timestamps = false;
}
