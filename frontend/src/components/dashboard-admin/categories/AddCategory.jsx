import { myToastError, myToastSuccess } from "@/utils/myToast";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { FaBan, FaPlus } from "react-icons/fa6";

export default function AddCategory({ setAdd }) {
  const [name, setName] = useState("");
  const handeAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/api/category`,
        {
          name,
        },
        {
          headers: {
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
          },
        }
      );
      if (response.status === 200) {
        setName("");
        myToastSuccess("Berhasil menambahkan kategori");
      }
    } catch (error) {
      myToastError("Gagal menambahkan kategori");
    }
  };
  return (
    <>
      <form className="bg-white mt-5 p-3 shadow rounded w-96 mx-auto">
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
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <button className="btn btn-primary me-3" onClick={handeAddCategory}>
          <FaPlus /> Tambah
        </button>
        <button
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            setAdd(false);
          }}
        >
          <FaBan /> Batal
        </button>
      </form>
    </>
  );
}
