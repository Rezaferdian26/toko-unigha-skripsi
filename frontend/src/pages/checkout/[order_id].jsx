import LayoutApp from "@/components/LayoutApp";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaLocationDot, FaLocationPin } from "react-icons/fa6";

export default function Checkout() {
  const router = useRouter();
  const { order_id } = router.query;
  const [order, setOrder] = useState({});
  const [paymentProof, setPaymentProof] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `api/order/${order_id}?status=pending`,
          {
            headers: {
              "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
            },
          }
        );
        setOrder(response.data);
        console.log(response.data);
      } catch (error) {
        router.push("/myorder");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("proof_payment", paymentProof);
    try {
      const response = await axios.post(
        `api/order/${order_id}/payment`,
        formData,
        {
          headers: {
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      router.push("/myorder");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LayoutApp>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-4 rounded shadow h-full">
          <h1 className="text-indigo-900 font-bold tracking-wide text-2xl mb-3 uppercase">
            Checkout
          </h1>
          <FaLocationDot className="inline" /> Alamat Pengiriman
          <div className="mt-3 border p-3 flex justify-between cursor-pointer">
            <p>{order?.user?.address}</p>
            {">"}
          </div>
          <div className="my-2">
            <p className="font-bold">{order?.product?.toko?.name}</p>
          </div>
          <div className="flex">
            <Image
              width={100}
              height={100}
              className="w-20 h-20 rounded border"
              src={`${process.env.NEXT_PUBLIC_API_BACKEND}/images/product/${order?.product?.id}/${order?.product?.images[0]?.image_path}`}
              alt="gambar produk"
            />
            <div className="ms-3 w-full">
              <p className="capitalize">{order?.product?.name}</p>
              <p className="text-right w-full text-gray-500">x{order?.qty}</p>
            </div>
          </div>
          <div className="w-full">
            <p className="text-right">
              Total {order?.qty} produk:{" "}
              <span className="font-bold">Rp. {order?.total}</span>
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">
                Upload Bukti Pembayaran
              </label>
              <div className="mt-1">
                <input
                  type="file"
                  name="file"
                  onChange={(e) => setPaymentProof(e.target.files[0])}
                  className="block w-full px-3 py-2 text-base text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mt-3">
                <Button type="submit">Upload</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </LayoutApp>
  );
}
