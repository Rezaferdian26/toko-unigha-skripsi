import { FaPencil, FaTrash } from "react-icons/fa6";

import FormDefaultToko from "@/components/mytoko/FormDefaultToko";
import FormEditToko from "@/components/mytoko/FormEditToko";
import Image from "next/legacy/image";
import { useContext, useEffect, useState } from "react";
import { TokoContext } from "@/contexts/tokoContext";
import axios from "axios";
import { useRouter } from "next/router";
import EditImageToko from "./EditImageToko";
import Skeleton from "react-loading-skeleton";
import { myToastSuccess } from "@/utils/myToast";
import Cookies from "js-cookie";

export default function TabTokoView({ loading, setLoading }) {
  const [edit, setEdit] = useState(false);

  const { toko, setToko } = useContext(TokoContext);
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const handleDeleteToko = async () => {
    try {
      const response = await axios.delete(`/api/toko/${toko.id}`, {
        headers: {
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });
      if (response.status === 200) {
        router.push("/");
        setToko(null);
        myToastSuccess("Berhasil menghapus toko");
      }
    } catch (error) {}
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <Skeleton count={3} />
      </div>
    );
  }

  return (
    <div className="sm:flex">
      <div className="bg-white p-4 rounded shadow me-5 h-full mb-5">
        {edit ? (
          <EditImageToko toko={toko} setToko={setToko} setEdit={setEdit} />
        ) : (
          <div className="w-[200px] h-[200px] relative block mx-auto ">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_BACKEND}/${toko?.image}`}
              layout="fill"
              objectFit="cover"
              alt="Image Toko"
              className="rounded-full"
            />
          </div>
        )}
      </div>
      <div className="bg-white p-5 w-full shadow rounded h-full">
        {!edit && (
          <div className="flex justify-end mb-5">
            <button
              className="btn btn-primary me-3"
              onClick={() => setEdit(true)}
            >
              <FaPencil />
              Edit Toko
            </button>
            <button
              className="btn "
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              <FaTrash />
              Hapus Toko
            </button>
          </div>
        )}
        {edit ? (
          <FormEditToko toko={toko} setToko={setToko} setEdit={setEdit} />
        ) : (
          <FormDefaultToko toko={toko} />
        )}
      </div>

      {/* modal */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error uppercase">
            Peringatan!
          </h3>
          <p className="py-4">Apakah Anda yakin ingin menghapus toko?</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-primary mr-3"
                onClick={handleDeleteToko}
              >
                Hapus
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
