<?php

namespace App\Http\Controllers;

use App\Models\LandingPage;
use App\Traits\HasRandomString;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class LandingPageController extends Controller
{
    use HasRandomString;

    public function getImages()
    {
        $images = LandingPage::all();
        if (!$images->count()) {
            return response()->json([
                'message' => 'No images found'
            ], 404);
        }
        return response()->json([
            'images' => $images
        ]);
    }


    public function addImageBanner(Request $request)
    {
        if ($request->hasFile('images')) {
            foreach ($request->images as $image) {
                $imagePath = $this->generateRandomString() . '.' . $image->extension();
                $image->move(public_path('images/banner/'), $imagePath);
                $landingPage = LandingPage::create([
                    'image_banner' => 'images/banner/' . $imagePath
                ]);
                $banner[] = 'images/banner/' . $imagePath;
            }
            return response()->json([
                'message' => "Image has added",
                'data' => LandingPage::all()
            ], 200);
        }
        return response()->json([
            'message' => "Image not found"
        ], 404);
    }

    public function deleteImageBanner(string $id)
    {
        $image = LandingPage::where('id', $id)->first();
        if ($image) {
            if (File::exists(public_path($image->image_banner))) {
                $fileToDelete = public_path($image->image_banner);
                File::delete($fileToDelete);
                $image->delete();
                // update image
                return response()->json([
                    'message' => "Image has deleted",
                    'image' => $image
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
}
