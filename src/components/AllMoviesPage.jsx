import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  ChevronRight, 
  Film, 
  Sparkles, 
  AlertCircle,
  Clapperboard
} from "lucide-react";

import Card from "./Card";
import MovieCategoryName from "./MovieCategoryName";
import Loader from "./Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- Configuration ---
const API_KEY = import.meta.env.VITE_API_KEY;

const CATEGORY_MAP = {
  "Movies Near You": { desc: "Fresh releases tailored for your region.", icon: <Sparkles className="w-4 h-4" /> },
  "Tamil Action Movies": { desc: "High-octane action from the heart of Tamil cinema.", icon: <Film className="w-4 h-4" /> },
  "Popular Hindi Movies": { desc: "The biggest Bollywood blockbusters trending now.", icon: <Clapperboard className="w-4 h-4" /> },
  "Sci-Fi Movies": { desc: "Journey beyond the stars and explore the future.", icon: <Sparkles className="w-4 h-4" /> },
  "Trending Movies Today": { desc: "What the world is watching right now.", icon: <Sparkles className="w-4 h-4" /> },
  "Most Popular Movies": { desc: "All-time favorites and current hits.", icon: <Film className="w-4 h-4" /> },
};

const MoviesPage = () => {
  const { url } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentPage = Number(searchParams.get("page")) || 1;

  // --- Endpoints Logic ---
  const getFormattedDate = () => new Date().toISOString().split('T')[0];

  const endpoints = useMemo(() => [
    { key: "Movies Near You", url: `/discover/movie?api_key=${API_KEY}&sort_by=release_date.desc&with_original_language=hi&region=IN&release_date.lte=${getFormattedDate()}` },
    { key: "Tamil Action Movies", url: `/discover/movie?api_key=${API_KEY}&sort_by=revenue.desc&with_original_language=te&with_genres=28` },
    { key: "Popular Hindi Movies", url: `/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&with_original_language=hi&region=IN` },
    { key: "Sci-Fi Movies", url: `/discover/movie?api_key=${API_KEY}&sort_by=revenue.desc&with_genres=878` },
    { key: "Trending Movies Today", url: `/trending/movie/day?api_key=${API_KEY}` },
    { key: "Most Popular Movies", url: `/movie/popular?api_key=${API_KEY}` },
    { key: "Top Rated Movies Globally", url: `/movie/top_rated?api_key=${API_KEY}` },
    { key: "Upcoming Movie Releases", url: `/movie/upcoming?api_key=${API_KEY}` },
  ], []);

  const fetchMovies = useCallback(async () => {
    const endpoint = endpoints.find((e) => e.key === url);
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3${endpoint.url}${endpoint.url.includes('?') ? '&' : '?'}page=${currentPage}`
      );

      if (!response.ok) throw new Error("Connection lost. Please try again.");

      const data = await response.json();
      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages, 500)); // TMDB limit is 500
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, currentPage, endpoints]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams({ page: newPage });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent_50%)] pointer-events-none opacity-40" />

      <div className="max-w-[1600px] mx-auto px-6 py-12 relative z-10">
        
        {/* Header / Hero Section */}
        <header className="mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="mb-4 border-purple-500/30 text-purple-400 bg-purple-500/5 px-3 py-1">
              {CATEGORY_MAP[url]?.icon || <Film className="w-3 h-3 mr-2" />}
              {url.split(' ').pop()} Library
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
              {url}
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl mt-4">
              {CATEGORY_MAP[url]?.desc || "Explore our handpicked selection of premium titles."}
            </p>
          </motion.div>
        </header>

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader color="#9333ea" loading={true} size={40} />
            <p className="text-zinc-500 animate-pulse font-medium tracking-widest uppercase text-xs">Synchronizing Database</p>
          </div>
        ) : error ? (
          <div className="py-40 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-xl text-zinc-400">{error}</p>
            <Button onClick={fetchMovies} variant="link" className="text-purple-500 mt-2">Try Again</Button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            <AnimatePresence>
              {movies.map((movie, idx) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (idx % 12) * 0.05 }}
                >
                  <Card movie={movie} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Improved Pagination UI */}
        {!loading && movies.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-2 p-2 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-full shadow-2xl">
              <Button
                variant="ghost"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="rounded-full hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-3 px-6 py-2 border-x border-white/10 font-mono">
                <span className="text-purple-500 font-bold">{currentPage}</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400">{totalPages}</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="rounded-full hover:bg-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            
            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold">
              Navigate Pages
            </p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && (
          <div className="py-40 text-center text-zinc-600">
            <Film className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="italic">No titles found in this section.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;