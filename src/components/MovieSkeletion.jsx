"use client";
import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Skeleton } from "./ui/skeleton";

export function MovieSkeleton({ numbers }) {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={5}
      breakpoints={{
        320: { slidesPerView: 3 },
        640: { slidesPerView: 4 },
        768: { slidesPerView: 5 },
        1024: { slidesPerView: 6 },
      }}

    >
      {Array.from({length:6}).map((_, i) => (
        <SwiperSlide key={i}>
         <Skeleton  style={{ aspectRatio: '9/16' }}  className=" rounded-md p-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg "></Skeleton>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}