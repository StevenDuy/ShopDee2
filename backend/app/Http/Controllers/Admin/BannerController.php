<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

class BannerController extends Controller
{
    /**
     * Lấy danh sách toàn bộ banner.
     */
    public function index()
    {
        $banners = Banner::with('product')->paginate(10);
        return response()->json($banners);
    }

    /**
     * Tạo banner mới.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'subtitle' => 'sometimes|nullable|string|max:500',
            'image' => 'required|image|max:10240', // Max 10MB
            'product_id' => 'sometimes|nullable|exists:products,id',
            'link' => 'sometimes|nullable|string|max:1000',
            'position' => 'required|in:home_hero,sale_banner,popup,sidebar',
            'sort_order' => 'sometimes|nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['title', 'subtitle', 'product_id', 'link', 'position', 'sort_order']);

        if ($request->hasFile('image')) {
            try {
                Configuration::instance(env('CLOUDINARY_URL'));
                $uploadApi = new UploadApi();
                
                $file = $request->file('image');
                $result = $uploadApi->upload($file->getRealPath(), [
                    'folder' => 'shopdee/banners',
                ]);
                
                $data['image_url'] = $result['secure_url'];
                $data['cloudinary_id'] = $result['public_id'];
            } catch (\Exception $e) {
                Log::error('Banner Store Cloudinary Error: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Cloudinary upload failed',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

        $banner = Banner::create($data);

        return response()->json([
            'message' => 'Banner created successfully',
            'banner' => $banner->load('product')
        ], 201);
    }

    /**
     * Cập nhật banner.
     */
    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'subtitle' => 'sometimes|nullable|string|max:500',
            'image' => 'sometimes|nullable|image|max:10240',
            'product_id' => 'sometimes|nullable|exists:products,id',
            'link' => 'sometimes|nullable|string|max:1000',
            'position' => 'sometimes|in:home_hero,sale_banner,popup,sidebar',
            'sort_order' => 'sometimes|nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['title', 'subtitle', 'product_id', 'link', 'position', 'sort_order', 'is_active']);

        if ($request->hasFile('image')) {
            try {
                Configuration::instance(env('CLOUDINARY_URL'));
                $uploadApi = new UploadApi();

                // Delete old image if it exists
                if ($banner->cloudinary_id) {
                    try {
                        $uploadApi->destroy($banner->cloudinary_id);
                    } catch (\Exception $e) {
                        Log::warning('Banner Update Old Image Delete Fail: ' . $e->getMessage());
                    }
                }

                $file = $request->file('image');
                $result = $uploadApi->upload($file->getRealPath(), [
                    'folder' => 'shopdee/banners',
                ]);
                
                $data['image_url'] = $result['secure_url'];
                $data['cloudinary_id'] = $result['public_id'];
            } catch (\Exception $e) {
                Log::error('Banner Update Cloudinary Error: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Cloudinary upload failed during update',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

        $banner->update($data);

        return response()->json([
            'message' => 'Banner updated successfully',
            'banner' => $banner->load('product')
        ]);
    }

    /**
     * Xóa banner.
     */
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();

        return response()->json(['message' => 'Banner deleted successfully']);
    }

    /**
     * Bật/Tắt nhanh trạng thái banner.
     */
    public function toggleStatus($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->is_active = !$banner->is_active;
        $banner->save();

        return response()->json([
            'message' => 'Status toggled successfully',
            'is_active' => $banner->is_active
        ]);
    }
}
