/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/legacy/image";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import NavbarMenu from "./NavbarMenu";
import { useRouter } from "next/router";

export default function Navbar() {
  const [mobile, setMobile] = useState(true);
  const router = useRouter();
  const [search, setSearch] = useState(router.query.keyword);

  const toggleMenu = () => {
    setMobile((prev) => (prev ? false : true));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search === "") return;
    setSearch((prevState) => prevState.trim());
    router.push({
      pathname: "/search",
      query: { keyword: search.trim() },
    });
  };

  return (
    <nav
      className={`${styles.nav} flex justify-around items-center p-3 shadow-md fixed w-full bg-indigo-800 z-10 text-white`}
    >
      <Link href="/" className="hidden sm:hidden lg:block">
        <Image
          src="/logo2.png"
          alt="Logo Toko Unigha"
          width={200}
          height={40}
        />
      </Link>
      <Link href="/" className="sm:block lg:hidden me-3">
        <Image
          src="/favicon.png"
          alt="Logo Toko Unigha"
          width={50}
          height={50}
        />
      </Link>
      <form className="relative w-1/2" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Cari disini ..."
          className={`input input-bordered w-full ps-10 text-black`}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          autoComplete="false"
        />
        <span className="absolute left-0 text-slate-500 p-3 pt-4 text-xl">
          <AiOutlineSearch />
        </span>
        <button type="submit" hidden></button>
      </form>
      <div
        className={`${styles.menu} ${
          !mobile ? styles.active : ""
        } ease-in-out duration-300 shadow-md sm:shadow-none`}
      >
        <NavbarMenu />
      </div>
      <button
        className={`btn btn-square btn-ghost sm:hidden `}
        onClick={toggleMenu}
      >
        {mobile ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>
    </nav>
  );
}
