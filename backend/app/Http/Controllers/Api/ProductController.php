<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->get('type'); // 'new', 'top', or null for all
        
        $query = Product::with(['media', 'category', 'seller'])
            ->where('status', 'active');

        if ($type === 'new') {
            $query->latest();
        } elseif ($type === 'top') {
            // Mocking top products by rating_cache or random for now
            $query->orderBy('rating_cache', 'desc');
        }

        $products = $query->paginate(12);
        
        return response()->json($products);
    }
}
