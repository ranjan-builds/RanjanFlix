import { useEffect, useState, useCallback } from "react";
import { useParams, NavLink } from "react-router-dom";
import { toast } from "sonner";
import Card from "./Card";
import Loader from "./Loader";
import MovieCategoryName from "./MovieCategoryName";
import {
  GoAlert,
  GoArrowLeft,
  GoPlay,
  GoClock,
  GoCalendar,
  GoDeviceCameraVideo,
  GoStar,
  GoChevronRight,
  GoListOrdered,
} from "react-icons/go";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CollectionPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const fetchWithErrorHandling = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  }, []);

  const fetchMovieTrailer = useCallback(
    async (movieId) => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
        );
        const data = await response.json();

        const trailers =
          data.results?.filter(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          ) || [];

        if (trailers.length > 0) {
          return `https://www.youtube.com/embed/${trailers[0].key}`;
        }
        return null;
      } catch (error) {
        console.error("Error fetching trailer:", error);
        return null;
      }
    },
    [apiKey]
  );

  const handlePlayTrailer = async (movie) => {
    setIsDrawerOpen(true);
    setTrailerLoading(true);
    setSelectedTrailer(null);

    const trailerUrl = await fetchMovieTrailer(movie.id);
    setSelectedTrailer(trailerUrl);
    setTrailerLoading(false);
  };

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        setLoading(true);
        setError(null);

        const urls = [
          `https://api.themoviedb.org/3/collection/${id}?api_key=${apiKey}`,
        ];

        const [collectionRes] = await Promise.all(
          urls.map(fetchWithErrorHandling)
        );

        if (collectionRes.status_code === 34) {
          throw new Error("Collection not found");
        }

        setCollection(collectionRes);
        setMovies(collectionRes.parts || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching collection data:", error);
        toast.error(
          error.message || "An error occurred while fetching collection data"
        );
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [id, apiKey, fetchWithErrorHandling]);

  const sortMoviesByReleaseDate = useCallback((movies) => {
    return movies.sort((a, b) => {
      const dateA = new Date(a.release_date || "9999-12-31");
      const dateB = new Date(b.release_date || "9999-12-31");
      return dateA - dateB;
    });
  }, []);

  const getTotalRuntime = useCallback(() => {
    return movies.reduce((total, movie) => total + (movie.runtime || 0), 0);
  }, [movies]);

  const convertMinutesToTime = useCallback((minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours > 0 ? `${hours}h` : ""} ${
      remainingMinutes > 0 ? `${remainingMinutes}m` : ""
    }`.trim();
  }, []);

  const getReleaseYears = useCallback(() => {
    if (movies.length === 0) return "";

    const sortedMovies = sortMoviesByReleaseDate([...movies]);
    const firstYear = sortedMovies[0].release_date?.split("-")[0] || "TBA";
    const lastYear =
      sortedMovies[sortedMovies.length - 1].release_date?.split("-")[0] ||
      "TBA";

    return firstYear === lastYear ? firstYear : `${firstYear} - ${lastYear}`;
  }, [movies, sortMoviesByReleaseDate]);

  const getAverageRating = useCallback(() => {
    if (movies.length === 0) return 0;
    const total = movies.reduce(
      (sum, movie) => sum + (movie.vote_average || 0),
      0
    );
    return (total / movies.length).toFixed(1);
  }, [movies]);

  if (loading) return <Loader loading={true} size={20} />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="border border-red-800 rounded-xl p-6 bg-red-950/20">
            <GoAlert className="text-red-500 text-3xl mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Collection Not Found
            </h2>
            <p className="text-red-400">{error}</p>
          </div>
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
          >
            <GoArrowLeft />
            Return to Home
          </NavLink>
        </div>
      </div>
    );

  if (!collection)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-xl text-gray-400 mb-4">Collection not found</p>
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
          >
            <GoArrowLeft />
            Back to Home
          </NavLink>
        </div>
      </div>
    );

  const sortedMovies = sortMoviesByReleaseDate([...movies]);
  const totalRuntime = getTotalRuntime();
  const averageRating = getAverageRating();

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section - Full Dark */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors text-gray-300"
          >
            <GoArrowLeft />
            Back to Home
          </NavLink>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_auto] gap-8 items-start">
            {/* Poster */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <img
                  className="w-64 h-96 rounded-xl shadow-lg object-cover border border-gray-800"
                  src={`https://image.tmdb.org/t/p/w500/${collection.poster_path}`}
                  alt={collection.name}
                  onError={(e) => {
                    e.target.src = "/placeholder-poster.jpg";
                  }}
                />
              </div>
            </div>

            {/* Collection Info */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {collection.name}
                </h1>
                {collection.overview && (
                  <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
                    {collection.overview}
                  </p>
                )}
              </div>

              {/* Collection Stats */}
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="px-3 py-1 border-gray-700 text-gray-300">
                  <GoDeviceCameraVideo className="mr-2" />
                  {movies.length} Movies
                </Badge>
                {totalRuntime > 0 && (
                  <Badge variant="outline" className="px-3 py-1 border-gray-700 text-gray-300">
                    <GoClock className="mr-2" />
                    {convertMinutesToTime(totalRuntime)}
                  </Badge>
                )}
                <Badge variant="outline" className="px-3 py-1 border-gray-700 text-gray-300">
                  <GoCalendar className="mr-2" />
                  {getReleaseYears()}
                </Badge>
                {averageRating > 0 && (
                  <Badge variant="outline" className="px-3 py-1 border-gray-700 text-gray-300">
                    <GoStar className="mr-2" />
                    {averageRating} Avg
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handlePlayTrailer(sortedMovies[0])}
                    >
                      <GoPlay className="text-lg" />
                      Play First Movie Trailer
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="max-w-4xl mx-auto bg-gray-900 border-gray-800">
                    <DrawerHeader>
                      <DrawerTitle className="flex items-center gap-2 text-white">
                        <GoPlay className="text-blue-500" />
                        Watch Trailer
                      </DrawerTitle>
                      <DrawerDescription className="text-gray-400">
                        {sortedMovies[0]?.title}
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-6 pb-6">
                      {trailerLoading ? (
                        <div className="flex items-center justify-center h-48 bg-gray-800 rounded-lg">
                          <Loader loading={true} size={16} />
                          <span className="ml-3 text-gray-300">Loading trailer...</span>
                        </div>
                      ) : selectedTrailer ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`${selectedTrailer}?autoplay=1&rel=0`}
                            title="Movie Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-48 bg-gray-800 rounded-lg gap-3">
                          <GoAlert className="text-3xl text-gray-500" />
                          <p className="text-gray-400">Trailer not available</p>
                        </div>
                      )}
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          Close
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Section - Full Dark */}
      <div className="container mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <GoListOrdered className="text-blue-500" />
              Movies in Collection
            </h2>
            <p className="text-gray-400 mt-1">
              {movies.length} movies sorted by release date
            </p>
          </div>
          <Badge variant="secondary" className="text-sm bg-gray-800 text-gray-300 border-gray-700">
            Chronological Order
          </Badge>
        </div>

        {/* Stats Grid - Full Dark */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-950 rounded-lg">
                <GoDeviceCameraVideo className="text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {movies.length}
                </p>
                <p className="text-sm text-gray-400">Movies</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-950 rounded-lg">
                <GoClock className="text-green-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {convertMinutesToTime(totalRuntime)}
                </p>
                <p className="text-sm text-gray-400">Runtime</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-950 rounded-lg">
                <GoCalendar className="text-purple-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {getReleaseYears()}
                </p>
                <p className="text-sm text-gray-400">Timeline</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-950 rounded-lg">
                <GoStar className="text-yellow-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {averageRating}
                </p>
                <p className="text-sm text-gray-400">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="px-1">
          {sortedMovies.length > 0 && (
            <MovieCategoryName title={"Movies"} />
          )}
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
            {sortedMovies.map((movie) => (
              <Card key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}