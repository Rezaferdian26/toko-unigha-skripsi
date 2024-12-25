import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useSwiper } from "swiper/react";

export default function NavigationButton() {
    const swiper = useSwiper()
    return (
        <div>
            <button
                onClick={() => swiper.slidePrev()}
                className="absolute top-7 left-0 text-xs bg-yellow-400 hover:bg-yellow-600 ease-in duration-200 p-1 rounded-full text-white z-10"
            >
                <FaChevronLeft />
            </button>
            <button
                onClick={() => swiper.slideNext()}
                className="absolute top-7 right-0 z-10 text-xs bg-yellow-400 hover:bg-yellow-600 ease-in duration-200 p-1 rounded-full text-white"
            >
                <FaChevronRight />
            </button>
        </div>
    )
}