<?php

namespace App\Traits;

use App\Models\Product;
use App\Models\Toko;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

trait HasDestroyToko
{
    use HasDestroyProduct;
    public function destroyToko(string $id)
    {
        $toko = Toko::where('id', $id)->first();
        $products = Product::where('toko_id', $toko->id)->get();
        if ($products) {
            foreach ($products as $product) {
                $this->destroyProduct($product->id);
            }
        }
        if (!$toko) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }
        if (File::exists(public_path('images/toko/' . $toko->image))) {
            $fileToDelete = public_path('images/toko/' . $toko->image);
            File::delete($fileToDelete);
        }
        $toko->delete();
        return response()->json([
            'message' => 'Toko deleted successfully',
        ]);
    }
}
