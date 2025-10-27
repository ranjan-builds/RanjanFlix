"use client";
import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Scrollbar,Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "swiper/css/navigation";
export function BackdropCarousel({ backdrops }) {
  return (
    <Swiper
      spaceBetween={0}
      pagination={{
        type: "fraction",
      }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: true,
      }}
      slidesPerView={3}
      navigation={true}
      modules={[Navigation, Scrollbar, Pagination,Autoplay]}
      className="mySwiper"
      breakpoints={{
        320: { slidesPerView: 1 },
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {backdrops.backdrops.map((backdrop, i) => (
        <SwiperSlide key={i}>
          <LazyLoadImage
            className="aspect-video w-full"
            src={`https://image.tmdb.org/t/p/w500/${backdrop.file_path}`}
            alt={backdrop.id}
            effect="blur"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
