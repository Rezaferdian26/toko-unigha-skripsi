import Image from "next/legacy/image";
import { FaStore } from "react-icons/fa6";

export default function Card({ product }) {
  return (
    <>
      <div className="shadow-md bg-white border rounded-lg h-80 hover:scale-95 hover:bg-gray-100 ease-in-out duration-300 overflow-hidden">
        <div className="bg-indigo-100 p-3 rounded-t-md">
          <p className="text-xs text-center">{product.category}</p>
        </div>
        <div className="relative h-32">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BACKEND}${product.images[0].image_path}`}
            alt="product"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-3">
          <p className="font-bold text-sm capitalize line-clamp-2 leading-5">
            {product.name}
          </p>
          <h2 className="font-extrabold text-lg text-indigo-900 my-2">
            Rp{" "}
            <span>
              {new Intl.NumberFormat("id-ID", {
                // style: "currency",
                currency: "IDR",
              }).format(product.price)}
            </span>
          </h2>
          <p className="text-xs mb-1">
            <FaStore className="inline" /> {product.toko_name}
          </p>
          <p className="text-xs">{product.stock} stok</p>
        </div>
      </div>
    </>
  );
}
