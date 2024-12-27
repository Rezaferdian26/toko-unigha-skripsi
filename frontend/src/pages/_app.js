import TokoContextProvider from "@/contexts/tokoContext";
import UserContextProvider from "@/contexts/userContext";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NEXT_PUBLIC_APP_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BACKEND
    : "https://api.tokounigha.com";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";
export default function App({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <TokoContextProvider>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </TokoContextProvider>
    </UserContextProvider>
  );
}
