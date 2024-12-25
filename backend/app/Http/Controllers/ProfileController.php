<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileRequest;
use App\Models\Toko;
use App\Models\User;
use App\Traits\HasRandomString;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class ProfileController extends Controller
{
    use HasRandomString;
    public function updateImageProfile(Request $request)
    {
        $data = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        $profile = User::where('id', Auth::user()->id)->first();
        if (!$profile) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }
        if (File::exists(public_path('images/profile/' . $profile->image))) {
            $fileToDelete = public_path('images/profile/' . $profile->image);
            File::delete($fileToDelete);
        }
        $fileName = $this->generateRandomString() . '.' . $request->image->extension();
        $request->image->move(public_path('images/profile'), $fileName);
        $profile->image = 'images/profile/' . $fileName;
        $profile->save();
        return response()->json([
            'message' => 'Image updated successfully',
            'image' => 'images/profile/' . $profile->image
        ]);
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50',
            'username' => 'required|string|max:50',
            'phone' => 'required|numeric',
            'address' => 'required|string',
        ]);
        $profile = User::where('id', Auth::user()->id)->first();
        if ($data['username'] === $profile->username) {
            unset($data['username']);
        }
        if ($data['phone'] === $profile->phone) {
            unset($data['phone']);
        }
        if (!$profile) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }

        $profile->fill($data);
        $profile->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $data
        ]);
    }
}
