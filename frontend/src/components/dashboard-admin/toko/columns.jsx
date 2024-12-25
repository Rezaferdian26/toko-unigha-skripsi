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
import { myToastError, myToastSuccess } from "@/utils/myToast";
import axios from "axios";
import Cookies from "js-cookie";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
  },
  {
    accessorKey: "identification_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NPM/NIM" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const toko = row.original;

      const handleDeleteToko = async () => {
        try {
          const response = await axios.delete(`/api/toko/${toko.id}`, {
            headers: {
              "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
            },
          });
          if (response.status === 200) {
            myToastSuccess("Berhasil menghapus toko");
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
              onClick={() => navigator.clipboard.writeText(toko.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem>Lihat detail toko</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteToko(toko.id)}>
              Hapus Toko
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
