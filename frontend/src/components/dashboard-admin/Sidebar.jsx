import Link from "next/link";
import { RxDashboard, RxPerson, RxSketchLogo } from "react-icons/rx";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";

import styles from "./sidebar.module.css";
import { useState } from "react";
import { FaList, FaStore, FaStoreSlash } from "react-icons/fa6";

export default function SideBar({ children, linkActive }) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex justify-between">
      <section
        className={`${
          show && "w-64 sm:w-1/2 md:w-1/3 lg:w-1/4"
        } z-10 fixed w-20 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between transition-all duration-300`}
      >
        <div className="flex flex-col items-center">
          <Link href={"/"} title="Home">
            <div className="bg-primary text-white p-3 rounded-lg inline-block">
              <RxSketchLogo size={20} className="inline" />
              <span className={`${!show ? "hidden" : ""} ml-3`}>
                Admin Dashboard
              </span>
            </div>
          </Link>
          <span className="border-b-[1px] border-gray-200 w-full p-2"></span>
          <div className={`my-4 ${show ? "w-full" : ""}`}>
            <Link href={"/admin"} title="Dashboard">
              <div
                className={`bg-gray-100 ${show ? "w-full" : ""}
                ${
                  linkActive === "dashboard"
                    ? "bg-warning hover:bg-yellow-500"
                    : ""
                } 
                hover:bg-gray-200 cursor-pointer p-3 rounded-lg inline-block`}
              >
                <RxDashboard size={20} className="inline" />
                <span className={`${!show ? "hidden" : ""} ml-3`}>
                  Dashboard
                </span>
              </div>
            </Link>
          </div>
          <div className={`mb-4 ${show ? "w-full" : ""}`}>
            <Link href={"/admin/users"} title="Users">
              <div
                className={`bg-gray-100 
                ${show ? "w-full" : ""}  
                ${
                  linkActive === "users" ? "bg-warning hover:bg-yellow-500" : ""
                }
                hover:bg-gray-200 cursor-pointer p-3 rounded-lg inline-block`}
              >
                <RxPerson size={20} className="inline" />
                <span className={`${!show ? "hidden" : ""} ml-3`}>Users</span>
              </div>
            </Link>
          </div>
          <div className={`mb-4 ${show ? "w-full" : ""}`}>
            <Link href={"/admin/toko"} title="Toko">
              <div
                className={`bg-gray-100 ${show ? "w-full" : ""} 
                ${linkActive === "toko" ? "bg-warning hover:bg-yellow-500" : ""}
                hover:bg-gray-200 cursor-pointer p-3 rounded-lg inline-block`}
              >
                <FaStore size={20} className="inline" />
                <span className={`${!show ? "hidden" : ""} ml-3`}>Toko</span>
              </div>
            </Link>
          </div>
          <div className={`mb-4 ${show ? "w-full" : ""}`}>
            <Link
              href={"/admin/pengajuan-buka-toko"}
              title="Pengajuan Buka Toko"
            >
              <div
                className={`bg-gray-100 ${show ? "w-full" : ""} 
                ${
                  linkActive === "pengajuan-buka-toko"
                    ? "bg-warning hover:bg-yellow-500"
                    : ""
                }
                hover:bg-gray-200 cursor-pointer p-3 rounded-lg inline-block`}
              >
                <FaStoreSlash size={20} className="inline" />
                <span className={`${!show ? "hidden" : ""} ml-3`}>
                  Pengajuan Buka Toko
                </span>
              </div>
            </Link>
          </div>
          <div className={`mb-4 ${show ? "w-full" : ""}`}>
            <Link href={"/admin/products"} title="Produk">
              <div
                className={`bg-gray-100 ${show ? "w-full" : ""} 
                ${
                  linkActive === "product"
                    ? "bg-warning hover:bg-yellow-500"
                    : ""
                }
                hover:bg-gray-200 cursor-pointer p-3 rounded-lg inline-block`}
              >
                <HiOutlineShoppingBag size={20} className="inline" />
                <span className={`${!show ? "hidden" : ""} ml-3`}>Produk</span>
              </div>
            </Link>
          </div>
          <div className={`mb-4 ${show ? "w-full" : ""}`}>
            <Link href={"/admin/categories"} title="Kelola Kategori">
              <div
                className={`bg-gray-100 ${show ? "w-full" : ""} 
                ${
                  linkActive === "categories"
                    ? "bg-warning hover:bg-yellow-500"
                    : ""
                }
                hover:bg-gray-200 cursor-pointer p-3 rounded-lg inline-block`}
              >
                <FaList size={20} className="inline" />
                <span className={`${!show ? "hidden" : ""} ml-3`}>
                  Kategori
                </span>
              </div>
            </Link>
          </div>
          <div className={`mb-4 ${show ? "w-full" : ""}`}>
            <Link href={"/admin/settings"} title="Pengaturan">
              <div
                className={`bg-gray-100 ${show ? "w-full" : ""} 
                ${
                  linkActive === "settings"
                    ? "bg-warning hover:bg-yellow-500"
                    : ""
                }
                hover:bg-gray-200 cursor-pointer p-3 rounded-lg inline-block`}
              >
                <FiSettings size={20} className="inline" />
                <span className={`${!show ? "hidden" : ""} ml-3`}>
                  Pengaturan
                </span>
              </div>
            </Link>
          </div>
        </div>
        <label className="btn btn-circle swap swap-rotate absolute top-3 -right-14">
          {/* this hidden checkbox controls the state */}
          <input
            type="checkbox"
            checked={show}
            onClick={() => setShow(!show)}
          />

          {/* hamburger icon */}
          <svg
            className={`swap-off fill-current`}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          {/* close icon */}
          <svg
            className={`swap-on fill-current`}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </label>
      </section>
      <main
        className={`${show ? styles.overlay : ""} ml-20 w-full overflow-hidden`}
        onClick={() => setShow(false)}
      >
        {children}
      </main>
    </div>
  );
}
