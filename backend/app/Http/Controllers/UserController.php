<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\HasDestroyToko;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    use HasDestroyToko;
    public function index()
    {
        return UserResource::collection(User::all());
    }

    public function getUserLogin()
    {
        return new UserResource(Auth::user());
    }


    public function destroyUser(string $id)
    {
        $user = User::where('id', $id)->first();
        $toko = $user->toko;
        if ($toko) {
            $this->destroyToko($toko->id);
        }
        if ($user === Auth::user()) {
            throw new HttpResponseException(response()->json([
                'errors' => [
                    'message' => 'Cannot delete yourself'
                ]
            ], 400));
        }
        if ($user) {
            $user->delete();
            return response()->json([
                'message' => 'User deleted successfully'
            ]);
        }

        return response()->json([
            'message' => 'User not found'
        ], 404);
    }
}
