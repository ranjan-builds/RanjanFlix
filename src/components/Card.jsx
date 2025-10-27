import React from "react";
import { GoXCircle } from "react-icons/go";
import { NavLink } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Card = ({ movie, onRemoveFromWatchlist, cancel }) => {
  if (!movie || !movie.poster_path) return null;

  const {
    title = movie.name || "No Title",
    poster_path,
    release_date = "N/A",
    vote_average = 0,
    id,
  } = movie;

  const year = release_date ? release_date.split("-")[0] : "N/A";

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-zinc-900/40 shadow-md hover:shadow-xl transition-all duration-300">
      {/* Remove / Cancel Button */}
      {cancel && (
        <button
          onClick={() => onRemoveFromWatchlist(id)}
          className="absolute top-3 right-3 bg-zinc-900/60 p-2 rounded-full text-white hover:bg-zinc-800 transition z-20"
        >
          <GoXCircle size={22} />
        </button>
      )}

      {/* Movie Poster */}
      <NavLink to={`/movie/${id}`}>
        <LazyLoadImage
          className="w-full h-auto object-cover rounded-2xl cursor-pointer transform group-hover:scale-105 transition-transform duration-300"
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt={title}
          effect="blur"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        {/* Movie Info (on hover) */}
        <div className="absolute bottom-0 left-0 w-full text-white p-4 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          <div className="flex justify-between items-center text-sm text-gray-300 mt-1">
            <span>{year}</span>
            <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-bold">
              ⭐ {vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default Card;
