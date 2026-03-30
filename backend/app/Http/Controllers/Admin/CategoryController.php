<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Lấy danh sách danh mục (mặc định lấy theo cây).
     */
    public function index()
    {
        $categories = Category::root()->with('children')->paginate(10);
        return response()->json($categories);
    }

    /**
     * Tạo danh mục mới.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
            'slug' => 'sometimes|nullable|string|unique:categories,slug',
            'image' => 'sometimes|nullable|string',
            'parent_id' => 'sometimes|nullable|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // Kiểm tra cấp độ (Giới hạn 3 cấp theo yêu cầu)
        if (!empty($data['parent_id'])) {
            $parent = Category::find($data['parent_id']);
            if ($parent->level >= 2) {
                return response()->json(['message' => 'Maximum category depth (2) reached.'], 422);
            }
        }

        $category = Category::create($data);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ], 201);
    }

    /**
     * Cập nhật danh mục.
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:categories,name,' . $id,
            'slug' => 'sometimes|nullable|string|unique:categories,slug,' . $id,
            'image' => 'sometimes|nullable|string',
            'parent_id' => 'sometimes|nullable|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // Ngăn chặn việc lồng chính mình hoặc lồng quá sâu
        if (isset($data['parent_id'])) {
            if ($data['parent_id'] == $id) {
                return response()->json(['message' => 'Cannot set self as parent.'], 422);
            }
            $parent = Category::find($data['parent_id']);
            if ($parent->level >= 2) {
                return response()->json(['message' => 'Maximum category depth (2) reached.'], 422);
            }
        }

        $category->update($data);

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category
        ]);
    }

    /**
     * Xóa danh mục.
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete(); // Migration handles cascade delete

        return response()->json(['message' => 'Category and its descendants deleted successfully']);
    }

    /**
     * Lấy danh sách phẳng (Flat list) cho các dropdown chọn Parent.
     */
    public function getList()
    {
        // Get root categories with their children eager loaded
        $roots = Category::root()->with('children')->get();
        
        $flatList = collect();
        
        foreach ($roots as $root) {
            // Add Parent
            $flatList->push([
                'id' => $root->id,
                'name' => $root->name,
                'parent_id' => null,
                'parent_name' => null,
                'display_name' => $root->name
            ]);
            
            // Add Children
            foreach ($root->children as $child) {
                $flatList->push([
                    'id' => $child->id,
                    'name' => $child->name,
                    'parent_id' => $child->parent_id,
                    'parent_name' => $root->name,
                    'display_name' => "{$root->name} > {$child->name}"
                ]);
            }
        }
            
        return response()->json($flatList);
    }
}
