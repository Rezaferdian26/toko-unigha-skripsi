import Image from "next/legacy/image";

export default function CardToko({ toko, style }) {
  return (
    <div
      className={`hover:scale-95 w-48 relative bg-indigo-100 ease-in-out duration-300 rounded-lg shadow-sm h-52 border ${style}`}
    >
      <div className="relative h-1/2 bg-gradient-to-b from-indigo-700 to-blue-400 rounded-md"></div>
      <div className="absolute bottom-5 w-full">
        <p className="text-center uppercase font-bold">{toko.name}</p>
      </div>
      <div className="p-3 bottom-[48px] left-[50px] bg-white w-24 h-24 rounded-full border relative inline-block">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_BACKEND}/${toko.image}`}
          layout="fill"
          alt="Logo"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
    </div>
  );
}
