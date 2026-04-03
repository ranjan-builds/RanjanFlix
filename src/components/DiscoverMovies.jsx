import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Added for navigation
import {
  Filter,
  SlidersHorizontal,
  Calendar,
  Clock,
  Star,
  X,
  RotateCcw,
  Shuffle,
  Loader2,
  Sparkles,
  Play,
} from "lucide-react";

import Card from "./Card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// --- Persistence Helpers ---
const getSeenMovies = () =>
  JSON.parse(localStorage.getItem("seen_movies") || "[]");
const saveToSeen = (id) => {
  const seen = getSeenMovies();
  if (!seen.includes(id)) {
    localStorage.setItem(
      "seen_movies",
      JSON.stringify([...seen, id].slice(-100)),
    );
  }
};

const GENRES = [
  { id: "all", name: "All Genres" },
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "18", name: "Drama" },
  { id: "27", name: "Horror" },
  { id: "878", name: "Sci-Fi" },
  { id: "53", name: "Thriller" },
];

const DiscoverMovies = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [randomMovie, setRandomMovie] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  const [filters, setFilters] = useState({
    sort_by: "popularity.desc",
    with_genres: "all",
    with_original_language: "all",
    "vote_average.gte": 0,
    "vote_count.gte": 150,
    "with_runtime.gte": 0,
    primary_release_year: "all",
  });

  const observerRef = useRef(null);
  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchRecommendation = useCallback(async () => {
    setIsLoading(true);
    const seenIds = getSeenMovies();
    const moods = [
      { id: "28", name: "Adrenaline Rush 🧨", color: "from-red-600" },
      { id: "878", name: "Future Shock 🤖", color: "from-purple-600" },
      { id: "16", name: "Whimsical Worlds ✨", color: "from-blue-400" },
      { id: "27", name: "Nightmare Fuel 👻", color: "from-zinc-800" },
      { id: "35", name: "Pure Comedy 😂", color: "from-yellow-500" },
    ];
    const mood = moods[Math.floor(Math.random() * moods.length)];
    const randomPage = Math.floor(Math.random() * 8) + 1;

    try {
      const url =
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}` +
        `&with_genres=${mood.id}&vote_count.gte=1000&vote_average.gte=7.2` +
        `&page=${randomPage}&sort_by=popularity.desc`;

      const res = await fetch(url);
      const data = await res.json();
      const fresh = data.results.filter((m) => !seenIds.includes(m.id));
      const pick = fresh.length > 0 ? fresh[0] : data.results[0];

      saveToSeen(pick.id);
      setRandomMovie({ ...pick, moodName: mood.name, moodColor: mood.color });
      setShowRecommendation(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [API_KEY]);

  const fetchMovies = useCallback(
    async (pageToFetch, reset = false) => {
      setIsLoading(true);
      const params = new URLSearchParams({
        api_key: API_KEY,
        page: pageToFetch,
        sort_by: filters.sort_by,
        "vote_count.gte": filters["vote_count.gte"],
        "vote_average.gte": filters["vote_average.gte"],
        "with_runtime.gte": filters["with_runtime.gte"],
      });

      if (filters.with_genres !== "all")
        params.append("with_genres", filters.with_genres);
      if (filters.with_original_language !== "all")
        params.append("with_original_language", filters.with_original_language);
      if (filters.primary_release_year !== "all")
        params.append("primary_release_year", filters.primary_release_year);

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?${params}`,
        );
        const data = await res.json();
        setMovies((prev) =>
          reset ? data.results : [...prev, ...data.results],
        );
        setHasMore(pageToFetch < data.total_pages);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, API_KEY],
  );

  useEffect(() => {
    setPage(1);
    fetchMovies(1, true);
  }, [filters, fetchMovies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((p) => {
            const next = p + 1;
            fetchMovies(next);
            return next;
          });
        }
      },
      { threshold: 0.1 },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, fetchMovies]);

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const activeFilterCount = useMemo(
    () =>
      Object.entries(filters).filter(
        ([k, v]) =>
          !["sort_by", "vote_count.gte"].includes(k) && v !== "all" && v !== 0,
      ).length,
    [filters],
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/40">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Badge
              variant="outline"
              className="mb-4 border-purple-500/30 text-purple-400 px-4 py-1 rounded-full bg-purple-500/5"
            >
              <Sparkles className="w-3 h-3 mr-2" /> AI Discovery Engine v2.6
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              EXPLORE.
            </h1>
          </motion.div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Button
              onClick={fetchRecommendation}
              className="rounded-full h-12 px-8 bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-transform active:scale-95"
            >
              <Shuffle className="w-4 h-4 mr-2" /> Surprise Me
            </Button>

            <Select
              value={filters.sort_by}
              onValueChange={(v) => updateFilter("sort_by", v)}
            >
              <SelectTrigger className="w-full md:w-[180px] bg-zinc-900 border-zinc-800 rounded-full h-12">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-zinc-500" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                <SelectItem value="popularity.desc">Most Popular</SelectItem>
                <SelectItem value="vote_average.desc">Top Rated</SelectItem>
                <SelectItem value="primary_release_date.desc">
                  Newest
                </SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full h-12 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"
                >
                  <Filter className="w-4 h-4 mr-2" /> Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 bg-purple-600 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-zinc-950 border-zinc-800 text-white overflow-y-auto">
                <SheetHeader className="mb-8">
                  <SheetTitle className="text-2xl font-bold">
                    Advanced Search
                  </SheetTitle>
                  <SheetDescription className="text-zinc-500">
                    Fine-tune your results.
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">
                      Genres
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {GENRES.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => updateFilter("with_genres", g.id)}
                          className={`px-4 py-2 rounded-xl text-xs transition-all border ${filters.with_genres === g.id ? "bg-white text-black border-white" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}
                        >
                          {g.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <label className="text-[10px] uppercase font-bold text-zinc-500">
                          Min Rating
                        </label>
                        <span className="text-purple-400 font-mono">
                          ⭐ {filters["vote_average.gte"]}
                        </span>
                      </div>
                      <Slider
                        value={[filters["vote_average.gte"]]}
                        max={10}
                        step={0.5}
                        onValueChange={([v]) =>
                          updateFilter("vote_average.gte", v)
                        }
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <label className="text-[10px] uppercase font-bold text-zinc-500">
                          Min Runtime
                        </label>
                        <span className="text-purple-400 font-mono">
                          {filters["with_runtime.gte"]}m
                        </span>
                      </div>
                      <Slider
                        value={[filters["with_runtime.gte"]]}
                        max={240}
                        step={15}
                        onValueChange={([v]) =>
                          updateFilter("with_runtime.gte", v)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Select
                      value={filters.primary_release_year}
                      onValueChange={(v) =>
                        updateFilter("primary_release_year", v)
                      }
                    >
                      <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="all">All Time</SelectItem>
                        {["2026", "2025", "2024", "2023", "2020s", "2010s"].map(
                          (y) => (
                            <SelectItem key={y} value={y}>
                              {y}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full text-zinc-500 hover:text-red-400"
                    onClick={() =>
                      setFilters({
                        sort_by: "popularity.desc",
                        with_genres: "all",
                        with_original_language: "all",
                        "vote_average.gte": 0,
                        "vote_count.gte": 150,
                        "with_runtime.gte": 0,
                        primary_release_year: "all",
                      })
                    }
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Reset Everything
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* --- Responsive Recommendation Hero --- */}
        <AnimatePresence>
          {showRecommendation && randomMovie && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative mb-20 group"
            >
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${randomMovie.moodColor} to-transparent rounded-[1.5rem] md:rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000`}
              ></div>

              <div className="relative flex flex-col md:flex-row bg-zinc-900/60 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 md:right-6 md:top-6 z-20 bg-black/50 hover:bg-black/80 rounded-full"
                  onClick={() => setShowRecommendation(false)}
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Clickable Image Part */}
                <div
                  onClick={() => navigate(`/movie/${randomMovie.id}`)}
                  className="w-full md:w-[350px] lg:w-[400px] aspect-[2/3] shrink-0 cursor-pointer overflow-hidden group/poster"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w780${randomMovie.poster_path}`}
                    alt="Rec"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/poster:scale-110"
                  />
                </div>

                <div className="p-6 md:p-10 lg:p-16 flex flex-col justify-center flex-1">
                  <Badge
                    className={`w-fit mb-4 md:mb-6 bg-gradient-to-r ${randomMovie.moodColor} text-white border-none px-4 py-1.5`}
                  >
                    MOOD: {randomMovie.moodName}
                  </Badge>

                  <h2
                    onClick={() => navigate(`/movie/${randomMovie.id}`)}
                    className="text-3xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 leading-none cursor-pointer hover:text-purple-400 transition-colors"
                  >
                    {randomMovie.title}
                  </h2>

                  <div className="flex flex-wrap gap-4 md:gap-8 mb-6 md:mb-8 text-zinc-400 font-medium text-sm md:text-base">
                    <span className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 md:w-5 md:h-5 mr-2 fill-yellow-500" />{" "}
                      {randomMovie.vote_average.toFixed(1)}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />{" "}
                      {new Date(randomMovie.release_date).getFullYear()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2" />{" "}
                      {randomMovie.runtime || "120"}m
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm md:text-lg leading-relaxed mb-6 md:mb-10 max-w-2xl line-clamp-3 md:line-clamp-4">
                    {randomMovie.overview}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      onClick={() => navigate(`/movie/${randomMovie.id}`)}
                      className="bg-white text-black hover:bg-zinc-200 rounded-xl md:rounded-2xl px-10 h-12 md:h-14 font-bold text-base md:text-lg"
                    >
                      <Play className="w-5 h-5 mr-2 fill-black" /> Watch Now
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={fetchRecommendation}
                      className="rounded-xl md:rounded-2xl px-10 h-12 md:h-14 border-white/10 hover:bg-white/5 text-base md:text-lg"
                    >
                      Next One
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid - Fully Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
          {movies.map((movie, idx) => (
            <motion.div
              key={`${movie.id}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 12) * 0.05 }}
            >
              <Card movie={movie} />
            </motion.div>
          ))}
        </div>

        {/* Sentinel / Loader */}
        <div
          ref={observerRef}
          className="py-24 flex flex-col items-center justify-center"
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
              <span className="text-zinc-500 font-medium animate-pulse tracking-widest uppercase text-[10px]">
                Loading Archives
              </span>
            </div>
          ) : (
            !hasMore &&
            movies.length > 0 && <div className="h-px w-24 bg-zinc-800" />
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverMovies;
