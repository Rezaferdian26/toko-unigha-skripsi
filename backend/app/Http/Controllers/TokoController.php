<?php

namespace App\Http\Controllers;

use App\Http\Requests\TokoCreateRequest;
use App\Http\Requests\TokoUpdateRequest;
use App\Http\Resources\TokoDetailResource;
use App\Models\Toko;
use App\Traits\HasDestroyProduct;
use App\Traits\HasDestroyToko;
use App\Traits\HasRandomString;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class TokoController extends Controller
{
    use HasDestroyProduct, HasDestroyToko, HasRandomString;
    /**
     * Instantiate a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['show', 'index', 'showTokoLandingPage']);
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Toko::query();
        if ($request->has('desc')) {
            $query->orderBy('created_at', 'desc'); // Mengurutkan berdasarkan tanggal pembuatan terbaru
        } else if ($request->has('asc')) {
            $query->orderBy('created_at', 'asc'); // Mengurutkan berdasarkan tanggal pembuatan terlama
        }

        if ($request->has('limit')) {
            $query->take($request->limit);
        }
        $toko = $query->where('is_verified', 'verified')->get();
        return TokoDetailResource::collection($toko);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TokoCreateRequest $request)
    {
        $data = $request->validated();
        $user = Auth::user();
        if ($user->toko) {
            return response()->json(['message' => 'Anda sudah memiliki toko.'], 400);
        }

        $toko = new Toko($data);
        $toko->user_id = $user->id;
        $toko->slug = Str::slug($request->name);
        $toko = $this->saveImageToPublicPath($request, $toko);
        $toko->save();

        // send email to admin (ongoing)

        return (new TokoDetailResource($toko))->response()->setStatusCode(201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $toko_slug)
    {

        $toko = Toko::where('slug', $toko_slug)->first();
        if (!$toko) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }

        return new TokoDetailResource($toko);
    }

    public function getTokoUser()
    {
        $user = Auth::user();

        // Mengambil toko yang dimiliki oleh user yang sedang login
        $toko = $user->toko;

        if ($toko) {
            return new TokoDetailResource($toko);
        } else {
            return response()->json(['message' => 'User tidak memiliki toko.'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TokoUpdateRequest $request, string $id)
    {
        $data = $request->validated();
        $user = Auth::user();
        $toko = Toko::where('id', $id)->where('user_id', $user->id)->first();
        if (!$toko) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }

        $toko->fill($data);
        $toko->slug = Str::slug($request->name);
        $toko->save();

        return new TokoDetailResource($toko);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->destroyToko($id);
    }

    public function verifyToko(Request $request, string $slug)
    {
        $data = $request->validate([
            'is_verified' => 'required|string|in:verified,unverified,rejected',
        ]);

        // if ($request->input('reason')) {
        //     return $request->input('reason');
        // }

        // return $data['is_verified'];

        $toko = Toko::where('slug', $slug)->first();
        if (!$toko) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }
        $toko->fill($data);
        $toko->is_verified = $data['is_verified'];
        if ($data['is_verified'] == 'rejected') {
            // send to email user
        } else if ($data['is_verified'] == 'unverified') {
            // send to email user
        } else if ($data['is_verified'] == 'verified') {
            // send to email user
        }
        $toko->save();
        return new TokoDetailResource($toko);
    }

    public function getUnVerifiedToko()
    {
        $toko = Toko::where('is_verified', 'unverified')->get();
        if (!$toko) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }
        return TokoDetailResource::collection($toko);
    }

    public function updateImage(Request $request, string $id)
    {
        $data = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        $user = Auth::user();
        $toko = Toko::where('id', $id)->where('user_id', $user->id)->first();
        if (!$toko) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Not Found'
                ]
            ], 404));
        }
        $toko = $this->saveImageToPublicPath($request, $toko);
        $toko->save();
        return response()->json([
            'message' => 'Image updated successfully',
            'image' => 'images/toko/' . $toko->image
        ]);
    }

    private function saveImageToPublicPath($request, $obj)
    {
        if (File::exists(public_path('images/toko/' . $obj->image))) {
            $fileToDelete = public_path('images/toko/' . $obj->image);
            File::delete($fileToDelete);
        }
        $fileName = $this->generateRandomString() . '.' . $request->image->extension();
        $request->image->move(public_path('images/toko'), $fileName);
        $obj->image = $fileName;
        return $obj;
    }
}
