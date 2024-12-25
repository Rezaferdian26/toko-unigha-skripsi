import Layout from "@/components/layout";
import Link from "next/link";
import {
  FaEnvelope,
  FaLocationDot,
  FaLock,
  FaPhone,
  FaUser,
} from "react-icons/fa6";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext, useEffect } from "react";
import { UserContext } from "@/contexts/userContext";
import { myToastError, myToastSuccess } from "@/utils/myToast";
import { useRouter } from "next/router";
import HeadMetaTag from "@/components/HeadMetaTag";
import Cookies from "js-cookie";

export default function Register() {
  const { loading, setLoading, isLogin, setIsLogin, setUser } =
    useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (isLogin) {
      router.back();
      myToastError("Anda sudah login");
    }
    setLoading(false);
  }, [isLogin, router, setLoading]);
  const handleRegister = async () => {
    setLoading(true);
    //initialize formData
    const formData = new FormData();

    //append data to formData
    formData.append("name", formik.values.name);
    formData.append("username", formik.values.username);
    formData.append("email", formik.values.email);
    formData.append("phone", formik.values.phone);
    formData.append("address", formik.values.address);
    formData.append("password", formik.values.password);
    formData.append(
      "password_confirmation",
      formik.values.passwordConfirmation
    );

    try {
      const response = await axios.post("/register", formData, {
        headers: {
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });
      if (response.status === 201) {
        myToastSuccess("Register Berhasil");
        setLoading(false);
        const responseUser = await axios.get("/api/me");
        if (responseUser.status === 200) {
          setUser(responseUser.data.data);
          setIsLogin(true);
          router.replace("/email-verify");
        } else {
          setIsLogin(false);
          setLoading(false);
        }
      } else {
        myToastError("Register Gagal");
        setLoading(false);
      }
    } catch ({ response }) {
      myToastError("Register Gagal");

      formik.setErrors(response.data.errors);
      setUser({});
      setIsLogin(false);
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      address: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      username: Yup.string()
        .min(3, "Username harus memiliki setidaknya 3 karakter")
        .max(30, "Username tidak boleh lebih dari 30 karakter")
        .required("Username wajib diisi")
        .matches(
          /^[a-zA-Z0-9_]*$/,
          "Username hanya boleh berisi huruf, angka, atau garis bawah"
        ),
      address: Yup.string().required("Alamat wajib diisi"),
      email: Yup.string()
        .email("Alamat email tidak valid")
        .required("Email wajib diisi"),
      phone: Yup.string()
        .min(10, "Nomor telepon minimal 10 digit")
        .max(15, "Nomor telepon maximal 15 digit")
        .required("Nomor telepon wajib diisi")
        .matches(
          /^\+?\d{10,15}$/,
          "Invalid phone number format. Ex : +6281234567890 / 081234567890"
        ),
      password: Yup.string()
        .required("Password wajib diisi")
        .min("8", "Password minimun 8 karakter"),
      passwordConfirmation: Yup.string()
        .required("Konfirmasi password wajib diisi")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: handleRegister,
  });

  return (
    <>
      <HeadMetaTag
        title="Toko Unigha | Register"
        pathname="/register"
        metaDescription="Bergabunglah dengan komunitas Unigha, platform toko resmi Universitas Jabal Ghafur. Daftar sekarang untuk mendapatkan akses eksklusif ke penawaran khusus, promo mahasiswa, dan koleksi produk universitas terbaru. Proses registrasi cepat dan mudah, sambut keanggotaan baru Anda dan nikmati pengalaman berbelanja yang lebih personal di Unigha."
      />
      <Layout>
        <div className="bg-white shadow-md max-w-xl mx-auto p-10 rounded">
          <h1 className="text-center font-bold text-3xl tracking-wide mb-5">
            Register
          </h1>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Type your name"
                  className="shadow-sm text-sm rounded shadow-gray-300 w-full active:border-none input p-4 ps-8 h-0"
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name ? (
                  <span className="text-error text-xs">
                    {formik.errors.name}
                  </span>
                ) : null}
                <FaUser className="absolute top-2.5 left-2 text-sm text-gray-400" />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Type your username"
                  className="shadow-sm text-sm rounded shadow-gray-300 w-full active:border-none input p-4 ps-8 h-0"
                  {...formik.getFieldProps("username")}
                />
                {formik.touched.username && formik.errors.username ? (
                  <span className="text-error text-xs">
                    {formik.errors.username}
                  </span>
                ) : null}
                <FaUser className="absolute top-2.5 left-2 text-sm text-gray-400" />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm mb-1 mt-3">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Type your email"
                  className="shadow-sm text-sm rounded shadow-gray-300 w-full active:border-none input p-4 ps-8 h-0"
                  {...formik.getFieldProps("email")}
                />
                <FaEnvelope className="absolute top-2.5 left-2 text-sm text-gray-400" />
                {formik.touched.email && formik.errors.email ? (
                  <span className="text-error text-xs">
                    {formik.errors.email}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm mb-1">
                Nomor Telepon/Whatsapp
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Type your phone"
                  className="shadow-sm text-sm rounded shadow-gray-300 w-full active:border-none input p-4 ps-8 h-0"
                  {...formik.getFieldProps("phone")}
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <span className="text-error text-xs">
                    {formik.errors.phone}
                  </span>
                ) : null}
                <FaPhone className="absolute top-2.5 left-2 text-sm text-gray-400" />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm mb-1 mt-3">
                Alamat
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Type your address"
                  className="shadow-sm text-sm rounded shadow-gray-300 w-full active:border-none input p-4 ps-8 h-0"
                  {...formik.getFieldProps("address")}
                />
                <FaLocationDot className="absolute top-2.5 left-2 text-sm text-gray-400" />
                {formik.touched.address && formik.errors.address ? (
                  <span className="text-error text-xs">
                    {formik.errors.address}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm mb-1 mt-3">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Type your password"
                  className="shadow-sm text-sm rounded shadow-gray-300 w-full active:border-none input p-4 ps-8 h-0"
                  {...formik.getFieldProps("password")}
                />
                <FaLock className="absolute top-2.5 left-2 text-sm text-gray-400" />
                {formik.touched.password && formik.errors.password ? (
                  <span className="text-error text-xs">
                    {formik.errors.password}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm mb-1 mt-3">
                Konfirmasi password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  placeholder="Repeat your password"
                  {...formik.getFieldProps("passwordConfirmation")}
                  className="shadow-sm text-sm rounded shadow-gray-300 w-full active:border-none input p-4 ps-8 h-0"
                />
                <FaLock className="absolute top-2.5 left-2 text-sm text-gray-400" />
                {formik.touched.passwordConfirmation &&
                formik.errors.passwordConfirmation ? (
                  <span className="text-error text-xs">
                    {formik.errors.passwordConfirmation}
                  </span>
                ) : null}
              </div>
            </div>
            {formik.isValid && formik.dirty ? (
              <button
                type="submit"
                className="btn btn-warning w-full mt-5 disabled:opacity-70"
                disabled={loading}
              >
                Register
                {loading && <span className="loading loading-spinner"></span>}
              </button>
            ) : (
              <button
                type="button"
                className="btn disabled:bg-warning disabled:opacity-70 disabled:text-black w-full mt-5 disabled:cursor-not-allowed"
                disabled
              >
                Register
              </button>
            )}
            <p className="text-sm text-center mt-20">
              Have already an account?
              <Link href="/login">
                <span className="text-primary"> Login here</span>
              </Link>
            </p>
          </form>
        </div>
      </Layout>
    </>
  );
}
