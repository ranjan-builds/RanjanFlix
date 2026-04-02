import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Star, X, Play } from "lucide-react"; // Sharper icons
import "react-lazy-load-image-component/src/effects/blur.css";

const Card = ({ movie, onRemoveFromWatchlist, cancel }) => {
  if (!movie || !movie.poster_path) return null;

  const title = movie.title || movie.name || "Untitled";
  const year = movie.release_date ? movie.release_date.split("-")[0] : movie.first_air_date?.split("-")[0] || "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      className="relative group bg-zinc-900 rounded-2xl overflow-hidden shadow-lg border border-white/5 hover:border-purple-500/50 hover:shadow-purple-500/10 transition-colors duration-500"
    >
      {/* 1. Glassmorphic Remove Button */}
      {cancel && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemoveFromWatchlist(movie.id);
          }}
          className="absolute top-2 right-2 z-30 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100"
        >
          <X size={16} strokeWidth={3} />
        </button>
      )}

      {/* 2. Rating Badge (Always visible but subtle) */}
      <div className="absolute top-2 left-2 z-20 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 flex items-center gap-1.5 transition-opacity group-hover:opacity-0">
        <Star size={12} className="fill-yellow-500 text-yellow-500" />
        <span className="text-[11px] font-bold text-white tracking-tighter">
          {rating}
        </span>
      </div>

      <NavLink to={`/movie/${movie.id}`} className="block relative aspect-[2/3] overflow-hidden">
        {/* 3. Image with physical zoom */}
        <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out">
          <LazyLoadImage
            alt={title}
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            effect="blur"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 4. Multi-layered Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
        
        {/* Hover Center Icon (Visual Cue) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          
        </div>

        {/* 5. Animated Content Container */}
        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
            {year}
          </p>
          <h3 className="text-sm md:text-base font-bold text-white leading-tight line-clamp-1 group-hover:line-clamp-2 transition-all">
            {title}
          </h3>
          
          {/* Metadata revealed on hover */}
          <div className="flex items-center gap-3 mt-2 h-0 opacity-0 group-hover:h-5 group-hover:opacity-100 transition-all duration-500">
            <span className="flex items-center gap-1 text-[11px] font-bold text-yellow-500">
              <Star size={10} className="fill-current" /> {rating}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="text-[11px] text-zinc-400 font-medium">
              Action • Sci-Fi
            </span>
          </div>
        </div>
      </NavLink>

      {/* Subtle Inner Border Glow (Hover only) */}
      <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/0 group-hover:border-purple-500/20 pointer-events-none transition-colors duration-500" />
    </motion.div>
  );
};

export default Card;