import Header from "@/components/Header";
import Layout from "@/components/layout";
import Category from "@/components/landing-page/Category";
import Products from "@/components/landing-page/Products";
import TokoLandingPage from "@/components/landing-page/TokoLandingPage";
import Rekomendasi from "@/components/landing-page/Rekomendasi";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import HeadMetaTag from "@/components/HeadMetaTag";
import { UserContext } from "@/contexts/userContext";
import { FLASK_URL } from "@/utils/api-url";

export const metadata = {
  title: "Test metada",
  description: "Jelajahi keajaiban wirausaha akademis di Unigha",
};
export default function Home({
  newestProducts,
  tokoLandingPage,
  allProducts,
  bannerImages,
}) {
  const { user, isLogin } = useContext(UserContext);
  const [recomendationProducts, setRecomendationProducts] = useState([]);
  const fetchData = async () => {
    try {
      if (isLogin) {
        const res = await fetch(`${FLASK_URL}/products?usr=${user.id}`);
        const responseRecommendation = await res.json();
        setRecomendationProducts(responseRecommendation.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <HeadMetaTag />
      <Layout>
        <Header banner={bannerImages} />
        <Category />
        {newestProducts ? <Products newestProducts={newestProducts} /> : null}
        {tokoLandingPage ? (
          <TokoLandingPage tokoLandingPage={tokoLandingPage} />
        ) : null}
        {allProducts ? (
          <Rekomendasi
            allProducts={isLogin ? recomendationProducts : allProducts}
          />
        ) : null}
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  let newestProducts = [];
  let bannerImages = [];
  let tokoLandingPage = [];
  let allProducts = [];
  try {
    const responseNewestProducts = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/product?desc&limit=10`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    newestProducts = responseNewestProducts.data.data;
  } catch (error) {
    newestProducts = [];
  }

  try {
    const responseBannerImages = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/landing-page`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    bannerImages = responseBannerImages.data.images;
  } catch (error) {
    bannerImages = [];
  }

  try {
    const responseTokos = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/toko?limit=15`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    tokoLandingPage = responseTokos.data.data;
  } catch (error) {
    tokoLandingPage = [];
  }

  try {
    const responseAllProducts = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/product`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    allProducts = responseAllProducts.data.data;
  } catch (error) {
    allProducts = [];
  }

  return {
    props: {
      newestProducts: newestProducts,
      tokoLandingPage: tokoLandingPage,
      allProducts: allProducts,
      bannerImages: bannerImages,
    },
  };
}
