import LayoutApp from "@/components/LayoutApp";
import TabBelumBayar from "@/components/myorder/tab-belum-bayar";
import TabDikirim from "@/components/myorder/tab-dikirim";
import TabProses from "@/components/myorder/tab-proses";
import TabSelesai from "@/components/myorder/tab-selesai";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MyOrder() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const tabs = [
    { slug: "belum-bayar", name: "Belum Bayar" },
    { slug: "proses", name: "Proses" },
    { slug: "dikirim", name: "Dikirim" },
    { slug: "selesai", name: "Selesai" },
  ];
  const page = searchParams.get("tab") || "belum-bayar";

  const handleTabClick = (slug) => {
    setLoading(true);
    router.replace(`/myorder?tab=${slug}`);
  };
  return (
    <LayoutApp>
      <div className="max-w-3xl mx-auto">
        <div className="tabs justify-center bg-white mb-3 shadow rounded">
          {tabs.map((tab, index) => (
            <a
              className={`tab tab-bordered capitalize ${
                page === tab.slug ? "tab-active" : ""
              }`}
              key={index}
              onClick={() => handleTabClick(tab.slug)}
            >
              {tab.name}
            </a>
          ))}
        </div>
        <div>
          {page === "belum-bayar" && (
            <TabBelumBayar loading={loading} setLoading={setLoading} />
          )}
          {page === "proses" && (
            <TabProses loading={loading} setLoading={setLoading} />
          )}
          {page === "dikirim" && (
            <TabDikirim loading={loading} setLoading={setLoading} />
          )}
          {page === "selesai" && (
            <TabSelesai loading={loading} setLoading={setLoading} />
          )}
        </div>
      </div>
    </LayoutApp>
  );
}
