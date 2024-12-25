import Layout from "@/components/layout";
import { FaEnvelope } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";
import Link from "next/link";
import { useFormik } from "formik";

import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/userContext";
import { TokoContext } from "@/contexts/tokoContext";
import { myToastSuccess } from "@/utils/myToast";
import Loading from "@/components/Loading";
import HeadMetaTag from "@/components/HeadMetaTag";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

export default function Login() {
  const { isLogin, setIsLogin, loading, setLoading, setUser } =
    useContext(UserContext);
  const { setToko } = useContext(TokoContext);
  const [render, setRender] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
    if (isLogin) {
      setRender(true);
      router.replace("/");
    } else {
      setRender(true);
    }
  }, [isLogin, router, setLoading]);

  const handleLogin = async () => {
    setLoading(true);
    //initialize formData
    const formData = new FormData();

    //append data to formData
    formData.append("email", formik.values.email);
    formData.append("password", formik.values.password);

    try {
      await axios.get("sanctum/csrf-cookie");
      const response = await axios.post("/login", formData, {
        headers: {
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });
      const { data } = await axios.get("api/me");
      myToastSuccess("Login Berhasil");
      setUser(data.data);
      localStorage.setItem("user", JSON.stringify(data.data));
      setIsLogin(true);
      setLoading(false);
      try {
        await axios.get("sanctum/csrf-cookie");
        const responseToko = await axios.get("api/get-toko-user");
        setToko(responseToko.data.data);
        router.replace("/");
      } catch (error) {
        console.log(error);
        setToko(null);
        router.replace("/");
      }
    } catch (error) {
      setLoading(false);
      formik.setErrors(error.response.data.errors);
    }
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .required("Required")
        .min("8", "Password minimun 8 karakter"),
    }),
    onSubmit: handleLogin,
  });

  return (
    <>
      <HeadMetaTag
        title="Toko Unigha | Login"
        metaDescription="Selamat datang kembali di Unigha, platform web toko resmi Universitas Jabal Ghafur. Segera login ke akun Anda untuk melanjutkan pengalaman belanja eksklusif. Akses ke pesanan terbaru, kelola profil Anda, dan nikmati kemudahan berbelanja produk universitas dan merchandise unik. Jaga keamanan akun Anda dan sambut kenyamanan belanja online di Unigha."
        pathname="/login"
      />
      <Layout>
        {!isLogin && render ? (
          <div className="bg-white shadow-md max-w-sm mx-auto p-10 rounded">
            <h1 className="text-center font-bold text-3xl tracking-wide mb-5">
              Login
            </h1>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-2">
                <label htmlFor="email" className="block text-sm mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Type your email"
                    autoComplete="false"
                    className=" shadow-sm text-sm rounded shadow-gray-300 w-full active:border-none input p-4 ps-8 h-0"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <span className="text-error text-xs">
                      {formik.errors.email}
                    </span>
                  ) : null}
                  <FaEnvelope className="absolute top-2.5 left-2 text-sm text-gray-400" />
                </div>
              </div>
              <div className="mb-2">
                <label htmlFor="password" className="block text-sm mb-1 mt-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Type your password"
                    className=" shadow-sm text-sm rounded shadow-gray-300 w-full active:border-none input p-4 ps-8 h-0"
                    {...formik.getFieldProps("password")}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <span className="text-error text-xs">
                      {formik.errors.password}
                    </span>
                  ) : null}
                  <FaLock className="absolute top-2.5 left-2 text-sm text-gray-400" />
                </div>
              </div>
              <Link href="#">
                <p className="text-sm text-end text-primary">
                  Forgot Password?
                </p>
              </Link>
              {formik.isValid && formik.dirty ? (
                <button
                  type="submit"
                  className="btn btn-warning w-full mt-5 disabled:opacity-70"
                  disabled={loading}
                >
                  Login
                  {loading && <span className="loading loading-spinner"></span>}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn disabled:bg-warning disabled:opacity-70 disabled:text-black w-full mt-5 disabled:cursor-not-allowed"
                  disabled
                >
                  Login
                </button>
              )}
              <p className="text-sm text-center mt-20">
                Doesn&apos;t have an account yet?{" "}
                <Link href="/register">
                  <span className="text-primary">Register here</span>
                </Link>
              </p>
            </form>
          </div>
        ) : (
          <div className="h-screen flex items-center justify-center">
            <Loading />
          </div>
        )}
      </Layout>
    </>
  );
}
