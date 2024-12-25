import { myToastError, myToastSuccess } from "@/utils/myToast";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/legacy/image";
import { useEffect, useRef, useState } from "react";

export default function DetailTokoModal({ slug, setReload }) {
  const [rejected, setRejected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toko, setToko] = useState({});
  const inputReasonRef = useRef();
  const selectRef = useRef();
  const closeModalRef = useRef();
  const [error, setError] = useState({});

  const handleSelectChange = (e) => {
    setError("");
    const value = e.target.value;
    if (value === "rejected") {
      setRejected(true);
    } else {
      setRejected(false);
    }
  };

  const handleSubmitVerifyToko = async (e) => {
    e.preventDefault();

    if (selectRef.current.value === "") {
      setError({
        message: "Harus memilih",
        type: "select",
      });
      return;
    }

    if (rejected && inputReasonRef.current.value === "") {
      setError({
        message: "Harus memasukkan alasan",
        type: "reason",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/toko/${slug}/verify`,
        {
          is_verified: selectRef.current.value,
          reason: rejected ? inputReasonRef.current.value : "",
        },
        {
          headers: {
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
          },
        }
      );
      if (response.status === 200) {
        setError({});
        setReload(true);
        closeModalRef.current.click();
        myToastSuccess("Verifikasi toko berhasil");
      }
    } catch (error) {
      myToastError("Verifikasi toko gagal");
      setError({
        message: "Nilai tidak valid",
        type: "invalid",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/toko/${slug}`
        );
        setToko(response.data.data);
        if (response.status === 200) {
          setLoading(false);
        }
      } catch (error) {
        setToko(null);
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);
  return (
    <div className="modal-box">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          ref={closeModalRef}
        >
          ✕
        </button>
      </form>
      <h3 className="font-bold text-lg">Verifikasi Toko</h3>

      <div className="py-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner"></span>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-2">
              <div className="w-1/4">
                <label htmlFor="name">Nama</label>
              </div>
              <input
                type="text"
                value={toko.name}
                disabled={true}
                className="input"
              />
            </div>
            <div className="flex items-center mb-2">
              <div className="w-1/4">
                <label htmlFor="address">Alamat</label>
              </div>
              <input
                type="text"
                value={toko.address}
                disabled={true}
                className="input"
              />
            </div>
            <div className="flex items-center mb-2">
              <div className="w-1/4">
                <label htmlFor="address">Gambar</label>
              </div>
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BACKEND}/${toko.image}`}
                alt="gambar toko"
                width={100}
                height={100}
              />
            </div>
            <div className="flex items-center mb-2">
              <div className="w-1/4">
                <label htmlFor="address">NIM/NPM</label>
              </div>
              <input
                type="text"
                value={toko.identification_number}
                disabled={true}
                className="input"
              />
            </div>
            <div className="flex items-center mb-2">
              <form onSubmit={handleSubmitVerifyToko}>
                <select
                  className="select select-bordered w-full max-w-xs"
                  onChange={handleSelectChange}
                  ref={selectRef}
                >
                  <option disabled selected value={""}>
                    Pilih Verifikasi
                  </option>
                  <option value="verified">Terima</option>
                  <option value="rejected">Tolak</option>
                </select>
                {error.type === "select" && (
                  <p className="text-red-500">{error.message}</p>
                )}
                {error.type === "invalid" && (
                  <p className="text-red-500">{error.message}</p>
                )}
                {rejected && (
                  <>
                    <input
                      type="text"
                      className="input input-bordered block mt-3"
                      placeholder="Masukkan alasan"
                      ref={inputReasonRef}
                    />
                    {error.type === "reason" && (
                      <p className="text-red-500">{error.message}</p>
                    )}
                  </>
                )}
                <button type="submit" className="btn btn-primary mt-5">
                  Submit
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
