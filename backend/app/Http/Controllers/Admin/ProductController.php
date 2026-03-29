<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Tìm kiếm sản phẩm nhanh (dành cho Banner).
     */
    public function search(Request $request)
    {
        $query = $request->get('q');
        
        $products = Product::where('title', 'LIKE', "%{$query}%")
            ->limit(10)
            ->get(['id', 'title', 'base_price']);
            
        return response()->json($products);
    }
}
