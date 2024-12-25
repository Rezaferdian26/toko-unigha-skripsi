import Image from "next/legacy/image";
import NavigationButton from "./NavigationButton";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { useEffect, useState } from "react";

export default function ProductImage({ productImages }) {
  const [sourceImage, setSourceImage] = useState(
    `${process.env.NEXT_PUBLIC_API_BACKEND}${productImages[0].image_path}`
  );

  useEffect(() => {
    setSourceImage(
      `${process.env.NEXT_PUBLIC_API_BACKEND}${productImages[0].image_path}`
    );
  }, [productImages]);

  const changeImageHandler = ({ target }) => {
    if (process.env.NEXT_PUBLIC_API_BACKEND + target.image_path === sourceImage)
      return;

    setSourceImage(
      `${process.env.NEXT_PUBLIC_API_BACKEND}${target.image_path}`
    );
  };

  return (
    <>
      <div className="relative w-72 h-72 sm:h-96 sm:w-96 mx-auto">
        <Image
          src={sourceImage}
          alt="Gambar Produk"
          layout="fill"
          objectFit="contain"
          objectPosition="center"
        ></Image>
      </div>
      <div className="mt-3 border md:w-96">
        <Swiper slidesPerView={5} spaceBetween={10} className="mySwiper">
          {productImages.map((productImage) => (
            <SwiperSlide key={productImage.image_id}>
              <div
                style={{
                  width: 80,
                  height: 80,
                }}
              >
                <Image
                  onMouseEnter={() =>
                    changeImageHandler({ target: productImage })
                  }
                  src={`${process.env.NEXT_PUBLIC_API_BACKEND}${productImage.image_path}`}
                  layout="fill"
                  objectFit="cover"
                  alt="thumbnail"
                  className="hover:border-2 hover:border-indigo-400"
                />
              </div>
            </SwiperSlide>
          ))}
          <NavigationButton />
        </Swiper>
      </div>
    </>
  );
}
