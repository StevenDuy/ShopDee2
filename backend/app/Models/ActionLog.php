<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActionLog extends Model
{
    public $timestamps = false; // Using custom created_at

    protected $fillable = [
        'user_id', 'type', 'payload', 'lat', 'lng', 
        'is_anomaly', 'created_at'
    ];

    protected $casts = [
        'payload' => 'array',
        'lat' => 'decimal:8',
        'lng' => 'decimal:8',
        'is_anomaly' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
