<?php

namespace App\Http\Controllers;

use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserActivityController extends Controller
{
    public function index()
    {
        $userActivity = UserActivity::all();
        return response()->json([
            'data' => $userActivity
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required',
        ]);

        $userId = Auth::user()->id;
        $productId = $request->product_id;

        $recentActivity = UserActivity::where('user_id', $userId)->where('product_id', $productId)->first();

        if ($recentActivity) {
            return response()->json([
                'message' => 'User Activity already exists',
            ], 422);
        }

        $allActivity = UserActivity::where('user_id', $userId)->latest('created_at')->get();

        if ($allActivity->count() > 20) {
            $oldestActivity = $allActivity->last();
            $oldestActivity->delete();
        }

        $userActivity = UserActivity::create([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);

        return response()->json([
            'data' => $userActivity,
            'message' => 'User Activity created successfully',
        ], 201);
    }

    public function show($id)
    {
        $userActivity = UserActivity::find($id);
        return response()->json([
            'data' => $userActivity
        ]);
    }

    public function update(Request $request, $id)
    {
        $userActivity = UserActivity::find($id);
        $userActivity->update($request->all());
        return response()->json([
            'data' => $userActivity
        ]);
    }

    public function destroy($id)
    {
        $userActivity = UserActivity::destroy($id);
        return response()->json([
            'data' => $userActivity
        ]);
    }
}
