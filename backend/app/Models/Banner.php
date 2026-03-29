<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subtitle',
        'image_url',
        'product_id',
        'link',
        'position',
        'is_active',
        'sort_order',
        'cloudinary_id',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Tự động sắp xếp banner theo sort_order mặc định.
     */
    protected static function booted()
    {
        static::addGlobalScope('ordered', function ($query) {
            $query->orderBy('sort_order', 'asc')->orderBy('created_at', 'desc');
        });
    }
}
