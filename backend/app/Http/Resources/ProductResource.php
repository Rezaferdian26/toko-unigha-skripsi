<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'condition' => $this->condition,
            'category' => $this->category->name ?? '-',
            'price' => $this->price,
            'stock' => $this->stock,
            'toko_id' => $this->toko_id,
            'toko_name' => $this->toko->name,
            'toko_slug' => $this->toko->slug,
            'phone' => $this->toko->user->phone,
            'images' => ProductImageResource::collection($this->images)
        ];
    }
}
