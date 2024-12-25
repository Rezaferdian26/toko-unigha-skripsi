import Title from "../Title";
import Link from "next/link";

import CardToko from "../CardToko";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode, Navigation } from "swiper/modules";

export default function TokoLandingPage({ tokoLandingPage }) {
  return (
    <div className="max-w-5xl px-4 mt-14 mx-auto relative">
      <Title>Toko Untukmu</Title>
      <span className="absolute top-2 right-5 text-sm text-sky-700">
        <Link href="/toko">Lihat lebih banyak &gt;</Link>
      </span>

      <Swiper
        slidesPerView={"auto"}
        spaceBetween={10}
        freeMode={true}
        navigation
        className="cardSwiper"
        modules={[FreeMode, Navigation]}
      >
        {tokoLandingPage.map((toko) => (
          <SwiperSlide key={toko.id}>
            <Link href={`/${toko.slug}`}>
              <CardToko toko={toko} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
