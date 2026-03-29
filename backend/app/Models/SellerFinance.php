<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerFinance extends Model
{
    protected $fillable = [
        'seller_id', 'type', 'amount', 'status', 
        'description', 'reference_order_id'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
