import { UserContext } from "@/contexts/userContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../layout";
import Loading from "../Loading";

export default function ProtectedPage({ children }) {
  const { isLogin, user } = useContext(UserContext);
  const [render, setRender] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!isLogin && render) {
      router.push("/login");
      setRender(true);
    }
    if (!user.has_verified && isLogin && !render) {
      router.push("/email-verify");
      setRender(true);
    }
    setRender(true);
  }, [isLogin, render, router, user.has_verified]);

  return isLogin && render && user.has_verified ? (
    children
  ) : (
    <Layout>
      <Loading />
    </Layout>
  );
}
