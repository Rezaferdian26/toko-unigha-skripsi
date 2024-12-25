import Card from "@/components/Card";
import CardToko from "@/components/CardToko";
import HeadMetaTag from "@/components/HeadMetaTag";
import Title from "@/components/Title";
import Layout from "@/components/layout";
import axios from "axios";
import Link from "next/link";

export default function Toko({ data }) {
  return (
    <>
      <HeadMetaTag title="Toko Unigha | Toko" pathname="/toko" />
      <Layout>
        <div className="max-w-5xl px-4 mx-auto">
          <Title>Toko</Title>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {data.map((toko) => (
              <Link href={`/toko/${toko.slug}`} key={toko.id}>
                <CardToko toko={toko} />
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
    const responseToko = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/toko?limit=10`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return {
      props: {
        data: responseToko.data.data,
      },
    };
  } catch (error) {
    return {
      props: {
        data: [],
      },
    };
  }
}
