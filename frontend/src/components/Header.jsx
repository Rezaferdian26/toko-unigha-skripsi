import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/legacy/image";

import styles from "./header.module.css";
// import swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperNavButton from "./SwiperNavButton";

export default function Header({ banner }) {
  return (
    <div className={`max-w-5xl px-4 mx-auto`}>
      {banner.length === 0 ? (
        <div className={`${styles.swiper} relative rounded-md shadow`}>
          <Image
            src={"https://placehold.co/1920x1080.jpg"}
            alt="banner"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
      ) : (
        <>
          <Swiper
            slidesPerView={1}
            loop={true}
            pagination={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination]}
            className={`mySwiper rounded-md relative ${styles.swiper} shadow-md`}
          >
            {banner.map((url, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BACKEND}/${url.image_banner}`}
                  alt="banner"
                  layout="fill"
                  objectFit="cover"
                />
              </SwiperSlide>
            ))}
            <SwiperNavButton />
          </Swiper>
        </>
      )}
    </div>
  );
}
