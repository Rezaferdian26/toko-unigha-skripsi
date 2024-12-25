import Loading from "@/components/Loading";
import axios from "axios";

const { createContext, useState, useEffect } = require("react");

const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [render, setRender] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/me");
      if (response.status === 200) {
        setUser(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setIsLogin(true);
        setRender(true);
      } else {
        setIsLogin(false);
        setLoading(false);
        setRender(true);
      }
    } catch (error) {
      setIsLogin(false);
      setLoading(false);
      setRender(true);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [render]);

  return render ? (
    <UserContext.Provider
      value={{ isLogin, setIsLogin, loading, setLoading, user, setUser }}
    >
      {children}
    </UserContext.Provider>
  ) : (
    <div className="h-screen flex items-center justify-center">
      <Loading />
    </div>
  );
}

export { UserContext };
