import Link from "next/link";
import { useContext, useEffect } from "react";
import { FaGear, FaRightFromBracket, FaStore, FaUser } from "react-icons/fa6";
import styles from "./navbar.module.css";
import { useRouter } from "next/router";
import { UserContext } from "@/contexts/userContext";
import { TokoContext } from "@/contexts/tokoContext";
import Image from "next/legacy/image";
import axios from "axios";
import Cookies from "js-cookie";
import { MdPayments } from "react-icons/md";

export default function NavbarMenu() {
  const router = useRouter();
  const { toko, setToko } = useContext(TokoContext);
  const { isLogin, setIsLogin, setLoading, loading, setUser, user } =
    useContext(UserContext);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  if (loading) {
    return (
      <ul className={`menu menu-horizontal px-1 ${styles.ul}`}>
        <div className="m-auto">
          <span className="loading loading-bars loading-md"></span>
        </div>
      </ul>
    );
  }

  const logoutHandler = async () => {
    setLoading(true);
    await axios.get("sanctum/csrf-cookie");
    await axios.post(
      "/logout",
      {},
      {
        headers: {
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      }
    );
    setIsLogin(false);
    setUser({});
    setLoading(false);
    setToko(null);
    router.replace("/");
  };

  const tokoClickHandler = async () => {
    if (toko) {
      router.push("/mytoko");
    } else router.push("/buka-toko");
  };

  return (
    <ul className={`menu menu-horizontal justify-end px-1 ${styles.ul} `}>
      <>
        {/* <Link
          href="#"
          className={`mb-5 sm:mb-0 me-2 hidden sm:block text-warning`}
        >
          <label tabIndex={0} className={`btn btn-ghost w-full`}>
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="badge badge-sm indicator-item bg-warning border-none">
                8
              </span>
            </div>
          </label>
        </Link> */}
        {isLogin && !loading ? (
          <>
            {/* <li className="mb-2 mx-2 sm:mb-0 sm:hidden block">
            <Link href="/keranjang" className="me-2 p-0">
              <button className="btn sm:btn-block btn-wide btn-outline btn-warning text-white">
                <div className="indicator me-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item bg-warning border-none">
                    8
                  </span>
                </div>
                Keranjang
              </button>
            </Link>
          </li> */}
            <li className="mb-2 mx-2 sm:mb-0">
              <a onClick={tokoClickHandler} className="me-2 p-0">
                <button className="btn sm:btn-block btn-wide btn-outline btn-warning text-white">
                  <FaStore className="text-xl" />
                  Toko
                </button>
              </a>
            </li>
            {/* ukuran tablet-laptop */}
            <div className="dropdown dropdown-end hidden sm:block">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  {user.image !== null ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BACKEND}/${user.image}`}
                      width={50}
                      height={50}
                      alt="profile"
                    />
                  ) : (
                    <Image
                      width={50}
                      height={50}
                      src="/assets/avatar.webp"
                      alt="image profile"
                    />
                  )}
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 text-gray-800 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/profile">
                    <FaUser className="me-2 text-gray-700" /> Profile
                  </Link>
                </li>
                <li>
                  <Link href="/myorder">
                    <MdPayments className="me-2 text-gray-700" /> Pesanan Saya
                  </Link>
                </li>
                <li>
                  <Link href="/settings">
                    <FaGear className="me-2 text-gray-700" /> Settings
                  </Link>
                </li>
                <li>
                  <a onClick={logoutHandler}>
                    <FaRightFromBracket className="me-2 text-gray-700" /> Logout
                  </a>
                </li>
              </ul>
            </div>
            {/* ketika ukuran mobile */}
            <div className="sm:hidden">
              <li className="mb-2 mx-2 sm:mb-0">
                <Link href="/profile" className="me-2 p-0">
                  <button className="btn sm:btn-block btn-wide btn-outline btn-warning text-white">
                    <FaUser className="text-xl" />
                    Profile
                  </button>
                </Link>
              </li>
              <li className="mb-2 mx-2 sm:mb-0">
                <Link href="/settings" className="me-2 p-0">
                  <button className="btn sm:btn-block btn-wide btn-outline btn-warning text-white">
                    <FaGear className="text-xl" />
                    Settings
                  </button>
                </Link>
              </li>
              <li className="mb-2 mx-2 sm:mb-0">
                <a onClick={logoutHandler} className="me-2 p-0">
                  <button className="btn sm:btn-block btn-wide btn-warning text-white">
                    <FaRightFromBracket className="text-xl" />
                    Logout
                  </button>
                </a>
              </li>
            </div>
          </>
        ) : (
          <>
            <li className="mb-2 sm:mb-0">
              <Link href="/login" className="me-2 p-0">
                <button className="btn sm:btn-block btn-outline btn-wide btn-warning">
                  Masuk
                </button>
              </Link>
            </li>
            <li className="mb-2 sm:mb-0">
              <Link href="/register" className="me-2 p-0">
                <button className="btn sm:btn-block btn-wide btn-warning">
                  Daftar
                </button>
              </Link>
            </li>
          </>
        )}
      </>
    </ul>
  );
}
