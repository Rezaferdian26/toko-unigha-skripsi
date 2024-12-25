import { myToastError, myToastSuccess } from "@/utils/myToast";
import axios from "axios";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import { FaBan, FaFloppyDisk, FaPlus, FaTrash } from "react-icons/fa6";
import * as Yup from "yup";

export default function EditProduct({
  id,
  setEdit,
  products,
  setProducts,
  categories,
}) {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [tempImage, setTempImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleImageDatabaseDelete = async (e, idImage, index) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`/api/product-image/${idImage}`, {
        headers: {
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });
      if (response.status === 200) {
        myToastSuccess("Gambar produk berhasil dihapus");
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newProduct = response.data.product;
        const indexToUpdate = products.findIndex((item) => item.id === id);
        if (indexToUpdate !== -1) {
          // Salin array objek asli
          const updatedData = [...products];

          // Gantikan elemen yang ditemukan dengan objek yang baru
          updatedData[indexToUpdate] = newProduct;

          setProducts(updatedData);
        }
      }
    } catch (error) {
      if (error.response.data.message) {
        myToastError(error.response.data.message);
      } else {
        myToastError(error.message);
      }
    }
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

  const handleUpdateProduct = async () => {
    // setLoading(true);
    const formData = new FormData();
    // Menambahkan data produk ke formData
    formData.append("name", formik.values.name);
    formData.append("description", formik.values.description);
    formData.append("stock", formik.values.stock);
    formData.append("category", formik.values.category);
    formData.append("condition", formik.values.condition);
    formData.append("price", formik.values.price);
    formData.append("_method", "PUT");

    // Menambahkan berkas gambar ke formData
    for (let value of tempImage) {
      formData.append("images[]", value);
    }

    try {
      const response = await axios.post(`/api/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });
      if (response.status === 200) {
        setLoading(false);
        setEdit(false);
        myToastSuccess("Produk berhasil di update!");

        const newProduct = response.data.data;

        const indexToUpdate = products.findIndex((item) => item.id === id);
        if (indexToUpdate !== -1) {
          // Salin array objek asli
          const updatedData = [...products];

          // Gantikan elemen yang ditemukan dengan objek yang baru
          updatedData[indexToUpdate] = newProduct;

          setProducts(updatedData);
        } else {
          console.error("Elemen dengan id yang ditentukan tidak ditemukan.");
        }
      }
    } catch (error) {
      setLoading(false);
      myToastError(`Error : ${error}`);
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
      category: Yup.string().required("Kategori produk harus diisi!"),
      condition: Yup.string().required("Kategori produk harus diisi!"),
      price: Yup.number().required("Harga produk harus diisi!"),
      images: Yup.mixed().required("At least one image is required"),
    }),
    onSubmit: handleUpdateProduct,
  });

  useEffect(() => {
    // window.scrollTo(0, 0); // Atur scroll ke paling atas saat komponen dipasang
    const fetchData = async () => {
      try {
        const response = await axios.get(`api/user-products/${id}`);
        setSelectedCategories(categories);
        formik.setValues({
          name: response.data.data.name,
          description: response.data.data.description,
          stock: response.data.data.stock,
          category: response.data.data.category,
          condition: response.data.data.condition,
          price: response.data.data.price,
          images: response.data.data.images,
        });
        setImages(response.data.data.images);
        setRender(true);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (!render) {
    return <div>Loading</div>;
  }
  return (
    <form
      method="POST"
      encType="multipart/form-data"
      onSubmit={formik.handleSubmit}
    >
      <div className="bg-white p-3 rounded shadow mb-5">
        <p className=" text-2xl font-bold text-warning ">Edit Produk</p>
      </div>
      {images && (
        <div className="bg-white rounded shadow">
          <h1 className="text-white bg-primary rounded-t text-center p-2">
            Gambar saat ini
          </h1>
          <div className="p-3">
            <div className="image-preview grid grid-cols-2 sm:grid-cols-4 gap-2">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="image-preview-item flex justify-center flex-col"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BACKEND}${url.image_path}`}
                    alt={`Image ${index}`}
                    width={144}
                    height={144}
                    className="p-1 border-dashed border-indigo-500 border-2 m-2 object-cover mx-auto"
                  />
                  <button
                    onClick={(e) =>
                      handleImageDatabaseDelete(e, url.image_id, index)
                    }
                    className="btn m-auto mt-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow mt-5">
        <h1 className="text-white bg-primary rounded-t text-center p-2">
          Tambah gambar baru
        </h1>
        <div className="p-3">
          <div className="image-preview grid grid-cols-2 sm:grid-cols-4 gap-2">
            {selectedImages.map((url, index) => (
              <div
                key={index}
                className="image-preview-item flex justify-center flex-col"
              >
                <Image
                  src={url}
                  alt={`Image ${index}`}
                  width={144}
                  height={144}
                  className="p-1 border-dashed border-indigo-500 border-2 m-2 object-cover mx-auto"
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
      </div>
      <div className="mt-5 bg-white p-3 rounded shadow">
        <div className="flex items-center mb-3">
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
        <div className="flex items-center mb-3">
          <label htmlFor="description" className="w-36 text-sm required">
            Deskripsi Produk
          </label>
          <div className="w-full sm:w-auto">
            <textarea
              type="text"
              name="description"
              id="description"
              className="sm:w-[370px] w-full input input-md input-bordered leading-4 h-32 pt-3"
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
        <div className="flex items-center mb-3">
          <label htmlFor="stock" className="w-36 text-sm required">
            Stok Produk
          </label>
          <div className="w-full sm:w-auto">
            <input
              type="number"
              name="stock"
              id="stock"
              className="sm:w-[370px] w-full input input-md input-bordered required"
              placeholder="Tuliskan jumlah stok"
              {...formik.getFieldProps("stock")}
            />
          </div>
          {formik.touched.stock && formik.errors.stock ? (
            <span className="text-error text-xs">{formik.errors.stock}</span>
          ) : null}
        </div>
        <div className="flex items-center mb-3">
          <label htmlFor="category" className="w-36 text-sm required">
            Kategori
          </label>
          <div className="w-full sm:w-auto">
            <select
              id="category"
              className="select select-bordered sm:w-[370px] w-full"
              name="category"
              {...formik.getFieldProps("category")}
            >
              {selectedCategories.map((category) => (
                <>
                  <option
                    key={category.id}
                    value={category.name}
                    selected={category.name === formik.values.category}
                  >
                    {category.name}
                  </option>
                </>
              ))}
            </select>
          </div>
          {formik.touched.category && formik.errors.category ? (
            <span className="text-error text-xs">{formik.errors.category}</span>
          ) : null}
        </div>
        <div className="flex items-center mb-3">
          <label htmlFor="price" className="w-36 text-sm required">
            Harga Produk
          </label>
          <div className="join w-full sm:w-auto">
            <span className="btn join-item">Rp.</span>
            <input
              type="text"
              name="price"
              id="price"
              className="input input-md input-bordered required join-item sm:w-80 w-full"
              placeholder="Tuliskan harga produk (tanpa titik/koma)"
              {...formik.getFieldProps("price")}
            />
            {formik.touched.price && formik.errors.price ? (
              <span className="text-error text-xs">{formik.errors.price}</span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center mb-3">
          <label htmlFor="condition" className="w-36 text-sm">
            Kondisi
          </label>
          <div className="w-full sm:w-auto">
            <select
              className="select select-bordered sm:w-[370px] w-full"
              name="condition"
              id="condition"
              defaultValue={"Baru"}
              {...formik.getFieldProps("condition")}
            >
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
          className="btn btn-primary me-3 disabled:btn-primary disabled:opacity-75 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <FaFloppyDisk />
          Simpan
          {loading && <span className="loading loading-spinner "></span>}
        </button>
        <button className="btn" onClick={() => setEdit(false)}>
          <FaBan />
          Cancel
        </button>
      </div>
    </form>
  );
}
