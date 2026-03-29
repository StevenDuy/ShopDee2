<?php

namespace App\Services\Seller;

use App\Models\Product;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\ActionLog;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductService
{
    /**
     * Create or Update Product with Attributes
     */
    public function saveProduct(array $data, ?int $productId = null)
    {
        return DB::transaction(function () use ($data, $productId) {
            $productData = [
                'seller_id'      => auth()->id(),
                'category_id'    => $data['category_id'],
                'title'          => $data['title'],
                'description'    => $data['description'],
                'base_price'     => $data['base_price'],
                'current_price'  => $data['base_price'], // Initial sync
                'stock_quantity' => $data['stock_quantity'] ?? 0,
                'status'         => $data['status'] ?? 'active',
            ];

            if (!$productId) {
                $productData['slug'] = Str::slug($data['title']) . '-' . uniqid();
                $productData['sku'] = strtoupper(uniqid('SKU-'));
                $product = Product::create($productData);
            } else {
                $product = Product::findOrFail($productId);
                $product->update($productData);
                // Re-slug if title changed
                if ($product->wasChanged('title')) {
                    $product->update(['slug' => Str::slug($data['title']) . '-' . $product->id]);
                }
            }

            // Sync Attributes
            if (isset($data['attributes'])) {
                $product->attributes()->delete();
                $product->attributes()->createMany($data['attributes']);
            }

            // AI Telemetry: Log Action
            ActionLog::create([
                'user_id' => auth()->id(),
                'type' => 'PRODUCT_SAVE',
                'payload' => [
                    'product_id' => $product->id,
                    'action' => $productId ? 'update' : 'create',
                    'base_price' => $product->base_price
                ],
                'created_at' => now()
            ]);

            return $product->load(['category', 'attributes']);
        });
    }

    /**
     * Sync Multi-level Variants (Options -> Values -> Sub-values)
     */
    public function syncVariants(Product $product, array $optionsData)
    {
        return DB::transaction(function () use ($product, $optionsData) {
            // Delete existing variant layers
            $product->options()->each(function ($option) {
                $option->values()->delete(); 
                $option->delete();
            });

            foreach ($optionsData as $optItem) {
                $option = ProductOption::create([
                    'product_id' => $product->id,
                    'name' => $optItem['name']
                ]);

                foreach ($optItem['values'] as $valItem) {
                    $parentValue = ProductOptionValue::create([
                        'option_id' => $option->id,
                        'parent_id' => null,
                        'value' => $valItem['value'],
                        'price_adjustment' => $valItem['price_adjustment'] ?? 0,
                        'stock_quantity' => $valItem['stock_quantity'] ?? 0,
                        'sku' => $valItem['sku'] ?? null,
                    ]);

                    // Sub-values (Depth 3)
                    if (isset($valItem['sub_values']) && is_array($valItem['sub_values'])) {
                        foreach ($valItem['sub_values'] as $subItem) {
                            if (!empty(trim($subItem['value'] ?? ''))) {
                                ProductOptionValue::create([
                                    'option_id' => $option->id,
                                    'parent_id' => $parentValue->id,
                                    'value' => $subItem['value'],
                                    'price_adjustment' => $subItem['price_adjustment'] ?? 0,
                                    'stock_quantity' => $subItem['stock_quantity'] ?? 0,
                                    'sku' => $subItem['sku'] ?? null,
                                ]);
                            }
                        }
                    }
                }
            }

            // Auto-aggregate Stock from variants to parent product
            $this->aggregateStock($product);

            return $product->load('options.values.children');
        });
    }

    /**
     * Calculate total stock and min price from variants
     */
    private function aggregateStock(Product $product)
    {
        $allValues = ProductOptionValue::whereHas('option', function($q) use ($product) {
            $q->where('product_id', $product->id);
        })->get();

        // If no variants, stick with product base info
        if ($allValues->isEmpty()) return;

        // Stock = Sum of leaf nodes (nodes with no children)
        $leafNodes = $allValues->filter(function($val) {
            return $val->parent_id !== null || $val->children()->count() === 0;
        });

        $totalStock = $leafNodes->sum('stock_quantity');
        $minPrice = $product->base_price + $allValues->min('price_adjustment');

        $product->update([
            'stock_quantity' => $totalStock,
            'current_price' => $minPrice
        ]);
    }
}
