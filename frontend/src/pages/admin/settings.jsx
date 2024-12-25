import Header from "@/components/dashboard-admin/Header";
import SideBar from "@/components/dashboard-admin/Sidebar";
import ProtectedAdminPage from "@/components/protect-pages/ProtectedAdminPage";
import { myToastError, myToastSuccess } from "@/utils/myToast";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";

export default function Settings() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [tempImage, setTempImage] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/landing-page");
        setCurrentImages(response.data.images);
      } catch (error) {
        setCurrentImages([]);
      }
    };
    fetchData();
  }, []);
  const handleImageDelete = (e, index) => {
    e.preventDefault();
    const updatedImages = [...selectedImages];
    setTempImage((prev) => {
      const temp = [...prev];
      temp.splice(index, 1);
      return temp;
    });
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleImageDatabaseDelete = async (e, idImage, index) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`/api/landing-page/${idImage}`, {
        headers: {
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });
      if (response.status === 200) {
        myToastSuccess("Gambar produk berhasil dihapus");
        const newImages = [...currentImages];
        newImages.splice(index, 1);
        setCurrentImages(newImages);
      }
    } catch (error) {
      if (error.response.data.message) {
        myToastError(error.response.data.message);
      } else {
        myToastError(error.message);
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = e.currentTarget.files;
    setTempImage((prev) => [...prev, ...files]);
    const selectedImagesArray = [...selectedImages];

    for (let i = 0; i < files.length; i++) {
      selectedImagesArray.push(URL.createObjectURL(files[i]));
    }

    setSelectedImages(selectedImagesArray);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    for (let value of tempImage) {
      formData.append("images[]", value);
    }

    try {
      const response = await axios.post(
        `/api/landing-page/add-image-banner`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
          },
        }
      );
      if (response.status === 200) {
        setSelectedImages([]);
        setTempImage([]);
        setCurrentImages(response.data.data);
        setLoading(false);
        myToastSuccess("Gambar banner halaman beranda berhasil diupload");
      }
    } catch (error) {
      setLoading(false);
      myToastError(
        `Gagal mengupload banner halaman beranda. ${error.response.data.message}`
      );
    }
  };

  return (
    <ProtectedAdminPage>
      <SideBar linkActive={"settings"}>
        <Header title="Pengaturan Web" />
        <div className="p-3">
          <div>
            <h1 className="font-bold uppercase">Banner Beranda Saat ini</h1>
            <div className="image-preview grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {currentImages.length === 0 ? (
                <div className="w-56 relative h-36 m-2 object-cover mb-3 mx-auto rounded-lg">
                  <Image
                    src={"https://placehold.co/1920x1080.jpg"}
                    alt="banner"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              ) : (
                <>
                  {currentImages.map((url, index) => (
                    <div
                      key={index}
                      className="image-preview-item flex justify-center flex-col"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BACKEND}/${url.image_banner}`}
                        alt={`Image ${index}`}
                        width={200}
                        height={150}
                        className="w-56 h-36 m-2 object-cover mb-3 mx-auto rounded-lg"
                      />
                      <button
                        onClick={(e) =>
                          handleImageDatabaseDelete(e, url.id, index)
                        }
                        className="btn m-auto"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <span className="border-b-[1px] w-full block my-5"></span>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h1 className=" font-bold uppercase">
              Tambah banner halaman beranda
            </h1>
            <div className="image-preview grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {selectedImages.map((url, index) => (
                <div
                  key={index}
                  className="image-preview-item flex justify-center flex-col"
                >
                  <Image
                    src={url}
                    alt={`Image ${index}`}
                    width={200}
                    height={150}
                    className="w-56 h-36 p-1 border-dashed border-indigo-500 border-2 m-2 object-cover mb-3 mx-auto"
                  />
                  <button
                    onClick={(e) => handleImageDelete(e, index)}
                    className="btn m-auto"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <label
                htmlFor="images"
                className="w-56 h-36 p-1 mx-auto border-dashed border-indigo-500 border-2 m-2 flex items-center justify-center cursor-pointer text-indigo-500 text-sm"
              >
                <FaPlus />
                Tambah Gambar
              </label>
              <input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <span className="border-b-[1px] w-full block my-5"></span>
            <button
              className="btn btn-primary disabled:btn-primary disabled:opacity-75 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Upload Gambar{" "}
              {loading && <span className="loading loading-spinner"></span>}
            </button>
          </form>
        </div>
      </SideBar>
    </ProtectedAdminPage>
  );
}
