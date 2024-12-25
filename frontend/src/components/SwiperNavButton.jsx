import { useSwiper } from "swiper/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function SwiperNavButton() {
  const swiper = useSwiper();
  return (
    <>
      <button
        onClick={() => swiper.slidePrev()}
        className="absolute top-1/3 p-2 sm:top-32 lg:top-36 left-1 text-md bg-yellow-400 hover:bg-yellow-600 ease-in duration-200 sm:p-4  rounded-full text-white z-10"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={() => swiper.slideNext()}
        className="absolute top-1/3 p-2 sm:top-32 lg:top-36 right-1 z-10 text-md bg-yellow-400 hover:bg-yellow-600 ease-in duration-200 sm:p-4  rounded-full text-white"
      >
        <FaChevronRight />
      </button>
    </>
  );
}
