"use client";
import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Card from "./Card";
import "swiper/css";
import "swiper/css/navigation";
export function Carousel({ movies }) {

  return (
    <Swiper
      spaceBetween={7}
      slidesPerView={5}
      className="mySwiper"
      watchSlidesProgress={true}
      breakpoints={{
        320: { slidesPerView: 2.5 },
        640: { slidesPerView: 4.5 },
        768: { slidesPerView: 5.5 },
        1024: { slidesPerView: 6.5 },
      }}
    >
      {movies.map((movie, i) => (
        <SwiperSlide key={i}>
          <Card movie={movie} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
