<?php

namespace App\Services\Seller;

use App\Models\Product;
use App\Models\ProductOptionValue;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /**
     * Increment or Decrement Stock for Product or Variant
     */
    public function adjustStock(int $id, int $quantity, string $type = 'product')
    {
        return DB::transaction(function () use ($id, $quantity, $type) {
            if ($type === 'product') {
                $item = Product::findOrFail($id);
            } else {
                $item = ProductOptionValue::findOrFail($id);
            }

            if ($quantity > 0) {
                $item->increment('stock_quantity', $quantity);
            } else {
                $item->decrement('stock_quantity', abs($quantity));
            }

            // If it's a variant, we should also update parent product's cached stock
            if ($type === 'variant') {
                $product = $item->option->product;
                $this->syncProductStock($product);
            }

            return $item;
        });
    }

    /**
     * Recalculate and update the main product's total stock from all variants
     */
    public function syncProductStock(Product $product)
    {
        $totalStock = ProductOptionValue::whereHas('option', function($q) use ($product) {
            $q->where('product_id', $product->id);
        })->whereNull('parent_id')->sum('stock_quantity'); // Only count direct children if using 3-level

        // Actually, if using 3-level, the parent value stock is already the sum of sub-values?
        // Let's refine the logic to sum LEAF levels.
        $allValues = ProductOptionValue::whereHas('option', function($q) use ($product) {
            $q->where('product_id', $product->id);
        })->get();

        if ($allValues->isEmpty()) return;

        $leafNodes = $allValues->filter(function($val) {
            return $val->children()->count() === 0;
        });

        $product->update(['stock_quantity' => $leafNodes->sum('stock_quantity')]);
    }
}
