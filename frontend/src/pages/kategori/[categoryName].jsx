import Card from "@/components/Card";
import HeadMetaTag from "@/components/HeadMetaTag";
import Layout from "@/components/layout";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaCaretDown } from "react-icons/fa6";

export default function Category({ data }) {
  const { query } = useRouter();
  const router = useRouter();
  const sort = query.sort;
  const categoryName = query.categoryName;

  const handleSelectChange = (e) =>
    router.push(`/kategori/${categoryName}?sort=${e.target.value}`);
  return (
    <>
      <HeadMetaTag
        title={`Toko Unigha | ${categoryName}`}
        pathname={`/kategori/${categoryName}`}
      />
      <Layout>
        <div className="md:flex max-w-5xl px-4 mx-auto pb-4">
          <div className="w-full">
            <h1 className="mb-3 text-lg">
              Kategori{" "}
              <span className="text-primary uppercase">
                &quot;{categoryName}&quot;
              </span>
            </h1>
            <div className="block sm:hidden mb-5">
              <details className="dropdown w-full">
                <summary className="btn m-1 bg-indigo-100 hover:bg-indigo-200 w-full">
                  Urutkan
                  <FaCaretDown />
                </summary>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full sm:w-52"
                >
                  <button
                    className={`btn mb-3 me-3 ${
                      sort === "" || !sort ? "btn-primary" : "bg-white"
                    }`}
                    onClick={() => {
                      router.push(`/kategori/${categoryName}`);
                    }}
                  >
                    Terkait
                  </button>
                  <button
                    className={`btn mb-3 me-3 ${
                      sort === "latest" ? "btn-primary" : "bg-white"
                    }`}
                    onClick={() => {
                      router.push(`/kategori/${categoryName}?sort=latest`);
                    }}
                  >
                    Terbaru
                  </button>
                  <button
                    className={`btn mb-3 me-3 ${
                      sort === "sales" ? "btn-primary" : "bg-white"
                    }`}
                    onClick={() => {
                      router.push(`/kategori/${categoryName}?sort=sales`);
                    }}
                  >
                    Terlaris
                  </button>
                  <select
                    className="select select-bordered w-full sm:max-w-xs me-3"
                    onChange={handleSelectChange}
                  >
                    <option
                      disabled
                      selected={sort != "low-price" && sort != "high-price"}
                    >
                      Harga
                    </option>
                    <option value={"low-price"} selected={sort === "low-price"}>
                      Harga: Rendah ke Tinggi
                    </option>
                    <option
                      value={"high-price"}
                      selected={sort === "high-price"}
                    >
                      Harga: Tinggi ke Rendah
                    </option>
                  </select>
                </ul>
              </details>
            </div>
            <div className="items-center mb-5 bg-indigo-100 rounded p-3 hidden sm:flex">
              <p className=" me-3">Urutkan</p>
              <button
                className={`btn  me-3 ${
                  sort === "" || !sort ? "btn-primary" : "bg-white"
                }`}
                onClick={() => {
                  router.push(`/kategori/${categoryName}`);
                }}
              >
                Terkait
              </button>
              <button
                className={`btn me-3 ${
                  sort === "latest" ? "btn-primary" : "bg-white"
                }`}
                onClick={() => {
                  router.push(`/kategori/${categoryName}?sort=latest`);
                }}
              >
                Terbaru
              </button>
              <button
                className={`btn me-3 ${
                  sort === "sales" ? "btn-primary" : "bg-white"
                }`}
                onClick={() => {
                  router.push(`/kategori/${categoryName}?sort=sales`);
                }}
              >
                Terlaris
              </button>
              <select
                className="select select-bordered w-full max-w-xs me-3"
                onChange={handleSelectChange}
              >
                <option
                  disabled
                  selected={sort != "low-price" && sort != "high-price"}
                >
                  Harga
                </option>
                <option value={"low-price"} selected={sort === "low-price"}>
                  Harga: Rendah ke Tinggi
                </option>
                <option value={"high-price"} selected={sort === "high-price"}>
                  Harga: Tinggi ke Rendah
                </option>
              </select>
            </div>
            {data.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {data.map((product) => (
                  <Link
                    href={`/${product.toko_slug}/${product.slug}`}
                    key={product.id}
                  >
                    <Card product={product} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center h-52 flex items-center justify-center">
                <h1>Tidak ada produk dengan kategori: {categoryName}</h1>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const sort = query.sort;
  const categoryName = query.categoryName;
  try {
    const response = await axios.get(
      `${
        process.env.NEXT_PUBLIC_API_BACKEND
      }/api/product-by-category/${categoryName}${sort ? `?sort=${sort}` : ""}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return {
      props: {
        data: response.data.data,
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
