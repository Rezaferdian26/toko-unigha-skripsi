import Title from "../Title";
import { FaShirt, FaBagShopping, FaGamepad } from "react-icons/fa6";
import {
  GiKnifeFork,
  GiHealthPotion,
  GiFullMotorcycleHelmet,
  GiBedLamp,
} from "react-icons/gi";
import { FcElectronics } from "react-icons/fc";
import Link from "next/link";

export default function Category() {
  return (
    <div className="max-w-5xl px-4 mt-14 mx-auto relative">
      <Title>KATEGORI</Title>

      <div className="grid-cols-2 sm:grid-cols-4 gap-2 grid">
        <Link href="/kategori/fashion">
          <div className="bg-indigo-100 py-2 px-1 sm:p-3 hover:bg-indigo-200">
            <FaShirt className="inline me-3 text-red-500 text-xl" />
            <span className="text-xs">Fashion</span>
          </div>
        </Link>
        <Link href="/kategori/makanan-minuman">
          <div className="bg-indigo-100 py-2 px-1 sm:p-3 hover:bg-indigo-200">
            <GiKnifeFork className="inline me-3 text-blue-500 text-xl" />
            <span className="text-xs">Makanan</span>
          </div>
        </Link>
        <Link href="/kategori/elektronik">
          <div className="bg-indigo-100 py-2 px-1 sm:p-3 hover:bg-indigo-200">
            <FcElectronics className="inline me-3 text-red-500 text-xl" />
            <span className="text-xs">Elektronik</span>
          </div>
        </Link>
        <Link href="/kategori/kesehatan-kecantikan">
          <div className="bg-indigo-100 py-2 px-1 sm:p-3 hover:bg-indigo-200">
            <GiHealthPotion className="inline me-3 text-rose-500 text-xl" />
            <span className="text-xs">Kesehatan & Kecantikan</span>
          </div>
        </Link>
        <Link href="/kategori/aksesoris">
          <div className="bg-indigo-100 py-2 px-1 sm:p-3 hover:bg-indigo-200">
            <FaBagShopping className="inline me-3 text-orange-500 text-xl" />
            <span className="text-xs">Aksesoris</span>
          </div>
        </Link>
        <Link href="/kategori/otomotif">
          <div className="bg-indigo-100 py-2 px-1 sm:p-3 hover:bg-indigo-200">
            <GiFullMotorcycleHelmet className="inline me-3 text-gray-500 text-xl" />
            <span className="text-xs">Otomotif</span>
          </div>
        </Link>
        <Link href="/kategori/properti">
          <div className="bg-indigo-100 py-2 px-1 sm:p-3 hover:bg-indigo-200">
            <GiBedLamp className="inline me-3 text-lime-500 text-xl" />
            <span className="text-xs">Properti</span>
          </div>
        </Link>
        <Link href="/kategori/hobi-hiburan">
          <div className="bg-indigo-100 py-2 px-1 sm:p-3 hover:bg-indigo-200">
            <FaGamepad className="inline me-3 text-emerald-500 text-xl" />
            <span className="text-xs">Hobi & Hiburan</span>
          </div>
        </Link>
      </div>
      <span className="absolute top-2 right-5 text-sm text-sky-700">
        <Link href="/kategori">Lihat lebih banyak kategori &gt;</Link>
      </span>
    </div>
  );
}
