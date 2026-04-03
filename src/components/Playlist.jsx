import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Trash2, Play, Clock, Plus, Film, 
  ChevronDown, LayoutGrid, Info 
} from "lucide-react";

import Card from "./Card";
import MovieCategoryName from "./MovieCategoryName";
import Loader from "./Loader";
import { Button } from "@/components/ui/button";

const Playlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("added");
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_API_KEY || "4c1eef5a8d388386187a3426bc2345be";

  useEffect(() => {
    const fetchMovies = async () => {
      const playlist = JSON.parse(localStorage.getItem("playlist")) || [];
      if (playlist.length === 0) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const moviePromises = playlist.map((id) =>
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
            .then((res) => {
              if (!res.ok) throw new Error();
              return res.json();
            })
        );
        const movieData = await Promise.all(moviePromises);
        setMovies(movieData.filter(m => m !== null));
      } catch (error) {
        toast.error("Some movies couldn't be loaded.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [API_KEY]);

  const sortedMovies = useMemo(() => {
    const sorted = [...movies];
    switch (sortBy) {
      case "title": return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "rating": return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case "year": return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      default: return sorted;
    }
  }, [movies, sortBy]);

  const stats = useMemo(() => {
    const totalMinutes = movies.reduce((total, m) => total + (m.runtime || 0), 0);
    return {
      count: movies.length,
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };
  }, [movies]);

  const removeFromWatchlist = (id) => {
    const playlist = JSON.parse(localStorage.getItem("playlist")) || [];
    const newPlaylist = playlist.filter((movieId) => movieId !== id);
    localStorage.setItem("playlist", JSON.stringify(newPlaylist));
    setMovies(prev => prev.filter((movie) => movie.id !== id));
    toast.success("Removed from list");
  };

  const clearAllMovies = () => {
    if (window.confirm("Are you sure you want to clear your entire watchlist?")) {
      localStorage.setItem("playlist", JSON.stringify([]));
      setMovies([]);
      toast.success("Watchlist cleared");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <Loader color="#9333ea" loading={true} size={40} />
      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="text-zinc-500 mt-6 font-medium tracking-wide text-sm md:text-base"
      >
        RETRIEVING YOUR COLLECTION...
      </motion.p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 pb-20 overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-900/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 relative z-10">
        
        {/* FIXED HEADER: Responsive alignment */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6 w-full">
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center gap-2 text-purple-500 mb-1">
              <Film className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Library</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Watchlist<span className="text-purple-600">.</span>
            </h1>
          </div>

          {movies.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-800 text-xs md:text-sm rounded-full pl-4 md:pl-5 pr-10 py-2.5 focus:ring-2 focus:ring-purple-600 outline-none transition cursor-pointer hover:bg-zinc-800"
                >
                  <option value="added">Recently Added</option>
                  <option value="title">Alphabetical</option>
                  <option value="rating">Top Rated</option>
                  <option value="year">Release Date</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500" />
              </div>
              <Button
                variant="ghost"
                onClick={clearAllMovies}
                className="rounded-full text-zinc-500 hover:text-red-400 hover:bg-red-950/20 text-xs md:text-sm h-10 px-4"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Clear
              </Button>
            </div>
          )}
        </header>

        {movies.length > 0 ? (
          <>
            {/* Quick Stats: Responsive Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-12"
            >
              <StatItem 
                icon={<Film className="text-purple-400" />} 
                label="Total Movies" 
                value={stats.count} 
                sub="Titles"
              />
              <StatItem 
                icon={<Clock className="text-blue-400" />} 
                label="Watch Time" 
                value={`${stats.hours}h ${stats.minutes}m`} 
                sub="Runtime"
              />
              <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-4 md:p-5 rounded-2xl flex flex-row items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-zinc-400 text-xs md:text-sm font-medium truncate">Continue Watching</p>
                  <p className="text-zinc-500 text-[10px] md:text-xs mt-0.5">Pick up where you left off</p>
                </div>
                <Button onClick={() => navigate("/discover")} className="bg-purple-600 hover:bg-purple-700 rounded-xl text-xs md:text-sm h-9 md:h-11 px-3 md:px-5 shrink-0">
                  <Play className="w-3 h-3 md:w-4 md:h-4 mr-2 fill-current" /> Surprise Me
                </Button>
              </div>
            </motion.div>

            {/* Movie Grid: Mobile optimized spacing */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <MovieCategoryName title="Curated Selection" />
                <LayoutGrid className="w-4 h-4 md:w-5 md:h-5 text-zinc-700" />
              </div>
              
              <motion.div 
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {sortedMovies.map((movie) => (
                    <motion.div
                      key={movie.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        cancel={true}
                        movie={movie}
                        onRemoveFromWatchlist={removeFromWatchlist}
                        showRemoveButton={true}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="mt-16 md:mt-20 py-10 border-t border-zinc-900 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest mb-4">
                <Info className="w-3 h-3 md:w-4 md:h-4" /> Cloud sync coming soon
              </div>
              <Button 
                variant="link" 
                className="text-zinc-400 hover:text-purple-400 text-sm"
                onClick={() => navigate("/")}
              >
                <Plus className="w-4 h-4 mr-2" /> Add more to your collection
              </Button>
            </div>
          </>
        ) : (
          <EmptyState navigate={navigate} />
        )}
      </div>
    </div>
  );
};

const StatItem = ({ icon, label, value, sub }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-4 md:p-5 rounded-2xl backdrop-blur-sm">
    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
      <div className="p-1.5 md:p-2 bg-zinc-950 rounded-lg border border-zinc-800">{icon}</div>
      <span className="text-zinc-400 text-[11px] md:text-sm font-medium">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <h4 className="text-xl md:text-2xl font-bold text-white leading-none">{value}</h4>
      <span className="text-[9px] md:text-[10px] uppercase text-zinc-600 font-bold tracking-wider">{sub}</span>
    </div>
  </div>
);

const EmptyState = ({ navigate }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 md:py-32 text-center px-4"
  >
    <div className="relative mb-6 md:mb-8">
      <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full" />
      <div className="relative w-20 h-20 md:w-24 md:h-24 bg-zinc-900 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-800 flex items-center justify-center">
        <Film className="w-8 h-8 md:w-10 md:h-10 text-zinc-700" />
      </div>
    </div>
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Your library is empty</h2>
    <p className="text-zinc-500 max-w-sm mb-8 md:mb-10 text-sm md:text-lg">
      There are millions of stories waiting to be discovered. Start building your collection.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
      <Button 
        onClick={() => navigate("/discover")} 
        className="bg-purple-600 hover:bg-purple-700 h-11 md:h-12 px-8 rounded-2xl font-bold transition-transform hover:scale-105"
      >
        <Plus className="w-5 h-5 mr-2" /> Discover Movies
      </Button>
      <Button 
        variant="outline" 
        onClick={() => navigate("/")} 
        className="h-11 md:h-12 px-8 rounded-2xl border-zinc-800 text-zinc-400 hover:bg-zinc-900"
      >
        Go to Home
      </Button>
    </div>
  </motion.div>
);

export default Playlist;