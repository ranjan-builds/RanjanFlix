import React, { useState, useEffect, useRef, useCallback } from "react";
import Card from "./Card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Shuffle, Filter, Sparkles, Loader2 } from "lucide-react";

const DiscoverMovies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [randomMovie, setRandomMovie] = useState(null);
  const [showRandomMovie, setShowRandomMovie] = useState(false);
  const [filters, setFilters] = useState({
    sort_by: "popularity.desc",
    with_original_language: "all",
    with_genres: "all",
    "vote_average.gte": "0",
  });

  const observerRef = useRef(null);

  const genres = [
    { id: "all", name: "All Genres" },
    { id: "28", name: "Action" },
    { id: "12", name: "Adventure" },
    { id: "16", name: "Animation" },
    { id: "35", name: "Comedy" },
    { id: "99", name: "Documentary" },
    { id: "18", name: "Drama" },
    { id: "27", name: "Horror" },
    { id: "9648", name: "Mystery" },
    { id: "10749", name: "Romance" },
    { id: "878", name: "Sci-Fi" },
    { id: "53", name: "Thriller" },
  ];

  const languages = [
    { code: "all", name: "All Languages" },
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "te", name: "Telugu" },
    { code: "ta", name: "Tamil" },
  ];

  const sortOptions = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "release_date.desc", label: "Newest Releases" },
    { value: "vote_average.desc", label: "Highest Rated" },
    { value: "revenue.desc", label: "Highest Revenue" },
    { value: "title.asc", label: "Title (A-Z)" },
  ];

  const ratingOptions = [
    { value: "0", label: "Any Rating" },
    { value: "7", label: "⭐ 7.0+" },
    { value: "8", label: "⭐ 8.0+" },
    { value: "9", label: "⭐ 9.0+" },
  ];

  const fetchMovies = async (pageToFetch, reset = false) => {
    if (isLoading) return;
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_API_KEY;
    const baseUrl = "https://api.themoviedb.org/3/discover/movie";

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "all" && v !== "0")
    );

    const query = new URLSearchParams({
      api_key: apiKey,
      page: pageToFetch,
      ...cleanFilters,
    }).toString();

    try {
      const res = await fetch(`${baseUrl}?${query}`);
      const data = await res.json();
      reset
        ? setMovies(data.results)
        : setMovies((prev) => [...prev, ...data.results]);
      setHasMore(pageToFetch < data.total_pages);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const fetchRandomMovie = useCallback(async () => {
    setIsLoading(true);
    const apiKey = import.meta.env.VITE_API_KEY;
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${randomPage}&sort_by=popularity.desc`
    );
    const data = await res.json();
    const movie =
      data.results?.[Math.floor(Math.random() * data.results.length)];
    setRandomMovie(movie);
    setShowRandomMovie(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMovies(1, true);
  }, [filters]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        const next = page + 1;
        setPage(next);
        fetchMovies(next);
      }
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, page]);

  const clearFilters = () => {
    setFilters({
      sort_by: "popularity.desc",
      with_original_language: "all",
      with_genres: "all",
      "vote_average.gte": "0",
    });
  };

  const hasActiveFilters =
    filters.with_original_language !== "all" ||
    filters.with_genres !== "all" ||
    filters["vote_average.gte"] !== "0";

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              Discover Movies
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Filter, explore, and find your next favorite film.
          </p>
        </div>

        {/* Random Movie */}
        {showRandomMovie && randomMovie && (
          <div className="mb-10 bg-white/[0.03] border border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl transition-all hover:border-white/20">
            <div className="flex flex-col md:flex-row gap-6">
              <Card movie={randomMovie} size="lg" />
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {randomMovie.title}
                </h2>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {randomMovie.overview}
                </p>
                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  <span>⭐ {randomMovie.vote_average.toFixed(1)}</span>
                  <span>
                    📅 {new Date(randomMovie.release_date).getFullYear()}
                  </span>
                  <span>👥 {randomMovie.vote_count}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowRandomMovie(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Button
            onClick={fetchRandomMovie}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-6 py-3 transition-transform hover:scale-105"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            {isLoading ? "Loading..." : "Surprise Me"}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 rounded-full px-6 py-3"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Filter Section */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-10 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-semibold">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Sort By", key: "sort_by", options: sortOptions },
              {
                label: "Language",
                key: "with_original_language",
                options: languages.map((l) => ({
                  value: l.code,
                  label: l.name,
                })),
              },
              {
                label: "Genre",
                key: "with_genres",
                options: genres.map((g) => ({ value: g.id, label: g.name })),
              },
              {
                label: "Min Rating",
                key: "vote_average.gte",
                options: ratingOptions,
              },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="block text-sm text-gray-400 mb-2">
                  {label}
                </label>
                <Select
                  value={filters[key]}
                  onValueChange={(v) => setFilters((f) => ({ ...f, [key]: v }))}
                >
                  <SelectTrigger className="bg-neutral-900 border border-neutral-800 text-white">
                    <SelectValue placeholder={label} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Movie Grid */}
        {isInitialLoad ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
              {movies.map((m, i) => (
                <Card key={i} movie={m} />
              ))}
            </div>

            {isLoading && (
              <div className="flex justify-center py-10 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading
                more...
              </div>
            )}

            {!hasMore && movies.length > 0 && (
              <div className="text-center text-gray-500 py-10">
                🎬 You’ve reached the end — {movies.length} movies loaded.
              </div>
            )}

            {movies.length === 0 && !isLoading && (
              <div className="text-center py-20 text-gray-400">
                <Filter className="w-10 h-10 mx-auto mb-4" />
                <p>No movies found. Try different filters.</p>
                <Button
                  onClick={clearFilters}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Reset Filters
                </Button>
              </div>
            )}

            {hasMore && <div ref={observerRef} className="h-10" />}
          </>
        )}
      </div>
    </div>
  );
};

export default DiscoverMovies;
