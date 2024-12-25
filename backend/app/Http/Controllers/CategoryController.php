<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum'])->except(['index', 'show']);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::orderBy('name', 'asc')->get();
        if (!$categories) {
            return response()->json([
                'message' => 'No categories found'
            ], 404);
        }
        return response()->json([
            'data' => $categories
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
        ]);

        $category = new Category($data);
        $category->slug = Str::slug($category->name);
        $category->save();
        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::where('id', $id)->first();
        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        return response()->json([
            'category' => $category
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->validate([
            'name' => 'required',
        ]);

        $category = Category::where('id', $id)->first();
        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }
        $category->fill($data);
        $category->slug = Str::slug($category->name);
        $category->save();

        return response()->json([
            'message' => 'Category updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::where('id', $id)->first();
        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }
        $category->delete();
        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }
}
