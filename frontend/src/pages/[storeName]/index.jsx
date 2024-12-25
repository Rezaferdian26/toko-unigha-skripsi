import Layout from "@/components/layout";
import Image from "next/legacy/image";
import axios from "axios";
import { FaStore } from "react-icons/fa6";
import Title from "@/components/Title";
import Link from "next/link";
import Card from "@/components/Card";
import HeadMetaTag from "@/components/HeadMetaTag";

export default function Toko({ toko, products }) {
  return (
    <>
      <HeadMetaTag title={`${toko.name}`} pathname={`/${toko.slug}`} />
      <Layout>
        <div className="max-w-5xl px-4 mx-auto pb-4">
          <div className="md:flex">
            <div className="flex mx-auto items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-400 px-10 py-5 shadow rounded-lg">
              <div className="relative w-24 h-24 rounded-full border-white border-2">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BACKEND}/${toko.image}`}
                  layout="fill"
                  objectFit="cover"
                  alt="Foto toko"
                  className="rounded-full"
                />
              </div>
              <div className="ms-5">
                <h1 className="text-white font-bold text-3xl">{toko.name}</h1>
                <p className="text-white mt-3">
                  <FaStore className="inline me-3" />
                  Produk: {products.length}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10">
            {!products ? (
              <div className="mx-auto">
                <h1>Belum ada produk</h1>
              </div>
            ) : (
              <>
                <Title>Etalase Toko</Title>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                  {products.map((product) => (
                    <Link
                      href={`${toko.slug}/${product.slug}`}
                      key={product.id}
                    >
                      <Card product={product} />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { storeName } = params;

  try {
    const responseToko = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/toko/${storeName}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const responseTokoProducts = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/show-all-toko-products/${storeName}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (responseToko.status === 200 && responseTokoProducts.status === 200) {
      return {
        props: {
          toko: responseToko.data.data,
          products: responseTokoProducts.data.data,
        },
      };
    }

    return {
      notFound: true,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
