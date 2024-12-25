import { myToastSuccess } from "@/utils/myToast";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/legacy/image";
import { useState } from "react";
import { FaPencil, FaRepeat } from "react-icons/fa6";

export default function EditImageToko({ toko, setToko, setEdit }) {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const handleUpdateImage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/api/toko/${toko.id}/update-image`,
        {
          image: image,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
          },
        }
      );
      if (response.status === 200) {
        setEdit(false);
        setToko({
          ...toko,
          image: response.data.image,
        });
        myToastSuccess("Berhasil memperbarui gambar toko");
      }
    } catch (error) {}
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setPreview(reader.result);
      };
    } else {
      setImage(null);
    }
  };

  return (
    <form onSubmit={handleUpdateImage} encType="multipart/form-data">
      <label
        className="w-[200px] h-[200px] relative block cursor-pointer border rounded shadow hover:bg-gray-100 transition-all mx-auto"
        htmlFor="image"
      >
        {preview ? (
          <Image
            src={preview}
            layout="fill"
            objectFit="cover"
            alt="Image Toko"
            className="rounded-full"
          />
        ) : (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BACKEND}/${toko?.image}`}
            layout="fill"
            objectFit="cover"
            alt="Image Toko"
            className="rounded-full"
          />
        )}

        <FaPencil className="absolute bottom-2 right-2" />
      </label>
      <input
        type="file"
        name="image"
        id="image"
        hidden
        onChange={(e) => {
          handleInputChange(e);
        }}
      />
      <p className="text-sm text-center mt-3">*Ukuran maksimal 500kb</p>
      <button className="btn btn-primary btn-block mt-4" type="submit">
        <FaRepeat />
        Ganti Gambar
      </button>
    </form>
  );
}
