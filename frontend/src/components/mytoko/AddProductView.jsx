import { myToastError, myToastSuccess } from "@/utils/myToast";
import axios from "axios";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import Image from "next/legacy/image";
import { useState } from "react";
import { FaBan, FaFloppyDisk, FaPlus, FaTrash } from "react-icons/fa6";
import * as Yup from "yup";

export default function AddProductView({
  setAddProduct,
  setProducts,
  categories,
}) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [tempImage, setTempImage] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const files = e.currentTarget.files;
    setTempImage((prev) => [...prev, ...files]);
    const selectedImagesArray = [...selectedImages];
    formik.setFieldValue("images", [files]);

    for (let i = 0; i < files.length; i++) {
      selectedImagesArray.push(URL.createObjectURL(files[i]));
    }

    setSelectedImages(selectedImagesArray);
  };

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

  const handleCreateProduct = async () => {
    setLoading(true);
    const categoryId = categories.filter(
      (category) => category.slug === formik.values.category
    )[0].id;
    const formData = new FormData();

    // Menambahkan data produk ke formData
    formData.append("name", formik.values.name);
    formData.append("description", formik.values.description);
    formData.append("stock", formik.values.stock);
    formData.append("category_id", categoryId);
    formData.append("condition", formik.values.condition);
    formData.append("price", formik.values.price);

    // Menambahkan berkas gambar ke formData
    for (let value of tempImage) {
      formData.append("images[]", value);
    }

    try {
      const response = await axios.post(`/api/product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });
      if (response.status === 201) {
        setAddProduct(false);
        setLoading(false);
        myToastSuccess(
          `Produk ${response.data.data.name} Berhasil Ditambahkan!`
        );
        setProducts((prev) => [...prev, response.data.data]);
      }
    } catch (error) {
      setLoading(false);
      myToastError(`Gagal : ${error.response.data.message}`);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      stock: "",
      category: "",
      condition: "",
      price: "",
      images: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nama produk harus diisi!"),
      description: Yup.string().required("Deskripsi produk harus diisi!"),
      stock: Yup.number().required("Stok produk harus diisi!"),
      category: Yup.string()
        .required("Kategori produk harus diisi!")
        .test("is-category-exist", "Nilai kategori tidak valid!", (value) => {
          return categories.map((category) => category.slug).includes(value);
        }),
      condition: Yup.string()
        .required("Kondisi produk harus diisi!")
        .test("is-new-or-old", "Nilai harus baru atau bekas", (value) => {
          return value === "Baru" || value === "Bekas";
        }),
      price: Yup.number().required("Harga produk harus diisi!"),
      images: Yup.mixed().required("At least one image is required"),
    }),
    onSubmit: handleCreateProduct,
  });

  return (
    <form
      method="POST"
      encType="multipart/form-data"
      onSubmit={formik.handleSubmit}
    >
      <div className="bg-white p-3 rounded shadow mb-5">
        <p className="text-2xl font-bold text-primary">Tambah Produk Baru</p>
      </div>
      <div className="bg-white p-3 rounded shadow">
        <div className="image-preview grid grid-cols-2 sm:grid-cols-4 gap-2">
          {selectedImages.map((url, index) => (
            <div
              key={index}
              className="image-preview-item flex justify-center flex-col m-2"
            >
              <Image
                src={url}
                alt={`Image ${index}`}
                width={144}
                height={144}
                className="p-1 border-dashed border-indigo-500 border-2 m-2 object-cover mb-3 mx-auto"
              />
              <button
                onClick={(e) => handleImageDelete(e, index)}
                className="btn m-auto mt-2"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <label
            htmlFor="images"
            className="w-36 h-36 p-1 border-dashed border-indigo-500 border-2 m-2 flex items-center justify-center cursor-pointer text-indigo-500 text-sm"
          >
            <FaPlus />
            Tambah Foto
          </label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            onBlur={formik.handleBlur}
            // {...formik.getFieldProps("images")}
            className="hidden"
          />
        </div>
        {formik.touched.images && formik.errors.images ? (
          <span className="text-error text-xs">{formik.errors.images}</span>
        ) : null}
      </div>
      <div className="mt-5 bg-white p-3 rounded shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3">
          <label htmlFor="name" className="w-36 text-sm required">
            Nama Produk
          </label>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              name="name"
              id="name"
              className=" input input-md input-bordered required block sm:w-[370px] w-full"
              placeholder="Tuliskan nama produkmu"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name ? (
              <span className="text-error text-xs">{formik.errors.name}</span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3">
          <label htmlFor="description" className="w-36 text-sm required">
            Deskripsi Produk
          </label>
          <div className="w-full sm:w-auto">
            <textarea
              type="text"
              name="description"
              id="description"
              className="input input-md input-bordered leading-4 h-32 pt-3 w-full sm:w-[370px]"
              placeholder="Tuliskan deskripsi produkmu"
              {...formik.getFieldProps("description")}
            />
          </div>
          {formik.touched.description && formik.errors.description ? (
            <span className="text-error text-xs">
              {formik.errors.description}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3">
          <label htmlFor="stock" className="w-36 text-sm required">
            Stok Produk
          </label>
          <div className="w-full sm:w-auto">
            <input
              type="number"
              name="stock"
              id="stock"
              className=" w-full sm:w-[370px] input input-md input-bordered required"
              placeholder="Tuliskan jumlah stok"
              {...formik.getFieldProps("stock")}
            />
          </div>

          {formik.touched.stock && formik.errors.stock ? (
            <span className="text-error text-xs">{formik.errors.stock}</span>
          ) : null}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3">
          <label htmlFor="category" className="w-36 text-sm required">
            Kategori
          </label>
          <div className="w-full sm:w-auto">
            <select
              id="category"
              className="select select-bordered w-full sm:w-[370px]"
              name="category"
              {...formik.getFieldProps("category")}
            >
              <option value={""} disabled selected>
                Pilih Kategori
              </option>
              {categories.map((category) => (
                <option value={category.slug} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {formik.touched.category && formik.errors.category ? (
            <span className="text-error text-xs">{formik.errors.category}</span>
          ) : null}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3">
          <label htmlFor="price" className="w-36 text-sm required">
            Harga Produk
          </label>
          <div className="join w-full sm:w-auto">
            <span className="btn join-item">Rp.</span>
            <input
              type="text"
              name="price"
              id="price"
              className="input input-md input-bordered required join-item w-full sm:w-80"
              placeholder="Tuliskan harga produk (tanpa titik/koma)"
              {...formik.getFieldProps("price")}
            />
            {formik.touched.price && formik.errors.price ? (
              <span className="text-error text-xs">{formik.errors.price}</span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3">
          <label htmlFor="condition" className="w-36 text-sm">
            Kondisi
          </label>
          <div className="w-full sm:w-auto">
            <select
              className="select select-bordered w-full sm:w-[370px]"
              name="condition"
              id="condition"
              {...formik.getFieldProps("condition")}
            >
              <option value={""} disabled selected>
                Pilih Kondisi
              </option>
              <option value={"Baru"}>Baru</option>
              <option value={"Bekas"}>Bekas</option>
            </select>
          </div>
          {formik.touched.condition && formik.errors.condition ? (
            <span className="text-error text-xs">
              {formik.errors.condition}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5 bg-white p-3 rounded shadow">
        <button
          type="submit"
          className="btn btn-primary me-3"
          disabled={loading}
        >
          <FaFloppyDisk />
          Simpan
          {loading && <span className="loading loading-spinner"></span>}
        </button>
        <button className="btn" onClick={() => setAddProduct(false)}>
          <FaBan />
          Cancel
        </button>
      </div>
    </form>
  );
}
