"use client";
import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "swiper/css/navigation";
import { NavLink } from "react-router-dom";
import { MdPerson } from "react-icons/md";

export function CastCarousel({ persons }) {
  // Filter out persons without valid data
  const validPersons = persons.filter(person => person && person.id);

  if (validPersons.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-lg">No cast information available</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Swiper
        spaceBetween={16}
        slidesPerView={5}
        navigation={{
          nextEl: '.cast-swiper-button-next',
          prevEl: '.cast-swiper-button-prev',
        }}
        modules={[Navigation]}
        className="cast-swiper"
        watchSlidesProgress={true}

        breakpoints={{
          320: { 
            slidesPerView: 2.3,
            spaceBetween: 12
          },
          480: { 
            slidesPerView: 3.2,
            spaceBetween: 12
          },
          640: { 
            slidesPerView: 4.2,
            spaceBetween: 14
          },
          768: { 
            slidesPerView: 5.2,
            spaceBetween: 14
          },
          1024: { 
            slidesPerView: 6.3,
            spaceBetween: 16
          },
          1280: { 
            slidesPerView: 7.3,
            spaceBetween: 18
          }
        }}
      >
        {validPersons.map((person) => (
          <SwiperSlide key={person.id}>
            <CastCard person={person} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Buttons */}
      <div className="cast-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 hover:bg-black/80 text-white p-2 rounded-r-lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <div className="cast-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 hover:bg-black/80 text-white p-2 rounded-l-lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

const CastCard = ({ person }) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <div className="group/card bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-3 hover:from-zinc-800/60 hover:to-zinc-700/40 transition-all duration-300 border border-zinc-700/30 hover:border-zinc-500/50 shadow-lg hover:shadow-xl">
      <NavLink 
        to={`/person/${person.id}`}
        className="block relative overflow-hidden rounded-lg mb-3"
      >
        {/* Profile Image */}
        <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-zinc-800">
          {person.profile_path && !imageError ? (
            <>
              <LazyLoadImage
                className={`rounded-lg w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                src={`https://image.tmdb.org/t/p/w400/${person.profile_path}`}
                alt={person.name}
                effect="blur"
                onError={() => setImageError(true)}
                afterLoad={() => setImageLoaded(true)}
                threshold={100}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800 rounded-lg">
              <MdPerson className="text-4xl text-zinc-600" />
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover/card:opacity-100 transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-300">
              <div className="bg-blue-600/90 text-white text-xs font-semibold px-2 py-1 rounded">
                View Profile
              </div>
            </div>
          </div>
        </div>
      </NavLink>

      {/* Person Info */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 group-hover/card:text-blue-300 transition-colors duration-200">
          {person.name}
        </h3>
        
        {person.character && (
          <p className="text-zinc-400 text-xs leading-tight line-clamp-2">
            as <span className="text-zinc-300 font-medium">{person.character}</span>
          </p>
        )}
        
        {person.department && (
          <p className="text-zinc-500 text-xs leading-tight line-clamp-2">
            {person.department}
          </p>
        )}
      </div>
    </div>
  );
};

