import { myToastSuccess } from "@/utils/myToast";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PesananTabView() {
  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const verification = async (id) => {
    try {
      const response = await axios.put(
        `/api/verification-order/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
          },
        }
      );
      console.log(response.data);
      myToastSuccess(`Pesanan berhasil diverifikasi!`);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/verification-order");
        setOrders(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [refresh]);
  return (
    <div className="bg-white p-4 rounded shadow me-5 h-full mb-5">
      <h1 className="text-2xl font-bold">Pesanan</h1>
      <div className="mt-5">
        {orders.map((order) => (
          <>
            <div className="bg-white p-4 rounded shadow mb-5">
              <div className="flex justify-between">
                <h2 className="text-lg font-bold">
                  Pesanan dari {order.user.name}
                </h2>
                <p className="text-sm text-gray-500">{order.payment_date}</p>
              </div>
              <p className="text-sm text-gray-500">
                Produk : {order.product.name}
              </p>
              <p className="text-sm text-gray-500">Jumlah : {order.qty}</p>
              <p className="text-sm text-gray-500">
                Harga :{" "}
                {Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(order.price)}
              </p>
              <p className="text-sm text-gray-500">
                Total :{" "}
                {Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(order.total)}
              </p>
              {order.proof_payment && (
                <Image
                  width={500}
                  height={500}
                  src={`${process.env.NEXT_PUBLIC_API_BACKEND}/images/proof_payment/${order.id}/${order.proof_payment}`}
                  alt="bukti pembayaran"
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <div className="mt-3">
                {order.status === "paid" ? (
                  <>
                    {order.is_verify ? (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed"
                        disabled
                      >
                        Sudah terverifikasi
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => verification(order.id)}
                      >
                        Verifikasi
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed"
                    disabled
                  >
                    Belum Bayar
                  </button>
                )}
              </div>
            </div>
            <hr className="my-5" />
          </>
        ))}
      </div>
    </div>
  );
}
