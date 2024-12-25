import Image from "next/legacy/image";
import {
  FaBoxesPacking,
  FaEye,
  FaLayerGroup,
  FaPencil,
  FaTrash,
} from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { useRef, useState } from "react";
import axios from "axios";
import { myToastSuccess } from "@/utils/myToast";
import Cookies from "js-cookie";

export default function CardMyProduct({
  product,
  setProductId,
  setProducts,
  setEdit,
}) {
  const closeButtonRef = useRef();
  const modalRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.delete(`/api/product/${product.id}`, {
        headers: {
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });
      if (response.status === 200) {
        setLoading(false);
        setProducts((prev) => prev.filter((item) => item.id !== product.id));
        myToastSuccess("Produk berhasil dihapus");
        closeButtonRef.current.click();
      }
    } catch (error) {
      setLoading(false);
      if (error.response.data.message) {
        myToastError(error.response.data.message);
      }
      closeButtonRef.current.click();
    }
  };
  return (
    <div className="bg-white shadow rounded">
      <div className="m-3">
        <div className="flex flex-col sm:flex-row border-b py-5">
          <div className="sm:w-[20%] w-full me-5">
            <div className="w-36 h-36 mx-auto relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BACKEND}${product.images[0].image_path}`}
                alt="Gambar Produk"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>

          <div className="w-[80%]">
            <h1 className="uppercase font-bold text-lg">{product.name}</h1>
            <p>
              Rp{" "}
              <span>
                {new Intl.NumberFormat("id-ID", {
                  // style: "currency",
                  currency: "IDR",
                }).format(product.price)}
              </span>
            </p>
            <p className="text-sm mt-2">{product.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 border-b py-5">
          <p className="text-neutral-500">
            <FaLayerGroup className="inline me-2" /> Stok {product.stock}
          </p>
          <p className="text-neutral-500">
            <FaBoxesPacking className="inline me-2" /> Terjual 17
          </p>
          <p className="text-neutral-500">
            <BiSolidCategory className="inline me-2" /> Kategori{" "}
            {product.category}
          </p>
          <p className="text-neutral-500">
            <FaEye className="inline me-2" /> Dilihat 240
          </p>
        </div>
        <div className="py-5">
          <button
            className="btn btn-primary me-3"
            onClick={() => {
              setProductId(product.id);
              setEdit(true);
            }}
          >
            <FaPencil />
            Ubah
          </button>
          <button className="btn" onClick={() => modalRef.current.showModal()}>
            <FaTrash /> Hapus
          </button>
        </div>
      </div>

      {/* modal */}
      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">PERINGATAN!</h3>
          <p className="py-4">Apakah anda yakin ingin menghapus produk ini?</p>
          <div className="modal-action">
            <button
              className="btn btn-primary me-2 disabled:btn-primary disabled:opacity-75"
              onClick={handleDeleteProduct}
              disabled={loading}
            >
              <FaTrash /> Hapus
              {loading && (
                <span className="loading loading-spinner loading-md"></span>
              )}
            </button>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" ref={closeButtonRef}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* end modal */}
    </div>
  );
}
