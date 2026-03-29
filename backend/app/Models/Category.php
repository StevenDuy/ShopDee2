<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'image',
        'parent_id',
    ];

    /**
     * Tự động tạo slug nếu không được cung cấp.
     */
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    /**
     * Lấy danh mục cha.
     */
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Lấy các danh mục con.
     */
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id')->with('children');
    }

    /**
     * Lấy tất cả các sản phẩm thuộc danh mục này.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Scope lấy các danh mục cấp cao nhất (Root).
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Tính toán cấp độ của danh mục (tối đa 3 cấp).
     */
    public function getLevelAttribute()
    {
        $level = 1;
        $parent = $this->parent;
        while ($parent) {
            $level++;
            $parent = $parent->parent;
        }
        return $level;
    }
}
