import { useEffect, useState, useCallback } from "react";
import Card from "./Card";
import {
  GoHeart,
  GoHeartFill,
  GoShare,
  GoDownload,
  GoPlay,
  GoAlert,
} from "react-icons/go";
import "react-lazy-load-image-component/src/effects/blur.css";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getDominantColor } from "@/lib/Color";
import { getTextColorForBackground } from "@/lib/TextColor";
import MovieCategoryName from "./MovieCategoryName";
import { CastCarousel } from "./CastCarousel";
import { BackdropCarousel } from "./BackdropCarousel";
import ExtraDetails from "./ExtraDetails";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import movieRatings from "@/lib/Rating";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [credits, setCredits] = useState([]);
  const [crew, setCrew] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [movieKeywords, setKeywords] = useState([]);
  const [reviews, setReviews] = useState([]); // New state for reviews
  const [rating, setRating] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [Bg, setBgColor] = useState("");
  const [bgOpacity, setBgOpacity] = useState("");
  const [textColor1, setTextColor] = useState("white");
  const [hasMovie, setHasMovie] = useState(false);
  const [error, setError] = useState(null);
  const [percentage, setPercentage] = useState(100);
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const playlist = JSON.parse(localStorage.getItem("playlist")) || [];
    setHasMovie(playlist.includes(Number(id)));
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setPercentage(30);
      } else {
        setPercentage(100);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);

        const urls = [
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/images?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/keywords?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}`, // Added reviews URL
        ];

        const [
          movieRes,
          relatedRes,
          creditRes,
          trailerRes,
          backdropRes,
          keywordsRes,
          ratingRes,
          reviewsRes, // Added reviews result
        ] = await Promise.all(urls.map(fetchWithErrorHandling));

        if (movieRes.status_code === 34) {
          throw new Error("Movie not found");
        }

        const combineJobsById = (creditRes) => {
          const importantJobs = [
            "Director",
            "Screenplay",
            "Producer",
            "Writer",
            "Editor",
            "Story",
          ];
          return creditRes.reduce((acc, member) => {
            if (importantJobs.includes(member.job)) {
              if (acc[member.id]) {
                acc[member.id].jobs.push(member.job);
              } else {
                acc[member.id] = { name: member.name, jobs: [member.job] };
              }
            }
            return acc;
          }, {});
        };

        setCrew(combineJobsById(creditRes.crew));
        setMovie(movieRes);
        setRelatedMovies(relatedRes.results || []);
        setCredits(creditRes.cast || []);
        setBackdrops(backdropRes || []);
        setKeywords(keywordsRes.keywords || []);
        setReviews(reviewsRes.results || []); // Set reviews state

        const usRating = ratingRes.results.find(
          (entry) => entry.iso_3166_1 === movieRes.origin_country[0],
        );
        if (usRating) {
          const certification = usRating.release_dates.find(
            (release) => release.certification,
          );
          setRating(certification ? certification.certification : "NR");
        } else {
          setRating("NR");
        }

        const imageUrl = `https://image.tmdb.org/t/p/w500/${movieRes.poster_path}?not-from-cache-please`;
        try {
          const rgb = await getDominantColor(imageUrl);
          setBgColor(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
          setBgOpacity(`rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.7)`);
          setTextColor(getTextColorForBackground(rgb));
        } catch (colorError) {
          console.error("Error fetching dominant color:", colorError);
        }

        const trailers = trailerRes.results.filter(
          (video) => video.type === "Trailer" && video.site === "YouTube",
        );
        if (trailers.length > 0)
          setTrailer(`https://www.youtube.com/embed/${trailers[0].key}`);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie data:", error);
        toast.error(error.message || "An error occurred while fetching data");
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, apiKey]);

  const fetchWithErrorHandling = async (url) => {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Bhai Kuch Nahi Hai esme: ${response.status}`);
    return await response.json();
  };

  const handleConfirm = () => {
    if (movie?.title) {
      setDialogOpen(false);
      window.open(
        `https://bollyflix.frl/search/${movie.title.replace(/ /g, "+")}`,
        "_blank",
      );
    }
  };
  const handleCancel = () => setDialogOpen(false);
  const handleShare = async () => {
    if (!movie) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: movie.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.info("URL copied!");
      }
    } catch (e) {}
  };

  const handleAddPlayList = (id) => {
    const playlist = JSON.parse(localStorage.getItem("playlist")) || [];
    const index = playlist.indexOf(id);
    if (index !== -1) {
      playlist.splice(index, 1);
      setHasMovie(false);
    } else {
      playlist.push(id);
      setHasMovie(true);
    }
    localStorage.setItem("playlist", JSON.stringify(playlist));
  };

  const convertMinutesToTime = (m) => `${Math.floor(m / 60)}h ${m % 60}m`;

  // Function to truncate review text
  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) return <Loader color={Bg || "gray"} loading={true} size={20} />;
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <GoAlert /> {error}
      </div>
    );

  return (
    <>
      {/* Existing Mobile Backdrop UI */}
      <div
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: `${textColor1}`,
        }}
        className="relative flex items-center justify-start w-full p-4 aspect-video z-20 lg:hidden"
      >
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(to right, ${Bg} 30%, transparent)`,
          }}
        ></div>
        <img
          className="w-1/3 z-20 relative rounded-md"
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt={movie.title}
        />
      </div>

      {/* Existing Main Info Grid UI */}
      <div
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
          backgroundSize: "cover",
          color: `${textColor1}`,
        }}
        className="relative grid grid-cols-1 lg:grid-cols-[300px_auto] gap-5 p-5 lg:py-8"
      >
        <div className="relative flex justify-start items-start rounded-lg bg-cover bg-center shadow-md">
          <img
            className="hidden lg:block relative z-10 lg:w-full h-auto rounded-lg"
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
          />
        </div>

        <div className="relative z-10 flex flex-col gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            {movie.title} ({movie.release_date.split("-")[0]})
          </h1>
          <p className="text-sm lg:text-base">
            <span className="px-1 border-black border border-opacity-10 bg-black bg-opacity-5 mr-1">
              <Popover>
                <PopoverTrigger>{rating}</PopoverTrigger>
                <PopoverContent>{movieRatings[rating] || "N/R"}</PopoverContent>
              </Popover>
            </span>
            {movie.original_language.toUpperCase()} |{" "}
            {movie.genres.map((genre) => genre.name).join(", ")} |{" "}
            {convertMinutesToTime(movie.runtime)}
          </p>

          {movie.belongs_to_collection && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Part of:</span>
              <NavLink
                to={`/collection/${movie.belongs_to_collection.id}`}
                className="px-3 py-1 rounded-full bg-black bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                {movie.belongs_to_collection.name}
              </NavLink>
            </div>
          )}

          <div className="my-1 flex items-center gap-2">
            <div
              style={{ background: textColor1, color: Bg }}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => setDialogOpen(true)}
            >
              <GoDownload />
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Redirect</DialogTitle>
                  <DialogDescription>
                    You are about to leave this website...
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-end mt-5 gap-2">
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleConfirm}>Confirm</Button>
                </div>
              </DialogContent>
            </Dialog>
            <div
              onClick={() => handleAddPlayList(movie.id)}
              style={{ background: textColor1, color: Bg }}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            >
              {hasMovie ? <GoHeartFill /> : <GoHeart />}
            </div>
            <div
              style={{ background: textColor1, color: Bg }}
              onClick={handleShare}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            >
              <GoShare />
            </div>
            <div
              style={{ background: textColor1, color: Bg }}
              className="h-10 px-4 gap-2 rounded-full flex items-center justify-center cursor-pointer"
            >
              <Drawer>
                <DrawerTrigger
                  className="flex items-center gap-2"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <GoPlay /> Play Trailer
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Watch Trailer</DrawerTitle>
                  </DrawerHeader>
                  {isDrawerOpen && trailer ? (
                    <iframe
                      width="100%"
                      height="315"
                      src={`${trailer}?autoplay=1`}
                      title="Trailer"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <p>Trailer not available.</p>
                  )}
                  <DrawerFooter>
                    <DrawerClose onClick={() => setIsDrawerOpen(false)} />
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
          <p className="text-sm lg:text-base italic">{movie.tagline}</p>
          <p className="font-semibold text-xl">Overview</p>
          <p className="text-base lg:text-lg leading-relaxed">
            {movie.overview}
          </p>
          <div>
            <span
              style={{ background: textColor1, color: Bg }}
              className="py-2 px-5 rounded-r-full text-sm"
            >
              IMDb |{" "}
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
          </div>

          <div className="flex flex-wrap items-start gap-y-1 py-4 px-2 mt-2 rounded-lg backdrop-blur-lg bg-black bg-opacity-5">
            {Object.entries(crew).map(([id, { name, jobs }]) => (
              <div
                key={id}
                className="flex flex-col items-start text-start w-1/2 lg:w-1/3 xl:w-1/4"
              >
                <NavLink to={`/person/${id}`}>
                  <span className="text-md font-semibold">{name}</span>
                </NavLink>
                <span className="text-xs">{jobs.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: `linear-gradient(to right, ${Bg} ${percentage}%, ${bgOpacity})`,
          }}
          className="bgOpacity absolute inset-0 w-full h-full -z-5"
        ></div>
      </div>

      {/* Existing Backdrop Carousel */}
      <div className="px-5">
        <MovieCategoryName title={"Backdrops"} />
        <BackdropCarousel backdrops={backdrops} />
      </div>

      {/* Existing Cast Carousel */}
      <div className="px-5">
        {credits.length > 0 && <MovieCategoryName title={"Top Billed Cast"} />}
        <CastCarousel persons={credits} />
      </div>

      {/* Existing Recommendations */}
      <div className="px-5">
        {relatedMovies.length > 0 && (
          <MovieCategoryName title={"Recommendations"} />
        )}
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 text-white">
          {relatedMovies.map((m) => (
            <Card key={m.id} movie={m} />
          ))}
        </div>
      </div>

      {/* NEW: Movie Reviews Section with Swiper Cards */}
      {reviews.length > 0 && (
        <div className="px-5 mt-10">
          <MovieCategoryName title={"User Reviews"} />
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="review-swiper pb-12"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div
                  className="h-full p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex flex-col"
                  style={{
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold uppercase text-lg shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${Bg} 0%, ${bgOpacity} 100%)`,
                      }}
                    >
                      {review.author[0]}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-base">
                        {review.author}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                        {review.author_details?.rating && (
                          <span className="text-xs text-yellow-500">
                            ★ {review.author_details.rating}/10
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 leading-relaxed italic line-clamp-6">
                      "{truncateText(review.content, 250)}"
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    {review.content.length > 250 && (
                      <a
                        href={review.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                      >
                        Read full review
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span>Helpful</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      
      {reviews.length === 0 && !loading && (
        <div className="px-5 mt-10">
          <MovieCategoryName title={"User Reviews"} />
          <p className="text-gray-500 italic text-sm text-center py-8">
            No reviews found for this movie.
          </p>
        </div>
      )}

      {/* Existing Extra Details */}
      <ExtraDetails
        movie={movie}
        Bg={Bg}
        textColor1={textColor1}
        movieKeywords={movieKeywords}
      />

      {/* Add custom CSS for Swiper styling */}
   
    </>
  );
}