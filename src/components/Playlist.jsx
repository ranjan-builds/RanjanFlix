import React, { useEffect, useState } from "react";
import Card from "./Card";
import MovieCategoryName from "./MovieCategoryName";
import { toast } from "sonner";
import Loader from "./Loader";
import { Trash2, Play, Clock, Plus, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

const Playlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("added"); // "added", "title", "rating", "year"

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
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=4c1eef5a8d388386187a3426bc2345be`
          ).then((response) => {
            if (!response.ok) throw new Error("Failed to fetch movie");
            return response.json();
          })
        );

        const movieData = await Promise.all(moviePromises);
        setMovies(movieData);
      } catch (error) {
        console.error("Error fetching movie data:", error);
        toast.error("Failed to load watchlist movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const removeFromWatchlist = (id) => {
    const updatedPlaylist = JSON.parse(localStorage.getItem("playlist")) || [];
    const newPlaylist = updatedPlaylist.filter((movieId) => movieId !== id);
    localStorage.setItem("playlist", JSON.stringify(newPlaylist));
    setMovies(movies.filter((movie) => movie.id !== id));
    toast.success("Removed from watchlist");
  };

  const clearAllMovies = () => {
    localStorage.setItem("playlist", JSON.stringify([]));
    setMovies([]);
    toast.success("Watchlist cleared");
  };

  const sortMovies = (movies, sortType) => {
    const sortedMovies = [...movies];
    switch (sortType) {
      case "title":
        return sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
      case "rating":
        return sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
      case "year":
        return sortedMovies.sort((a, b) => 
          new Date(b.release_date) - new Date(a.release_date)
        );
      case "added":
      default:
        return sortedMovies.reverse(); // Most recently added first
    }
  };

  const sortedMovies = sortMovies(movies, sortBy);

  const getTotalWatchTime = () => {
    const totalMinutes = movies.reduce((total, movie) => total + (movie.runtime || 0), 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  const { hours, minutes } = getTotalWatchTime();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader color="purple" loading={true} size={32} />
          <p className="text-gray-300 mt-4 text-lg">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 lg:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-600 rounded-2xl">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              My Watchlist
            </h1>
          </div>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Your personal collection of movies to watch
          </p>
        </div>

        {movies.length > 0 ? (
          <>
            {/* Stats and Controls */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Film className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{movies.length}</p>
                      <p className="text-gray-400 text-sm">Total Movies</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{hours}h {minutes}m</p>
                      <p className="text-gray-400 text-sm">Total Watch Time</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="added">Recently Added</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="rating">Highest Rated</option>
                    <option value="year">Newest Releases</option>
                  </select>

                  {/* Clear All Button */}
                  <Button
                    onClick={clearAllMovies}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </div>

            {/* Movie Grid */}
            <div className="mb-8">
              <MovieCategoryName 
                title={"Your Watchlist"} 
                movieCount={movies.length}
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {sortedMovies.map((movie) => (
                  <Card
                    cancel={true}
                    key={movie.id}
                    movie={movie}
                    onRemoveFromWatchlist={removeFromWatchlist}
                    showRemoveButton={true}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">
                Ready to watch something?
              </h3>
              <p className="text-gray-300 mb-4">
                Pick a movie from your list and enjoy your movie night!
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Random Movie
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.location.href = '/discover'}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add More Movies
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-2xl flex items-center justify-center">
                <Play className="w-10 h-10 text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Your Watchlist is Empty
              </h2>
              <p className="text-gray-400 mb-8">
                Start building your movie collection by adding films you want to watch later.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  onClick={() => window.location.href = '/discover'}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Discover Movies
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.location.href = '/'}
                >
                  Browse Home
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        {movies.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">
              Your watchlist is saved locally in your browser
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;