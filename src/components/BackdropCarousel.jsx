"use client";
import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-lazy-load-image-component/src/effects/blur.css";

export function BackdropCarousel({ backdrops }) {
  if (!backdrops || !backdrops.backdrops?.length) return null;

  return (
    <div className="relative w-full">
      <Swiper
        spaceBetween={20}
        pagination={{
          type: "fraction",
          el: ".custom-swiper-pagination",
        }}
        navigation={{
          nextEl: ".custom-swiper-next",
          prevEl: ".custom-swiper-prev",
        }}
        modules={[Navigation, Pagination]}
        slidesPerView={3}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="group"
      >
        {backdrops.backdrops.map((backdrop, i) => (
          <SwiperSlide key={i}>
            <div className="relative overflow-hidden rounded-2xl shadow-xl transition-transform duration-500 hover:scale-[1.03]">
              <LazyLoadImage
                className="aspect-video w-full object-cover rounded-2xl"
                src={`https://image.tmdb.org/t/p/w780/${backdrop.file_path}`}
                alt={`Backdrop ${i}`}
                effect="blur"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent rounded-2xl pointer-events-none" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <div className="absolute inset-y-0 flex items-center justify-between w-full px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="custom-swiper-prev w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-black/40 hover:bg-black/70 text-white text-xl shadow-lg transition-all duration-300">
          ‹
        </button>
        <button className="custom-swiper-next w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-black/40 hover:bg-black/70 text-white text-xl shadow-lg transition-all duration-300">
          ›
        </button>
      </div>

      {/* Custom Pagination */}
      <div className="custom-swiper-pagination absolute bottom-4 right-6 text-sm font-semibold text-white bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md pointer-events-none"></div>
    </div>
  );
}
