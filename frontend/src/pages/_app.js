import TokoContextProvider from "@/contexts/tokoContext";
import UserContextProvider from "@/contexts/userContext";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { useEffect } from "react";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NEXT_PUBLIC_APP_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BACKEND
    : "https://api.tokounigha.com";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";
export default function App({ Component, pageProps }) {
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.register(
            "/service-worker.js"
          );
          console.log("Service Worker registered:", registration);

          // Lakukan subskripsi otomatis
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              "BKRWT0bWm2iZPtXkQclUlD_MLnT1vZOaJ89fckF5_R-uq2BxV7ixiBt4K-_smzF9oZ-tfD8ssmx0FNmx16osH1E", // VAPID public key dari Laravel
          });

          // Kirim subskripsi ke backend Laravel
          await fetch("http://localhost:8000/api/subscribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify({
              endpoint: subscription.endpoint,
              key: btoa(
                String.fromCharCode(
                  ...new Uint8Array(subscription.getKey("p256dh"))
                )
              ),
              auth: btoa(
                String.fromCharCode(
                  ...new Uint8Array(subscription.getKey("auth"))
                )
              ),
            }),
          });

          console.log("User subscribed to push notifications");
        } catch (error) {
          console.error(
            "Error during service worker registration or subscription:",
            error
          );
        }
      }
    };

    registerServiceWorker();
  }, []);

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
