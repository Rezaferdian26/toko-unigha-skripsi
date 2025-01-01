import LayoutApp from "@/components/LayoutApp";
import PesananTabView from "@/components/mytoko/PesananTabView";
import TabProductView from "@/components/mytoko/TabProductView";
import TabTokoView from "@/components/mytoko/TabTokoView";
import ProtectedPage from "@/components/protect-pages/ProtectedPage";
import ProtectedTokoPage from "@/components/protect-pages/ProtectedTokoPage";
import { TokoContext } from "@/contexts/tokoContext";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
export default function MyToko() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toko } = useContext(TokoContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responseProduct = await axios.get("/api/user-products");
        setProducts(responseProduct.data.data);
      } catch (error) {
        setProducts([]);
      }
      try {
        const responseCategory = await axios.get("/api/category");
        setCategories(responseCategory.data.data);
      } catch (error) {
        setCategories([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const page = searchParams.get("tab") || "toko";

  const handleTabClick = (index) => {
    setLoading(true);
    router.replace(`/mytoko?tab=${tabs[index]}`);
  };

  const tabs = ["toko", "produk", "pesanan"];

  try {
    return (
      <ProtectedPage>
        <ProtectedTokoPage>
          {toko.is_verified == "unverified" ? (
            <LayoutApp>
              <div className="h-60 flex justify-center items-center flex-col">
                <h1 className="text-lg font-bold">
                  Toko sedang proses verifikasi
                </h1>
                <h1 className="text-lg font-bold">
                  Silahkan cek email secara berkala!
                </h1>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => router.reload()}
                >
                  Refresh Halaman
                </button>
              </div>
            </LayoutApp>
          ) : (
            <LayoutApp>
              <div className="max-w-3xl mx-auto">
                <div className="tabs justify-center bg-white mb-3 shadow rounded">
                  {tabs.map((tab, index) => (
                    <a
                      className={`tab tab-bordered capitalize ${
                        page === tabs[index] ? "tab-active" : ""
                      }`}
                      key={index}
                      onClick={() => handleTabClick(index)}
                    >
                      {tab}
                    </a>
                  ))}
                </div>

                {page === "toko" && (
                  <TabTokoView loading={loading} setLoading={setLoading} />
                )}
                {page === "produk" && (
                  <TabProductView
                    products={products}
                    setProducts={setProducts}
                    categories={categories}
                    loading={loading}
                    setLoading={setLoading}
                  />
                )}
                {page === "pesanan" && (
                  <PesananTabView
                    products={products}
                    setProducts={setProducts}
                    categories={categories}
                    loading={loading}
                    setLoading={setLoading}
                  />
                )}
              </div>
            </LayoutApp>
          )}
        </ProtectedTokoPage>
      </ProtectedPage>
    );
  } catch (error) {
    return (
      <ProtectedPage>
        <ProtectedTokoPage>
          <LayoutApp>
            <div className="h-60 flex items-center justify-center">
              <p>500 | Internal Server Error</p>
            </div>
          </LayoutApp>
        </ProtectedTokoPage>
      </ProtectedPage>
    );
  }
}
