<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function activeBanners()
    {
        // Only return active banners, sorted by order
        $banners = Banner::where('is_active', true)
            ->with(['product'])
            ->orderBy('sort_order', 'asc')
            ->get();
            
        return response()->json($banners);
    }
}
