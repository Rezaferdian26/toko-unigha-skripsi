<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Toko;
use App\Traits\HasRandomString;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    use HasRandomString;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Order::with('user', 'product.toko', 'product.images');

        if ($request->has('status') && $request->status === 'belum_bayar') {
            $query->where('status', 'pending');
        }
        if ($request->has('status') && $request->status === 'proses') {
            $query->where('status', 'paid')->where('is_verify', 0)->where('is_final', 0);
        }
        if ($request->has('status') && $request->status === 'dikirim') {
            $query->where('status', 'paid')->where('is_verify', 1)->where('is_final', 0);
        }
        if ($request->has('status') && $request->status === 'selesai') {
            $query->where('status', 'paid')->where('is_verify', 1)->where('is_final', 1);
        }

        $orders = $query->latest()->get();
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required',
            'product_id' => 'required',
            'toko_id' => 'required',
            'qty' => 'required',
            'price' => 'required',
        ]);

        $user = Auth::user();

        $validated['total'] = $validated['qty'] * $validated['price'];
        $validated['status'] = 'pending';

        // Simpan gambar bukti pembayaran
        // if ($request->hasFile('proof_payment')) {
        //     $imagePath = $this->generateRandomString() . '.' . $request->proof_payment->extension();
        //     $request->proof_payment->move(public_path('images/proof_payment/' . $user->id . '/'), $imagePath);
        //     $validated['proof_payment'] = $imagePath;
        // }
        $order = Order::create($validated);
        return response()->json($order);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Order $order)
    {
        $query = $order->with('user', 'product.toko', 'product.images')->where('user_id', Auth::user()->id);

        if ($request->has('status') && $request->status === 'pending') {
            $query->where('status', 'pending');
        }

        $order = $query->first();
        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }
        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'user_id' => 'required',
            'product_id' => 'required',
            'qty' => 'required',
            'price' => 'required',
            'proof_payment' => 'required',
        ]);

        $validated['total'] = $validated['qty'] * $validated['price'];
        $validated['status'] = 'pending';

        $order->update($validated);

        return response()->json($order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully'
        ]);
    }

    public function payment(Request $request, Order $order)
    {
        $validated = $request->validate([
            'proof_payment' => 'required|file|max:524288', // Validasi file
        ]);
        // Simpan gambar bukti pembayaran
        if ($request->hasFile('proof_payment')) {
            $imagePath = $this->generateRandomString() . '.' . $request->proof_payment->extension();
            $request->proof_payment->move(public_path('images/proof_payment/' . $order->id . '/'), $imagePath);
            $validated['proof_payment'] = $imagePath;
        }
        $user = Auth::user();
        $order->where('user_id', $user->id)->where('id', $order->id)->update([
            'proof_payment' => $imagePath,
            'status' => 'paid'
        ]);
        return response()->json([
            'message' => 'Order payment successfully'
        ]);
    }

    public function verificationView()
    {
        $user = Auth::user();
        $toko = Toko::where('user_id', $user->id)->first();
        $order = Order::with('user', 'product.toko', 'product.images')->where('toko_id', $toko->id)->latest()->get();
        return response()->json($order);
    }

    public function verification(Order $order)
    {
        $order->update([
            'is_verify' => true,
        ]);
        return response()->json($order);
    }

    public function finalOrder(Order $order)
    {
        $order->update([
            'is_final' => true,
        ]);
        return response()->json($order);
    }
}
