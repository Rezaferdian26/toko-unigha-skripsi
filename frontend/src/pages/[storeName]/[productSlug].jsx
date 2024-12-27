import Layout from "@/components/layout";
import ProductImage from "@/components/detail-page/ProductImage";
import { useContext, useEffect, useState } from "react";
import Card from "@/components/Card";
import Link from "next/link";
import axios from "axios";
import Title from "@/components/Title";
import { FaInfo } from "react-icons/fa6";
import changePhoneNumber from "@/utils/changePhoneNumber";
import { UserContext } from "@/contexts/userContext";
import { myToastError } from "@/utils/myToast";
import { useRouter } from "next/router";
import Image from "next/legacy/image";
import { FLASK_URL } from "@/utils/api-url";

export default function DetailProduct({
  product,
  productRecomendations,
  allTokoProducts,
  toko,
}) {
  const [count, setCount] = useState(1);
  const [error, setError] = useState("");
  // const [productRecomendations, setProductRecomendations] = useState([]);
  const router = useRouter();

  const { user, isLogin } = useContext(UserContext);

  const handleInputChange = (e) => {
    if (count === 0) {
      setError("Minimal pembelian produk ini adalah 1");
    } else {
      setError("");
    }
    setCount(() => {
      const parsed = parseInt(e.target.value, 10);

      return isNaN(parsed) ? 0 : parsed;
    });
  };

  const handleButtonBuyClick = (productName) => {
    if (user.id === undefined) {
      myToastError("Silakan login terlebih dahulu");
      return;
    }
    if (user.id === toko.user_id) {
      myToastError("Anda tidak dapat membeli produk sendiri");
      return;
    }
    router.push(
      `https://api.whatsapp.com/send?phone=${changePhoneNumber(
        product.phone
      )}&text=Halo%20admin,%20saya%20ingin%20membeli%20produk%20${productName}`
    );
  };

  useEffect(() => {
    if (isLogin) {
      const addActivity = async () => {
        try {
          const response = await axios.post("/api/add-activity", {
            product_id: product.id,
          });
        } catch (error) {
          return;
        }
      };
      const timeoutId = setTimeout(() => {
        addActivity();
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [isLogin, product.id]);

  return (
    <>
      <Layout>
        <div className="md:flex max-w-5xl px-4 mx-auto pb-4">
          <div className="md:basis-1/3 sm:mr-14 mb-3 pb-4">
            <ProductImage productImages={product.images} />
          </div>
          <div className="w-full">
            <h1 className="text-2xl font-bold uppercase">{product.name}</h1>
            <p className="text-sm py-3">Kategori {product.category}</p>
            <h1 className="text-4xl text-amber-500 font-bold">
              Rp{" "}
              <span>
                {new Intl.NumberFormat("id-ID", {
                  // style: "currency",
                  currency: "IDR",
                }).format(product.price)}
              </span>
            </h1>
            <div className="flex mt-10">
              <div className="basis-32">
                <p className="text-sm">Kuantitas</p>
              </div>
              <div className="basis-full flex">
                <button
                  className="border px-3 disabled:opacity-80 disabled:cursor-not-allowed"
                  disabled={count <= 1 ? true : false}
                  onClick={() => setCount((prev) => (prev > 1 ? prev - 1 : 1))}
                >
                  -
                </button>
                <input
                  className={`mx-1 border text-sm cursor-default w-10 text-center`}
                  type="text"
                  value={count}
                  onChange={handleInputChange}
                />
                <button
                  className="border px-3"
                  onClick={() => setCount((prev) => prev + 1)}
                >
                  +
                </button>
                <p className="ms-3 align-middle text-sm">
                  Tersisa {product.stock} buah
                </p>
              </div>
            </div>
            <p className="text-error text-sm mt-2">{error && error}</p>
            <div className="mt-10">
              {/* <button className="btn btn-warning btn-outline me-2 mt-10">
            Masukkan Keranjang
          </button> */}
              <button
                className="btn btn-warning disabled:btn-warning disabled:opacity-75 disabled:cursor-not-allowed"
                onClick={() => {
                  handleButtonBuyClick(product.name);
                }}
                disabled={error ? true : false}
              >
                Beli Sekarang
              </button>
              <div
                className="tooltip align-middle ms-10"
                data-tip="Saat ini belum tersedia metode pembayaran, klik tombol beli sekarang untuk melanjutkan ke Whatsapp untuk membeli produk"
              >
                <p className="text-xs border bg-white p-2 rounded-full">
                  <FaInfo />
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center">
              <Link
                href={`/${toko.slug}`}
                className="relative w-14 h-14 rounded-full"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BACKEND}/${toko.image}`}
                  alt="logo toko"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </Link>
              <p className="ms-3 font-bold">{toko.name}</p>
            </div>
            <h1 className="text-lg mt-5 text-warning font-bold">Detail</h1>
            <div className="mt-2 text-sm">
              <p>
                <span className="text-gray-400">Kondisi:</span>{" "}
                {product.condition}
              </p>
              <p className="mt-1 whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>
        </div>
        <div className="mt-10 max-w-5xl px-4 mx-auto relative">
          <Title>Lainnya di toko ini</Title>
          <span className="absolute top-10  right-5 text-sm text-sky-700">
            <Link href={`/${product.toko_slug}`}>Lihat lebih banyak &gt;</Link>
          </span>
          <div className="grid grid-cols-2 mt-10 sm:mt-0 gap-2 sm:gap-4 md:grid-cols-5">
            {allTokoProducts.map((product) => (
              <Link
                href={`/${product.toko_slug}/${product.slug}`}
                key={product.id}
              >
                <Card product={product} />
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-10 max-w-5xl px-4 mx-auto relative">
          <Title>Mungkin Anda Juga Suka</Title>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-5">
            {productRecomendations.map((product) => (
              <Link
                href={`/${product.toko_slug}/${product.slug}`}
                key={product.id}
              >
                <Card product={product} />
              </Link>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { storeName, productSlug } = params;

  try {
    const responseProduct = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/product/${storeName}/${productSlug}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const responseToko = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/toko/${storeName}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const res = await fetch(
      `${FLASK_URL}/products/${responseProduct.data.data.id}`
    );
    const responseRecommendation = await res.json();
    const productRecomendations = responseRecommendation.data;

    const responseAllTokoProducts = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/show-all-toko-products/${storeName}?limit=10`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    return {
      props: {
        product: responseProduct.data.data,
        productRecomendations,
        allTokoProducts: responseAllTokoProducts.data.data,
        toko: responseToko.data.data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
