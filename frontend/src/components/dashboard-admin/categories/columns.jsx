/* eslint-disable react-hooks/rules-of-hooks */
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
import { useContext, useRef } from "react";
import { EditContext } from "@/pages/admin/categories";
import { FaPencil } from "react-icons/fa6";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;

      const { editValue, setEditValue, editId, setEditId } =
        useContext(EditContext);
      const closeButtonRef = useRef();
      const router = useRouter();
      const handleDeleteCategory = async () => {
        try {
          const response = await axios.delete(`/api/category/${category.id}`, {
            headers: {
              "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
            },
          });
          if (response.status === 200) {
            myToastSuccess("Berhasil menghapus kategori");
          }
        } catch (error) {
          myToastError(error.message);
        }
      };

      const handleEditCategory = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.put(
            `/api/category/${editId}`,
            {
              name: editValue,
            },
            {
              headers: {
                "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
              },
            }
          );
          if (response.status === 200) {
            myToastSuccess("Berhasil mengupdate kategori");
            router.reload();
            closeButtonRef.current.click();
          }
        } catch (error) {
          myToastError("Gagal mengupdate kategori");
        }
      };

      return (
        <>
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
                onClick={() => navigator.clipboard.writeText(category.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEditValue(category.name);
                  setEditId(category.id);
                  document.getElementById("edit_modal").showModal();
                }}
              >
                Edit Kategori
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteCategory(category.id)}
              >
                Hapus Kategori
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <dialog id="edit_modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Hello!</h3>
              <div className="flex items-center mb-5">
                <label htmlFor="name" className="w-28">
                  Nama
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="input input-md input-bordered w-full"
                  placeholder="Masukkan nama ketegori"
                  autoComplete="off"
                  autoCorrect="off"
                  autoFocus
                  autoCapitalize="on"
                  onChange={(e) => setEditValue(e.target.value)}
                  value={editValue}
                />
              </div>
              <div className="modal-action">
                <form method="dialog">
                  <button
                    className="btn btn-primary me-3"
                    onClick={handleEditCategory}
                  >
                    <FaPencil /> Ubah
                  </button>
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn" ref={closeButtonRef}>
                    Close
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </>
      );
    },
  },
];
