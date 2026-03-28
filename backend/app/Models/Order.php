<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model {
    protected $fillable = [
        'customer_id',
        'product_id',
        'amount',
        'status',
        'is_synthetic_fraud',
        'fraud_scenario_id',
    ];

    protected $casts = [
        'is_synthetic_fraud' => 'boolean',
    ];
}
