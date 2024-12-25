import { UserContext } from "@/contexts/userContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function ProtectedAdminPage({ children }) {
  const router = useRouter();
  const [render, setRender] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user.role !== "admin" && render) {
      router.replace("/");
      setRender(true);
    } else {
      setRender(true);
    }
  }, [render, router, user.role]);

  return user.role === "admin" && render ? children : null;
}
