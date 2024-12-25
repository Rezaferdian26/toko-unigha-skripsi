import Title from "../Title";
import Card from "../Card";
import Link from "next/link";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode, Navigation } from "swiper/modules";
import Skeleton from "react-loading-skeleton";

export default function Products({ newestProducts }) {
  return (
    <div className="max-w-5xl px-4 mt-14 mx-auto relative">
      <Title>Produk Baru</Title>
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={10}
        freeMode={true}
        navigation
        className="cardSwiper"
        modules={[FreeMode, Navigation]}
      >
        {newestProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <Link href={`${product.toko_slug}/${product.slug}`}>
              {product ? (
                <Card product={product} />
              ) : (
                <div className="shadow-md bg-white border rounded-lg h-auto">
                  <Skeleton count={1} width={400} height={400} />
                </div>
              )}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <span className="absolute top-2 right-5 text-sm text-sky-700">
        <Link href="/produk-baru">Lihat lebih banyak &gt;</Link>
      </span>
    </div>
  );
}
