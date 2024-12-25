"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/ColumnHeader";
import Cookies from "js-cookie";
import axios from "axios";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" />
    ),
  },
  {
    accessorKey: "condition",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Condition" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kategori" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Harga" />
    ),
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stok" />
    ),
  },
  {
    accessorKey: "toko_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Toko" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const handleDeleteProduct = async () => {
        try {
          const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/product/${product.id}`,
            {
              headers: {
                "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
              },
            }
          );
          if (response.status === 200) {
            myToastSuccess("Berhasil menghapus product");
          }
        } catch (error) {
          myToastError(error.message);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem>Lihat detail produk</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>
              Hapus Produk
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
