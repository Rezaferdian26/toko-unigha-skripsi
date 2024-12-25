import Card from "@/components/Card";
import HeadMetaTag from "@/components/HeadMetaTag";
import Layout from "@/components/layout";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaCaretDown } from "react-icons/fa6";

export default function Search({ data }) {
  const router = useRouter();
  const query = router.query;
  if (query.keyword === undefined) {
    router.replace("/search?keyword=");
    return null;
  }
  const keyword = query.keyword.trim();
  const sort = query.sort;

  const handleSelectChange = (e) =>
    router.replace(`/search?keyword=${keyword}&sort=${e.target.value}`);
  return (
    <>
      <HeadMetaTag title={`Hasil Pencarian ${keyword}`} pathname="/search" />
      <Layout>
        <div className="md:flex max-w-5xl px-4 mx-auto pb-4">
          <div className="w-full">
            {keyword && (
              <h1 className="mb-3 text-lg">
                Hasil Pencarian untuk{" "}
                <span className="text-primary">&quot;{keyword}&quot;</span>
              </h1>
            )}

            {data.length ? (
              <>
                <div className="items-center mb-5 bg-indigo-100 rounded p-3 hidden sm:flex">
                  <p className=" me-3">Urutkan</p>
                  <button
                    className={`btn  me-3 ${
                      sort === "" || !sort ? "btn-primary" : "bg-white"
                    }`}
                    onClick={() => {
                      router.replace(`/search?keyword=${keyword}`);
                    }}
                  >
                    Terkait
                  </button>
                  <button
                    className={`btn me-3 ${
                      sort === "latest" ? "btn-primary" : "bg-white"
                    }`}
                    onClick={() => {
                      router.replace(`/search?keyword=${keyword}&sort=latest`);
                    }}
                  >
                    Terbaru
                  </button>
                  <button
                    className={`btn me-3 ${
                      sort === "sales" ? "btn-primary" : "bg-white"
                    }`}
                    onClick={() => {
                      router.replace(`/search?keyword=${keyword}&sort=sales`);
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
                    <option
                      value={"high-price"}
                      selected={sort === "high-price"}
                    >
                      Harga: Tinggi ke Rendah
                    </option>
                  </select>
                </div>
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
                        className={`btn mb-2 me-3 ${
                          sort === "" || !sort ? "btn-primary" : "bg-white"
                        }`}
                        onClick={() => {
                          router.replace(`/search?keyword=${keyword}`);
                        }}
                      >
                        Terkait
                      </button>
                      <button
                        className={`btn mb-2 me-3 ${
                          sort === "latest" ? "btn-primary" : "bg-white"
                        }`}
                        onClick={() => {
                          router.replace(
                            `/search?keyword=${keyword}&sort=latest`
                          );
                        }}
                      >
                        Terbaru
                      </button>
                      <button
                        className={`btn mb-2 me-3 ${
                          sort === "sales" ? "btn-primary" : "bg-white"
                        }`}
                        onClick={() => {
                          router.replace(
                            `/search?keyword=${keyword}&sort=sales`
                          );
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
                        <option
                          value={"low-price"}
                          selected={sort === "low-price"}
                        >
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
              </>
            ) : (
              <div className="h-52 flex items-center justify-center">
                <p className="text-center">Produk tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (context) => {
  try {
    const { query } = context;
    const keyword = query.keyword.trim();
    const sortOption = query.sort;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/search-product/${keyword}${
        sortOption ? `?sort=${sortOption}` : ""
      }`
    );

    return {
      props: {
        data: response.data.data || [],
      },
    };
  } catch (error) {
    return {
      props: {
        data: [],
      },
    };
  }
};
