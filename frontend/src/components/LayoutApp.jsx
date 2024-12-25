import Navbar from "./Navbar";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function LayoutApp({ children }) {
  return (
    <>
      <Navbar />
      <main className={`${inter.className} pb-20 pt-28`}>{children}</main>
    </>
  );
}