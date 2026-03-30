<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductMedia;
use App\Models\ProductAttribute;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Cloudinary\Api\Upload\UploadApi;

class ProductController extends Controller
{
    public function uploadMedia(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,mp4,mov|max:10240', // 10MB limit
        ]);

        try {
            $file = $request->file('file');
            $type = Str::contains($file->getMimeType(), 'video') ? 'video' : 'image';
            
            $upload = (new UploadApi())->upload($file->getRealPath(), [
                'folder' => 'shopdee/products',
                'resource_type' => 'auto',
            ]);

            return response()->json([
                'url' => $upload['secure_url'],
                'type' => $type,
                'cloudinary_id' => $upload['public_id']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function index(Request $request)
    {
        // For now, return all since we don't have strict seller_id filtering yet
        $products = Product::with(['media', 'category', 'options.values', 'attributes'])->paginate(10);
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'base_price' => 'nullable|numeric',
            'stock_quantity' => 'nullable|integer',
            'media' => 'nullable|array',
            'specifications' => 'nullable|array',
            'options' => 'nullable|array',
        ]);

        return DB::transaction(function () use ($v, $request) {
            $product = Product::create([
                'seller_id' => $request->user() ? $request->user()->id : 1,
                'category_id' => $v['category_id'],
                'title' => $v['title'],
                'slug' => Str::slug($v['title']) . '-' . uniqid(),
                'description' => $v['description'] ?? '',
                'base_price' => $v['base_price'] ?? 0,
                'current_price' => $v['base_price'] ?? 0,
                'stock_quantity' => $v['stock_quantity'] ?? 0,
                'status' => 'active',
            ]);

            $this->saveProductRelations($product, $v);
            return response()->json($product->load(['media', 'options.values', 'attributes']), 201);
        });
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $v = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'base_price' => 'nullable|numeric',
            'stock_quantity' => 'nullable|integer',
            'media' => 'nullable|array',
            'specifications' => 'nullable|array',
            'options' => 'nullable|array',
        ]);

        return DB::transaction(function () use ($v, $product) {
            $product->update([
                'category_id' => $v['category_id'],
                'title' => $v['title'],
                'description' => $v['description'] ?? '',
                'base_price' => $v['base_price'] ?? 0,
                'current_price' => $v['base_price'] ?? 0,
                'stock_quantity' => $v['stock_quantity'] ?? 0,
            ]);

            // Clear old relations to refresh
            $product->media()->delete();
            $product->attributes()->delete();
            $product->options()->each(function($opt) { $opt->values()->delete(); $opt->delete(); });

            $this->saveProductRelations($product, $v);
            return response()->json($product->load(['media', 'options.values', 'attributes']));
        });
    }

    private function saveProductRelations($product, $data)
    {
        // Handle Media
        if (!empty($data['media'])) {
            $userHasPrimary = collect($data['media'])->contains('is_primary', true);
            foreach ($data['media'] as $index => $item) {
                $isPrimary = $item['is_primary'] ?? false;
                if (!$userHasPrimary && $index === 0 && $item['type'] === 'image') {
                    $isPrimary = true;
                }
                ProductMedia::create([
                    'product_id' => $product->id,
                    'url' => $item['url'],
                    'type' => $item['type'],
                    'is_primary' => $isPrimary,
                    'cloudinary_id' => $item['cloudinary_id'] ?? null,
                ]);
            }
        }

        // Handle Specifications
        if (!empty($data['specifications'])) {
            foreach ($data['specifications'] as $spec) {
                if (!empty($spec['name']) && !empty($spec['value'])) {
                    ProductAttribute::create([
                        'product_id' => $product->id,
                        'name' => $spec['name'],
                        'value' => $spec['value'],
                    ]);
                }
            }
        }

        // Handle Options & Variants
        if (!empty($data['options'])) {
            $option = ProductOption::create(['product_id' => $product->id, 'name' => 'Classification']);
            $totalStock = 0; $minPrice = PHP_FLOAT_MAX; $hasOptions = false;

            foreach ($data['options'] as $optData) {
                $parentVal = ProductOptionValue::create([
                    'option_id' => $option->id,
                    'value' => $optData['name'] ?? $optData['value'] ?? '',
                    'parent_id' => null,
                    'price_adjustment' => !empty($optData['sub_options']) ? 0 : ($optData['price'] ?? 0),
                    'stock_quantity' => !empty($optData['sub_options']) ? 0 : ($optData['stock'] ?? 0),
                ]);

                if (!empty($optData['sub_options'])) {
                    foreach ($optData['sub_options'] as $subOpt) {
                        ProductOptionValue::create([
                            'option_id' => $option->id,
                            'value' => $subOpt['value'],
                            'parent_id' => $parentVal->id,
                            'price_adjustment' => $subOpt['price'] ?? 0,
                            'stock_quantity' => $subOpt['stock'] ?? 0,
                        ]);
                        $totalStock += ($subOpt['stock'] ?? 0);
                        $price = $subOpt['price'] ?? 0;
                        if ($price < $minPrice) $minPrice = $price;
                        $hasOptions = true;
                    }
                } else {
                    $totalStock += ($optData['stock'] ?? 0);
                    $price = $optData['price'] ?? 0;
                    if ($price < $minPrice) $minPrice = $price;
                    $hasOptions = true;
                }
            }

            if ($hasOptions) {
                $product->update([
                    'base_price' => $minPrice == PHP_FLOAT_MAX ? 0 : $minPrice,
                    'stock_quantity' => $totalStock,
                ]);
            }
        }
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
    public function toggleStatus($id)
    {
        $product = Product::findOrFail($id);
        $product->status = ($product->status === 'active') ? 'inactive' : 'active';
        $product->save();

        return response()->json([
            'message' => 'Status toggled successfully',
            'status' => $product->status
        ]);
    }
}
