import axios from "axios";
import Cookies from "js-cookie";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Button } from "../ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { myToastSuccess } from "@/utils/myToast";

export default function TabDikirim({ loading, setLoading }) {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  const pesananSelesai = async (id) => {
    try {
      const response = await axios.put(
        `api/final-order/${id}`,
        {},
        {
          headers: {
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
          },
        }
      );
      console.log(response.data);
      router.push("/myorder?tab=selesai");
      myToastSuccess(`Pesanan selesai!`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(false);
    const fetchData = async () => {
      const response = await axios.get("api/order?status=dikirim", {
        headers: {
          "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });
      console.log(response.data);
      setOrders(response.data);
    };
    fetchData();
  }, [setLoading]);
  if (loading) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <Skeleton count={3} />
      </div>
    );
  }
  return (
    <div className="bg-white p-4 rounded shadow h-full">
      {orders.map((order) => (
        <div key={order.id}>
          <div className="flex justify-between mb-2">
            <p className="font-bold">{order.product.toko.name}</p>
            <p className="capitalize">{order.status}</p>
          </div>
          <div className="flex">
            <Image
              width={100}
              height={100}
              className="w-20 h-20 rounded border"
              src={`${process.env.NEXT_PUBLIC_API_BACKEND}/images/product/${order.product.id}/${order.product.images[0].image_path}`}
              alt="gambar produk"
            />
            <div className="ms-3 w-full">
              <p className="capitalize">{order.product.name}</p>
              <p className="text-right w-full text-gray-500">x{order.qty}</p>
            </div>
          </div>
          <div className="w-full">
            <p className="text-right">
              Total {order.qty} produk:{" "}
              <span className="font-bold">Rp. {order.total}</span>
            </p>
            <Button
              className="ms-auto block mt-3"
              onClick={() => {
                pesananSelesai(order.id);
              }}
            >
              Pesanan Selesai
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
