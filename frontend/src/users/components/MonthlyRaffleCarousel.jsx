/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import 'swiper/css';


const MonthlyRaffleCarousel = ({ slidesPerView, images, className }) => {
  return (
    <div className={`max-w-md ${className}`}>
    <Swiper
      spaceBetween={10}
      slidesPerView={slidesPerView}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      navigation={true}
      modules={[Autoplay, Navigation]}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index} className="w-full">
          <img
            src={image}
            alt={`Imagen del sorteo ${index + 1}`}
            width={335}
            height={188}
            className="w-full h-full object-cover rounded-lg"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
  )
}

export default MonthlyRaffleCarousel