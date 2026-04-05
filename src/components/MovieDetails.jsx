import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { toast } from "sonner";
import {
  GoHeart,
  GoHeartFill,
  GoShare,
  GoDownload,
  GoPlay,
  GoAlert,
  GoStarFill,
} from "react-icons/go";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Components & Libs
import Card from "./Card";
import MovieCategoryName from "./MovieCategoryName";
import { CastCarousel } from "./CastCarousel";
import { BackdropCarousel } from "./BackdropCarousel";
import ExtraDetails from "./ExtraDetails";
import Loader from "./Loader";
import movieRatings from "@/lib/Rating";
import { getDominantColor } from "@/lib/Color";
import { getTextColorForBackground } from "@/lib/TextColor";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function MovieDetails() {
  const { id } = useParams();
  const apiKey = import.meta.env.VITE_API_KEY;

  // States (Keeping your existing logic)
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [credits, setCredits] = useState([]);
  const [crew, setCrew] = useState({});
  const [backdrops, setBackdrops] = useState([]);
  const [movieKeywords, setKeywords] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [Bg, setBgColor] = useState("#141414"); // Netflix Default
  const [textColor1, setTextColor] = useState("white");
  const [hasMovie, setHasMovie] = useState(false);
  const [error, setError] = useState(null);

  const getPlaylist = () => {
    try {
      return JSON.parse(localStorage.getItem("playlist")) || [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setHasMovie(getPlaylist().includes(Number(id)));
  }, [id]);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const fetchJSON = async (url) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          return res.json();
        };

        const [
          movieRes,
          relatedRes,
          creditRes,
          trailerRes,
          backdropRes,
          keywordsRes,
          ratingRes,
          reviewsRes,
        ] = await Promise.all([
          fetchJSON(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`,
          ),
          fetchJSON(
            `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}`,
          ),
          fetchJSON(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`,
          ),
          fetchJSON(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`,
          ),
          fetchJSON(
            `https://api.themoviedb.org/3/movie/${id}/images?api_key=${apiKey}`,
          ),
          fetchJSON(
            `https://api.themoviedb.org/3/movie/${id}/keywords?api_key=${apiKey}`,
          ),
          fetchJSON(
            `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${apiKey}`,
          ),
          fetchJSON(
            `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}`,
          ),
        ]);

        const importantJobs = ["Director", "Screenplay", "Producer", "Writer"];
        const filteredCrew = creditRes.crew.reduce((acc, member) => {
          if (importantJobs.includes(member.job)) {
            if (!acc[member.id])
              acc[member.id] = { name: member.name, jobs: [] };
            acc[member.id].jobs.push(member.job);
          }
          return acc;
        }, {});

        setMovie(movieRes);
        setCrew(filteredCrew);
        setRelatedMovies(relatedRes.results || []);
        setCredits(creditRes.cast || []);
        setBackdrops(backdropRes.backdrops || []);
        setKeywords(keywordsRes.keywords || []);
        setReviews(reviewsRes.results || []);

        const usRating =
          ratingRes.results.find((e) => e.iso_3166_1 === "US") ||
          ratingRes.results[0];
        setRating(
          usRating?.release_dates.find((r) => r.certification)?.certification ||
            "NR",
        );

        const imageUrl = `https://image.tmdb.org/t/p/w500/${movieRes.poster_path}?not-from-cache-please`;
        getDominantColor(imageUrl)
          .then((rgb) => {
            setBgColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
            setTextColor(getTextColorForBackground(rgb));
          })
          .catch(() => setBgColor("#141414"));

        const mainTrailer = trailerRes.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube",
        );
        if (mainTrailer)
          setTrailer(`https://www.youtube.com/embed/${mainTrailer.key}`);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id, apiKey]);

  const handleAddPlayList = (movieId) => {
    let playlist = getPlaylist();
    if (playlist.includes(movieId)) {
      playlist = playlist.filter((item) => item !== movieId);
      setHasMovie(false);
      toast.error("Removed from My List");
    } else {
      playlist.push(movieId);
      setHasMovie(true);
      toast.success("Added to My List");
    }
    localStorage.setItem("playlist", JSON.stringify(playlist));
  };

  const convertMinutesToTime = (m) =>
    m ? `${Math.floor(m / 60)}h ${m % 60}m` : "N/A";

  if (loading) return <Loader color={Bg} loading={true} size={40} />;
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <GoAlert className="mr-2" /> {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#141414] text-white overflow-x-hidden ">
      {/* Cinematic Hero Section */}
      <div className="relative w-full h-[70vh] lg:h-[90vh] flex items-end">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
            className="w-full h-full object-cover"
            alt={movie.title}
          />
          {/* Netflix Style Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-12 lg:pb-24 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-end">
          {/* Poster - Hidden on small mobile to focus on backdrop */}
          <div className="hidden lg:block transform hover:scale-105 transition-transform duration-500 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden border border-white/10">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className="w-full"
            />
          </div>

          <div className="space-y-6 max-w-3xl">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase italic">
                {movie.title}
              </h1>
              <div className="flex items-center gap-4 text-sm md:text-lg font-medium text-gray-300">
                <span className="text-green-400 font-bold">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                <span>{movie.release_date?.split("-")[0]}</span>
                <span className="px-1.5 py-0.5 border border-gray-500 text-[10px] rounded uppercase">
                  {rating}
                </span>
                <span>{convertMinutesToTime(movie.runtime)}</span>
              </div>
            </div>

            <p className="text-lg text-gray-200 line-clamp-3 md:line-clamp-none leading-relaxed font-light">
              {movie.overview}
            </p>

            {/* Premium Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 rounded-md font-bold flex items-center gap-2 text-lg">
                    <GoPlay className="text-2xl" /> Play Trailer
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-[#141414] border-none text-white h-[80vh]">
                  <DrawerHeader className="max-w-5xl mx-auto w-full">
                    <DrawerTitle className="text-2xl font-bold">
                      {movie.title} - Official Trailer
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="flex-1 w-full max-w-5xl mx-auto p-4 h-full">
                    {trailer ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`${trailer}?autoplay=1`}
                        allowFullScreen
                        className="rounded-xl shadow-2xl"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        No Trailer Found
                      </div>
                    )}
                  </div>
                  <DrawerFooter>
                    <DrawerClose />
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>

              <button
                onClick={() => handleAddPlayList(movie.id)}
                className="bg-gray-500/40 hover:bg-gray-500/60 transition-colors p-3.5 rounded-full backdrop-blur-md"
              >
                {hasMovie ? (
                  <GoHeartFill className="text-red-500 text-xl" />
                ) : (
                  <GoHeart className="text-white text-xl" />
                )}
              </button>

              <button
                onClick={() => setDialogOpen(true)}
                className="bg-gray-500/40 hover:bg-gray-500/60 transition-colors p-3.5 rounded-full backdrop-blur-md"
              >
                <GoDownload className="text-white text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 space-y-20 -mt-10 lg:-mt-20 relative z-20">
        {/* Cast Section */}
        <section>
          <MovieCategoryName title="Top Billed Cast" />
          <CastCarousel persons={credits} />
        </section>

        {/* Backdrops / Gallery */}
        <section>
          <MovieCategoryName title="Backdrops" />
          <BackdropCarousel backdrops={backdrops} />
        </section>

        {/* Reviews - Glassmorphism style */}
        {reviews.length > 0 && (
          <section>
            <MovieCategoryName title="Critical Response" />
            <ReviewSection reviews={reviews} Bg={Bg} />
          </section>
        )}

        {/* Grid-based Recommendations */}
        <section>
          <MovieCategoryName title="More Like This" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedMovies.slice(0, 12).map((m) => (
              <Card key={m.id} movie={m} />
            ))}
          </div>
        </section>

        {/* Bottom Details */}
        <div className="pb-20">
          <ExtraDetails
            movie={movie}
            Bg={Bg}
            textColor1={textColor1}
            movieKeywords={movieKeywords}
          />
        </div>
      </div>

      {/* Functional Dialog for "Bollyflix" Search */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#181818] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>External Search</DialogTitle>
            <DialogDescription className="text-gray-400">
              You are being redirected to Bollyflix to search for "{movie.title}
              ".
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                window.open(
                  `https://bollyflix.frl/search/${movie.title.replace(/ /g, "+")}`,
                  "_blank",
                );
                setDialogOpen(false);
              }}
            >
              Search Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-components with premium styling
function ReviewSection({ reviews, Bg }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={24}
      slidesPerView={1.2}
      breakpoints={{
        768: { slidesPerView: 2.2 },
        1024: { slidesPerView: 3.2 },
      }}
      className="pb-10"
    >
      {reviews.map((review) => (
        <SwiperSlide key={review.id}>
          <div className="h-64 p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex flex-col justify-between hover:border-white/30 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-lg">
                  {review.author[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold truncate w-40">
                    {review.author}
                  </h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-300 italic line-clamp-4 leading-relaxed">
                "{review.content}"
              </p>
            </div>
            <a
              href={review.url}
              target="_blank"
              className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
            >
              VIEW FULL REVIEW
            </a>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
