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
import axios from "axios";
import { myToastError, myToastSuccess } from "@/utils/myToast";
import Cookies from "js-cookie";

export const columns = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      const handleDeleteUser = async (id) => {
        // Handle delete user logic
        try {
          const response = await axios.delete(`/api/user/${id}`, {
            headers: {
              "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
            },
          });
          if (response.status === 200) {
            myToastSuccess("Berhasil menghapus user");
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
              onClick={() => navigator.clipboard.writeText(user.username)}
            >
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuItem>Lihat detail user</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
              Hapus User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
