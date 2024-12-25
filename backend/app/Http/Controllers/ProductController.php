<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductCreateRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Toko;
use App\Traits\HasDestroyProduct;
use App\Traits\HasRandomString;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

use function PHPUnit\Framework\isEmpty;

class ProductController extends Controller
{
    use HasRandomString, HasDestroyProduct;

    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'getProductByCategory', 'search', 'showTokoProduct', 'showAllTokoProducts']);
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::query();
        if ($request->has('desc')) {
            $query->orderBy('created_at', 'desc'); // Mengurutkan berdasarkan tanggal pembuatan terbaru
        } else if ($request->has('asc')) {
            $query->orderBy('created_at', 'asc'); // Mengurutkan berdasarkan tanggal pembuatan terlama
        }

        if ($request->has('limit')) {
            $query->take($request->limit);
        }

        $products = $query->get();
        if (!$products) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return ProductResource::collection($products);
    }

    public function search(Request $request, string $keyword)
    {
        $sort = $request->input('sort', '');
        $search = trim($keyword);
        $query = Product::query();

        if (!empty($search)) {
            $query->where(function ($query) use ($keyword) {
                $query->where('products.name', 'like', '%' . $keyword . '%')
                    ->orWhere('description', 'like', '%' . $keyword . '%')
                    ->orWhereHas('toko', function ($query) use ($keyword) {
                        $query->where('name', 'like', "%$keyword%");
                    });
            });
        }

        if ($sort === 'sales') {
            // $query->orderBy('sales_count', 'desc');
            $query->latest(); // sementara set latest
        } elseif ($sort === 'high-price') {
            $query->orderBy('price', 'desc');
        } elseif ($sort === 'low-price') {
            $query->orderBy('price', 'asc');
        } elseif ($sort === 'latest') {
            $query->latest();
        }

        $products = $query->get();

        if ($products->isEmpty()) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }
        return ProductResource::collection($products);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductCreateRequest $request)
    {
        $data = $request->validated();
        $user = Auth::user();
        $toko = Toko::where('user_id', $user->id)->first();
        $product = new Product($data);

        // simpan produk
        $product->toko_id = $toko->id;
        $product->slug = Str::slug($request->name);
        $product->save();

        // Simpan gambar produk
        if ($request->hasFile('images')) {
            foreach ($request->images as $image) {
                $imagePath = $this->generateRandomString() . '.' . $image->extension();
                $image->move(public_path('images/product/' . $product->id . '/'), $imagePath);
                $product_image[] = ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imagePath,
                ]);
            }
        }

        return new ProductResource($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $productSlug)
    {
        $product = Product::where('slug', $productSlug)->first();

        if (!$product) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }

        return new ProductResource($product);
    }

    public function showTokoProduct(string $tokoSlug, string $productSlug)
    {
        $toko = Toko::where('slug', $tokoSlug)->first();
        if (!$toko) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }
        $product = Product::where('slug', $productSlug)->where('toko_id', $toko->id)->first();
        if (!$product) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }
        return new ProductResource($product);
    }

    public function showAllTokoProducts(Request $request, string $tokoSlug)
    {
        // if($request->has('search')){
        //     $products = Product::where('toko_id', $tokoSlug)->where('name', 'like', '%' . $request->search . '%')->get();
        // }else{
        //     $products = Product::where('toko_id', $tokoSlug)->get();
        // }
        $toko = Toko::where('slug', $tokoSlug)->first();
        if ($request->has('limit')) {
            $products = Product::where('toko_id', $toko->id)->take($request->limit)->get();
        } else {
            $products = Product::where('toko_id', $toko->id)->get();
        }
        return ProductResource::collection($products);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductUpdateRequest $request, string $id)
    {
        $data = $request->validated();
        $user = Auth::user();
        $toko = Toko::where('user_id', $user->id)->first();
        $product = Product::where('id', $id)->where('toko_id', $toko->id)->first();
        if (!$product) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }

        $product->fill($data);
        $product->toko_id = $toko->id;
        $category = Category::where('name', $data['category'])->first();
        $product->category_id = $category->id;
        $product->slug = Str::slug($request->name);
        $product->save();

        // Simpan gambar produk
        if ($request->hasFile('images')) {
            foreach ($request->images as $image) {
                $imagePath = $this->generateRandomString() . '.' . $image->extension();
                $image->move(public_path('images/product/' . $product->id . '/'), $imagePath);
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imagePath,
                ]);
            }
        }

        return new ProductResource($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->destroyProduct($id);
    }

    public function deleteImage(string $id)
    {
        $toko = Toko::where('user_id', Auth::user()->id)->first();
        $product = Product::where('toko_id', $toko->id)->first();
        if (ProductImage::where('product_id', $product->id)->count() <= 1) {
            return response()->json([
                'message' => "Images can't be deleted if there are less than 1"
            ], 422);
        }
        $image = ProductImage::where('id', $id)->first();

        if ($image) {
            if (File::exists(public_path('images/product/' . $image->product_id))) {
                $fileToDelete = public_path('images/product/' . $image->product_id);
                File::delete($fileToDelete);
                $image->delete();
                // updated product
                $product = Product::where('id', $image->product_id)->first();
                return response()->json([
                    'message' => "Image has deleted",
                    'product' => new ProductResource($product)
                ], 200);
            } else {
                return response()->json([
                    'message' => "Image hasn't delete"
                ], 422);
            }
        } else {
            return response()->json([
                'message' => "Image not found"
            ], 404);
        }
    }

    public function getAllUserProducts()
    {
        $user = Auth::user();
        $toko_id = $user->toko->id;
        $products = Product::where('toko_id', $toko_id)->get();
        if (!$products) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return ProductResource::collection($products);
    }

    public function getUserProductsById(string $id)
    {
        $user = Auth::user();
        $toko_id = $user->toko->id;
        $products = Product::where('toko_id', $toko_id)->where('id', $id)->first();
        if (!$products) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return new ProductResource($products);
    }

    public function getProductByCategory(string $categorySlug)
    {
        $products = Product::whereHas('category', function ($query) use ($categorySlug) {
            $query->where('slug', $categorySlug);
        })->get();
        // return $products;
        if (!$products->count()) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }
        return ProductResource::collection($products);
    }
}
