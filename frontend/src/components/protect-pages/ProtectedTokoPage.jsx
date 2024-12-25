import { TokoContext } from "@/contexts/tokoContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../layout";
import Loading from "../Loading";
import axios from "axios";

export default function ProtectedTokoPage({ children }) {
  const { toko } = useContext(TokoContext);
  const [render, setRender] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("api/get-toko-user");
      } catch (error) {
        router.push("/buka-toko");
      }
      setRender(true);
    };
    fetchData();
  }, [router]);

  return toko && render ? (
    children
  ) : (
    <Layout>
      <Loading />
    </Layout>
  );
}
