import React, { useEffect, useState } from "react";
import Card from "./Card";
import MovieCategoryName from "./MovieCategoryName";
import { toast } from "sonner";
import Loader from "./Loader";
import { Trash2, Play, Clock, Plus, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Playlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("added");
  const navigate = useNavigate();
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
    const sorted = [...movies];
    switch (sortType) {
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "rating":
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case "year":
        return sorted.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
      case "added":
      default:
        return sorted.reverse();
    }
  };

  const sortedMovies = sortMovies(movies, sortBy);

  const getTotalWatchTime = () => {
    const totalMinutes = movies.reduce(
      (total, movie) => total + (movie.runtime || 0),
      0
    );
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  const { hours, minutes } = getTotalWatchTime();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader color="purple" loading={true} size={32} />
          <p className="text-gray-400 mt-4 text-lg">
            Loading your watchlist...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-950 rounded-xl border border-purple-800">
              <Play className="w-7 h-7 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              My Watchlist
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Curate. Collect. Enjoy your personal movie space.
          </p>
        </div>

        {movies.length > 0 ? (
          <>
            {/* Stats + Controls */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-10 shadow-sm">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-950 rounded-lg">
                      <Film className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-white">
                        {movies.length}
                      </p>
                      <p className="text-gray-400 text-sm">Movies</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-950 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-white">
                        {hours}h {minutes}m
                      </p>
                      <p className="text-gray-400 text-sm">Total Duration</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 transition"
                  >
                    <option value="added">Recently Added</option>
                    <option value="title">Title (A–Z)</option>
                    <option value="rating">Highest Rated</option>
                    <option value="year">Newest Releases</option>
                  </select>

                  <Button
                    onClick={clearAllMovies}
                    variant="outline"
                    className="border-red-800 text-red-400 hover:bg-red-950/50 transition"
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
                title="Your Watchlist"
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

            {/* Footer Actions */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                Ready to watch something?
              </h3>
              <p className="text-gray-400 mb-4">
                Pick a movie and dive into your cinematic world.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={() => navigate("/discover")}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Random
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => navigate("/")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add More Movies
                </Button>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center mt-12 text-gray-500 text-sm">
              Your watchlist is saved locally in your browser.
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-24">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800">
                <Play className="w-8 h-8 text-gray-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-3">
                Your Watchlist is Empty
              </h2>
              <p className="text-gray-400 mb-8">
                Add movies you love and build your perfect collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                  onClick={() => navigate("/discover")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Discover Movies
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => navigate("/")}
                >
                  Browse Home
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;
