<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hub extends Model
{
    protected $fillable = [
        'name', 'type', 'address', 'lat', 'lng', 
        'capacity', 'is_active'
    ];

    protected $casts = [
        'lat' => 'decimal:8',
        'lng' => 'decimal:8',
        'capacity' => 'integer',
        'is_active' => 'boolean',
    ];

    public function incomingTrips(): HasMany
    {
        return $this->hasMany(Trip::class, 'end_node_id');
    }

    public function outgoingTrips(): HasMany
    {
        return $this->hasMany(Trip::class, 'start_node_id');
    }
}
