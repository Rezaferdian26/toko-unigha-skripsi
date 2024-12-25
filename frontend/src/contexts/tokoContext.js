import axios from "axios";

const { createContext, useState, useEffect } = require("react");

const TokoContext = createContext();

export default function TokoContextProvider({ children }) {
  const [toko, setToko] = useState(null);
  const fetchData = async () => {
    try {
      const response = await axios.get(`api/get-toko-user`);
      if (response.status === 200) {
        setToko(response.data.data);
      }
    } catch (error) {
      setToko(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <TokoContext.Provider value={{ toko, setToko }}>
      {children}
    </TokoContext.Provider>
  );
}

export { TokoContext };
