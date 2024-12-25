import HeadMetaTag from "@/components/HeadMetaTag";
import Layout from "@/components/layout";
import axios from "axios";
import Link from "next/link";

export default function Categories({ categories }) {
  return (
    <>
      <HeadMetaTag title="Toko Unigha | Kategori" pathname="/kategori" />
      <Layout>
        <div className="max-w-5xl px-4 mx-auto pb-4 mb-72">
          {!categories.length ? (
            <p className="text-center">Tidak Ada Kategori</p>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {categories.map((category) => (
                <Link
                  href={`/kategori/${category.slug}`}
                  className="bg-indigo-100 flex justify-center items-center p-2"
                  key={category.id}
                >
                  <p className="text-sm font-bold">{category.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const responseCategories = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/category`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return {
      props: {
        categories: responseCategories.data.data,
      },
    };
  } catch (error) {
    return {
      props: {
        categories: [],
      },
    };
  }
}
