import Card from "@/components/Card";
import HeadMetaTag from "@/components/HeadMetaTag";
import Title from "@/components/Title";
import Layout from "@/components/layout";
import axios from "axios";
import Link from "next/link";

export default function ProdukBaru({ products }) {
  return (
    <>
      <HeadMetaTag title="Produk Baru" pathname="/produk-baru" />
      <Layout>
        <div className="max-w-5xl px-4 mt-14 mx-auto">
          <Title>Produk Baru</Title>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {products.map((product) => (
              <Link
                href={`${product.toko_slug}/${product.slug}`}
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

export async function getServerSideProps() {
  try {
    const responseProduct = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/product?desc&limit=10`
    );
    return {
      props: {
        products: responseProduct.data.data,
      },
    };
  } catch (error) {
    return {
      props: {
        products: [],
      },
    };
  }
}
