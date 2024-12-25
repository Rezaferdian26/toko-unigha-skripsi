import LayoutApp from "@/components/LayoutApp";
import ProtectedPage from "@/components/protect-pages/ProtectedPage";
import axios from "axios";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";

export default function Profile() {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get("sanctum/csrf-cookie");
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/me");
        setData(response.data.data);
      } catch (error) {
        setData({});
      }
    };
    fetchData();
  }, []);
  return (
    <ProtectedPage>
      <LayoutApp>
        <div className="max-w-2xl bg-gradient-to-b from-indigo-700 to-blue-400 mx-auto p-5 shadow rounded-lg">
          <div className="relative w-56 h-56 rounded-full mx-auto">
            <Image
              src={
                data.image
                  ? `${process.env.NEXT_PUBLIC_API_BACKEND}/${data.image}`
                  : "/assets/avatar.jpg"
              }
              alt=""
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <div className="mt-3 text-white">
            <h1 className="text-2xl text-center font-bold uppercase">
              {data.name}
            </h1>
            <p className="text-sm text-center">
              {data.username} | {data.email}
            </p>
          </div>
          <div className="mt-5 flex">
            <div className="w-32">
              <p>Alamat</p>
            </div>
            <p className="uppercase">: {data.address}</p>
          </div>
          <div className="mt-1 flex">
            <div className="w-32">
              <p>WA/Telepon</p>
            </div>
            <p>: {data.phone}</p>
          </div>
        </div>
      </LayoutApp>
    </ProtectedPage>
  );
}
