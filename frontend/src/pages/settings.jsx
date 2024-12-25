import LayoutApp from "@/components/LayoutApp";
import ProtectedPage from "@/components/protect-pages/ProtectedPage";
import { UserContext } from "@/contexts/userContext";
import { myToastError, myToastSuccess } from "@/utils/myToast";
import axios from "axios";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import Image from "next/legacy/image";
import { useContext, useEffect, useRef, useState } from "react";
import { FaFloppyDisk, FaPencil, FaRepeat } from "react-icons/fa6";
import Skeleton from "react-loading-skeleton";
import * as Yup from "yup";

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [saveButton, setSaveButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [errors, setErrors] = useState({});
  const inputNameRef = useRef();
  const inputUsernameRef = useRef();
  const inputPhoneRef = useRef();
  const inputAddressRef = useRef();

  const { setUser } = useContext(UserContext);

  const handleUpdateImage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/profile/update-image",
        {
          image: image,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X_XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
          },
        }
      );
      if (response.status === 200) {
        const user = await axios.get("/api/me");
        setUser(user.data.data);
        myToastSuccess("Foto profile berhasil diubah!");
      }
    } catch (error) {
      myToastError(error.response.data.message);
      setErrors(error.response.data.errors);
    }
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

  const handleChangeCheckInput = () => {
    if (
      inputNameRef.current.value !== profile.name ||
      inputAddressRef.current.value !== profile.address ||
      inputUsernameRef.current.value !== profile.username ||
      inputPhoneRef.current.value !== profile.phone
    ) {
      setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `/api/profile`,
        {
          name: inputNameRef.current.value,
          username: inputUsernameRef.current.value,
          phone: inputPhoneRef.current.value,
          address: inputAddressRef.current.value,
        },
        {
          headers: {
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
          },
        }
      );
      if (response.status) {
        setLoading(false);
        setSaveButton(false);
        myToastSuccess("Profile berhasil di update!");
      }
    } catch (error) {
      formik.setErrors(error.response.data.errors);
      setLoading(false);
      myToastError("Gagal");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      username: "",
      phone: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      phone: Yup.number().required("Required"),
      address: Yup.string().required("Required"),
    }),
    onSubmit: handleEdit,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoadingSkeleton(true);
      try {
        axios.get("sanctum/csrf-cookie");
        const response = await axios.get("/api/me");
        formik.setFieldValue("username", response.data.data.username);
        formik.setFieldValue("name", response.data.data.name);
        formik.setFieldValue("phone", response.data.data.phone);
        formik.setFieldValue("address", response.data.data.address);
        setProfile(response.data.data);
        setLoadingSkeleton(false);
      } catch (error) {}
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProtectedPage>
      <LayoutApp>
        <div className="max-w-3xl mx-auto">
          <div className="sm:flex">
            <div className="bg-white p-4 rounded shadow me-5 h-full mb-5">
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
                      alt="Image"
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src={
                        profile?.image
                          ? `${process.env.NEXT_PUBLIC_API_BACKEND}/${profile?.image}`
                          : "/assets/avatar.jpg"
                      }
                      layout="fill"
                      objectFit="cover"
                      alt="Image"
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
                <p className="text-sm text-center mt-3">
                  *Ukuran maksimal 500kb
                </p>
                {errors?.image && (
                  <p className="text-error text-center text-xs mt-2">
                    {errors.image}
                  </p>
                )}
                <button
                  className="btn btn-primary btn-block mt-4"
                  type="submit"
                >
                  <FaRepeat />
                  Ganti Gambar
                </button>
              </form>
            </div>
            <div className="bg-white p-4 rounded shadow h-full w-full">
              <form onSubmit={formik.handleSubmit} method="put">
                {loadingSkeleton ? (
                  <div className="flex items-center">
                    <div className="basis-1/4 me-3">
                      <Skeleton count={4} height={50} />
                    </div>
                    <div className="basis-2/3">
                      <Skeleton count={4} height={50} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center mb-3">
                      <label htmlFor="name" className="basis-1/3 text-sm">
                        Nama
                      </label>
                      <input
                        name="name"
                        id="name"
                        type="text"
                        className="basis-2/3 input input-md input-bordered"
                        placeholder="Tuliskan nama"
                        ref={inputNameRef}
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChangeCheckInput();
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        // {...formik.getFieldProps("name")}
                      />
                      {formik.touched.name && formik.errors.name ? (
                        <span className="text-error text-xs">
                          {formik.errors.name}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center mb-3">
                      <label htmlFor="username" className="basis-1/3 text-sm">
                        Username
                      </label>
                      <input
                        name="username"
                        id="username"
                        type="text"
                        className="basis-2/3 input input-md input-bordered"
                        ref={inputUsernameRef}
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChangeCheckInput();
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        placeholder="Tuliskan username"
                        // {...formik.getFieldProps("address")}
                      />
                      {formik.touched.username && formik.errors.username ? (
                        <span className="text-error text-xs">
                          {formik.errors.username}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center mb-3">
                      <label htmlFor="phone" className="basis-1/3 text-sm">
                        Nomor Whatsapp
                      </label>
                      <input
                        name="phone"
                        id="phone"
                        type="text"
                        className="basis-2/3 input input-md input-bordered"
                        ref={inputPhoneRef}
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChangeCheckInput();
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        placeholder="Tuliskan nomor Whatsapp"
                        // {...formik.getFieldProps("address")}
                      />
                      {formik.touched.phone && formik.errors.phone ? (
                        <span className="text-error text-xs">
                          {formik.errors.phone}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center mb-3">
                      <label htmlFor="address" className="basis-1/3 text-sm">
                        Alamat
                      </label>
                      <textarea
                        name="address"
                        id="address"
                        className="basis-2/3 input input-md input-bordered pt-2"
                        ref={inputAddressRef}
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleChangeCheckInput();
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                        placeholder="Tuliskan Alamat"
                        // {...formik.getFieldProps("address")}
                      />
                      {formik.touched.address && formik.errors.address ? (
                        <span className="text-error text-xs">
                          {formik.errors.address}
                        </span>
                      ) : null}
                    </div>
                  </>
                )}

                <div className="mt-5">
                  <button
                    type="submit"
                    className="btn btn-warning me-3 disabled:opacity-70 disabled:btn-warning"
                    disabled={!saveButton || loading}
                  >
                    <FaFloppyDisk />
                    Save{" "}
                    {loading && (
                      <span className="loading loading-spinner"></span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </LayoutApp>
    </ProtectedPage>
  );
}
