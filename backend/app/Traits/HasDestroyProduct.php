<?php

namespace App\Traits;

use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

trait HasDestroyProduct
{
    public function destroyProduct(string $id)
    {
        $product = Product::where('id', $id)->first();
        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }
        if (File::exists(public_path('images/product/' . $product->id))) {
            $directoryToDelete = public_path('images/product/' . $product->id);
            File::deleteDirectory($directoryToDelete);
        } else {
            return response()->json([
                'message' => "Image hasn't delete"
            ], 422);
        }
        $product->delete();
        return response()->json([
            'message' => 'Product has deleted'
        ]);
    }
}
