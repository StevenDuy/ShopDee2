<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductOptionValue extends Model
{
    protected $fillable = [
        'option_id', 'parent_id', 'value', 
        'price_adjustment', 'stock_quantity', 'sku', 'image'
    ];

    protected $casts = [
        'price_adjustment' => 'decimal:2',
        'stock_quantity' => 'integer',
    ];

    public function option(): BelongsTo
    {
        return $this->belongsTo(ProductOption::class, 'option_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ProductOptionValue::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(ProductOptionValue::class, 'parent_id');
    }
}
