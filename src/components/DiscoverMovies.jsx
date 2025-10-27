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

  // Enhanced movie genres with icons
  const genres = [
    { id: "all", name: "All Genres", emoji: "🎬" },
    { id: "28", name: "Action", emoji: "💥" },
    { id: "12", name: "Adventure", emoji: "🗺️" },
    { id: "16", name: "Animation", emoji: "🎬" },
    { id: "35", name: "Comedy", emoji: "😂" },
    { id: "80", name: "Crime", emoji: "🔫" },
    { id: "99", name: "Documentary", emoji: "📽️" },
    { id: "18", name: "Drama", emoji: "🎭" },
    { id: "10751", name: "Family", emoji: "👨‍👩‍👧‍👦" },
    { id: "14", name: "Fantasy", emoji: "🦄" },
    { id: "36", name: "History", emoji: "📜" },
    { id: "27", name: "Horror", emoji: "👻" },
    { id: "10402", name: "Music", emoji: "🎵" },
    { id: "9648", name: "Mystery", emoji: "🕵️" },
    { id: "10749", name: "Romance", emoji: "💕" },
    { id: "878", name: "Sci-Fi", emoji: "🚀" },
    { id: "53", name: "Thriller", emoji: "🔪" },
    { id: "10752", name: "War", emoji: "⚔️" },
    { id: "37", name: "Western", emoji: "🤠" },
  ];

  const languages = [
    { code: "all", name: "All Languages" },
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "te", name: "Telugu" },
    { code: "ta", name: "Tamil" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
  ];

  const sortOptions = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "popularity.asc", label: "Least Popular" },
    { value: "release_date.desc", label: "Newest Releases" },
    { value: "release_date.asc", label: "Oldest Releases" },
    { value: "vote_average.desc", label: "Highest Rated" },
    { value: "vote_average.asc", label: "Lowest Rated" },
    { value: "vote_count.desc", label: "Most Votes" },
    { value: "revenue.desc", label: "Highest Revenue" },
    { value: "title.asc", label: "Title (A-Z)" },
    { value: "title.desc", label: "Title (Z-A)" },
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
    const baseUrl = "https://api.themoviedb.org/3/discover/movie";
    const apiKey = import.meta.env.VITE_API_KEY;

    // Clean up filters - remove "all" values and convert to proper API format
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => {
        if (value === "all" || value === "0") return false;
        return value !== "";
      })
    );

    const queryString = new URLSearchParams({
      api_key: apiKey,
      page: pageToFetch,
      ...cleanFilters,
    }).toString();

    const url = `${baseUrl}?${queryString}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (reset) {
        setMovies(data.results || []);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...(data.results || [])]);
      }
      
      setHasMore(pageToFetch < (data.total_pages || 1));
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Fetch random movie recommendation
  const fetchRandomMovie = useCallback(async () => {
    setIsLoading(true);
    const apiKey = import.meta.env.VITE_API_KEY;
    
    try {
      // First, get a random page to increase variety
      const randomPage = Math.floor(Math.random() * 100) + 1;
      const baseUrl = "https://api.themoviedb.org/3/discover/movie";
      
      const queryString = new URLSearchParams({
        api_key: apiKey,
        page: randomPage,
        sort_by: "popularity.desc",
        "vote_count.gte": "100",
      }).toString();

      const url = `${baseUrl}?${queryString}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Pick a random movie from the results
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const movie = data.results[randomIndex];
        
        setRandomMovie(movie);
        setShowRandomMovie(true);
        
        // Scroll to random movie section
        setTimeout(() => {
          document.getElementById('random-movie-section')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
        }, 100);
      }
    } catch (error) {
      console.error("Failed to fetch random movie:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Reset and fetch when filters change
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchMovies(1, true);
  }, [filters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchMovies(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore, isLoading]);

  const updateFilter = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 p-4">
      {/* Animated Background */}
   

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Discover Movies
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Explore thousands of movies with advanced filters and get personalized recommendations
          </p>
        </div>

        {/* Random Movie Recommendation */}
        {showRandomMovie && randomMovie && (
          <div id="random-movie-section" className="mb-8 animate-fade-in">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Featured Pick</h2>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium">
                  Recommended for You
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <Card movie={randomMovie} size="lg" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {randomMovie.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {randomMovie.overview || "No description available."}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                    <span>⭐ {randomMovie.vote_average?.toFixed(1)}</span>
                    <span>📅 {new Date(randomMovie.release_date).getFullYear()}</span>
                    <span>👥 {randomMovie.vote_count} votes</span>
                  </div>
                  <Button
                    onClick={() => setShowRandomMovie(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Close Recommendation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button
            onClick={fetchRandomMovie}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            {isLoading ? "Finding..." : "Surprise Me!"}
          </Button>
          
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 font-semibold px-6 py-3 rounded-full"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <Select
                value={filters.sort_by}
                onValueChange={(value) => updateFilter("sort_by", value)}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <Select
                value={filters.with_original_language}
                onValueChange={(value) => updateFilter("with_original_language", value)}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent >
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genres
              </label>
              <Select
                value={filters.with_genres}
                onValueChange={(value) => updateFilter("with_genres", value)}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent >
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                      <span className="flex items-center gap-2">
                        <span>{genre.emoji}</span>
                        {genre.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Min Rating
              </label>
              <Select
                value={filters["vote_average.gte"]}
                onValueChange={(value) => updateFilter("vote_average.gte", value)}
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent >
                  {ratingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Movie Grid */}
        {isInitialLoad ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {movies.map((movie, index) => (
                <Card key={`${movie.id}-${index}`} movie={movie} />
              ))}
            </div>

            {/* Loading and End States */}
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin mr-3" />
                <span className="text-gray-300">Loading more movies...</span>
              </div>
            )}

            {!hasMore && movies.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300 font-medium">
                    You've reached the end! {movies.length} movies loaded.
                  </span>
                </div>
              </div>
            )}

            {movies.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <Filter className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No movies found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your filters or explore different genres.
                  </p>
                  <Button
                    onClick={clearFilters}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Infinite Scroll Sentinel */}
            {hasMore && <div ref={observerRef} className="h-10" />}
          </>
        )}
      </div>
    </div>
  );
};

export default DiscoverMovies;