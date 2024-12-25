import Navbar from "./Navbar";
import Footer from "./Footer";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className={`${inter.className} bg-gray-50 pb-20 pt-28`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
