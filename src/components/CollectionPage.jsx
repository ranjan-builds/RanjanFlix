import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronLeft,
  Play,
  Clock,
  Calendar,
  Star,
  Film,
  ListOrdered,
  AlertTriangle,
  Loader2,
  Info,
} from "lucide-react";

// UI Components
import Card from "./Card";
import Loader from "./Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const CollectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_API_KEY;

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);

  // --- Data Fetching ---
  const fetchCollection = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://api.themoviedb.org/3/collection/${id}?api_key=${apiKey}`,
      );

      if (!res.ok) throw new Error("Franchise data unavailable.");
      const data = await res.json();

      // Sort movies by release date immediately
      if (data.parts) {
        data.parts.sort(
          (a, b) =>
            new Date(a.release_date || "9999") -
            new Date(b.release_date || "9999"),
        );
      }

      setCollection(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, apiKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCollection();
  }, [fetchCollection]);

  // --- Trailer Logic ---
  const handlePlayTrailer = async (movie) => {
    setIsDrawerOpen(true);
    setTrailerLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`,
      );
      const data = await res.json();
      const trailer = data.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube",
      );
      setSelectedTrailer(
        trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
      );
    } catch (e) {
      setSelectedTrailer(null);
    } finally {
      setTrailerLoading(false);
    }
  };

  // --- Calculations (Memoized) ---
  const stats = useMemo(() => {
    if (!collection?.parts) return null;
    const movies = collection.parts;
    const totalRating = movies.reduce(
      (sum, m) => sum + (m.vote_average || 0),
      0,
    );
    const firstYear = movies[0]?.release_date?.split("-")[0] || "TBA";
    const lastYear =
      movies[movies.length - 1]?.release_date?.split("-")[0] || "TBA";

    return {
      count: movies.length,
      avg: (totalRating / movies.length).toFixed(1),
      timeline:
        firstYear === lastYear ? firstYear : `${firstYear} — ${lastYear}`,
    };
  }, [collection]);

  if (loading) return <Loader loading={true} size={40} />;

  if (error || !collection)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] text-zinc-500 gap-4">
        <AlertTriangle size={48} className="text-red-500/50" />
        <p className="text-xl font-medium">{error || "Collection not found"}</p>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="rounded-full border-zinc-800"
        >
          <ChevronLeft size={16} className="mr-2" /> Back to Safety
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      {/* Immersive Hero Header */}
      <section className="relative w-full overflow-hidden pt-20 pb-12 lg:pt-32 lg:pb-24">
        {/* Dynamic Background Blur */}
        <div
          className="absolute inset-0 z-0 opacity-30 scale-110 blur-[100px]"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w780${collection.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-center">
            {/* Poster with Shadow */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block group"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 group-hover:border-purple-500/30 transition-colors">
                <img
                  src={`https://image.tmdb.org/t/p/w500${collection.poster_path}`}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </motion.div>

            {/* Collection Identity */}
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Badge
                  variant="outline"
                  className="mb-4 border-purple-500/30 text-purple-400 bg-purple-500/5 px-4 py-1 rounded-full"
                >
                  <Film size={12} className="mr-2" /> Cinematic Universe
                </Badge>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent uppercase italic">
                  {collection.name}
                </h1>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mt-4 mx-auto lg:mx-0">
                  {collection.overview}
                </p>
              </motion.div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <Button
                  onClick={() => handlePlayTrailer(collection.parts[0])}
                  className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 h-12 font-bold shadow-xl transition-transform hover:scale-105 active:scale-95"
                >
                  <Play size={18} className="mr-2 fill-current" /> Watch First
                  Trailer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="rounded-full border-zinc-800 bg-zinc-900/50 backdrop-blur-md h-12 px-6"
                >
                  <ChevronLeft size={18} className="mr-2" /> Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Franchise Dashboard */}
      <main className="container mx-auto px-6 py-12">
        {/* Premium Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <StatBox
            icon={<ListOrdered className="text-blue-400" />}
            label="Total Titles"
            value={stats.count}
          />
          <StatBox
            icon={<Star className="text-yellow-500" />}
            label="Franchise Avg"
            value={stats.avg}
          />
          <StatBox
            icon={<Calendar className="text-purple-400" />}
            label="Timeline"
            value={stats.timeline}
          />
          <StatBox
            icon={<Info className="text-zinc-400" />}
            label="Status"
            value="Complete"
          />
        </div>

        {/* The Grid Section */}
        <div className="space-y-10">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
            <h2 className="text-3xl font-black tracking-tight uppercase italic flex items-center gap-3">
              <Film className="text-purple-600" /> Chronological Order
            </h2>
            <p className="text-zinc-600 text-sm hidden sm:block">
              Explore the journey from start to finish
            </p>
          </div>

          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            <AnimatePresence>
              {collection.parts.map((movie, idx) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card movie={movie} />
                  <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 text-center">
                    Phase {idx + 1}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Trailer Drawer - Polished */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-zinc-950 border-zinc-800 h-[85vh]">
          <div className="mx-auto w-full max-w-5xl h-full flex flex-col p-6">
            <DrawerHeader className="px-0">
              <div className="flex justify-between items-center">
                <div>
                  <DrawerTitle className="text-white text-2xl font-black">
                    Universe Preview
                  </DrawerTitle>
                  <DrawerDescription className="text-zinc-500">
                    Official Franchise Trailer
                  </DrawerDescription>
                </div>
                <DrawerClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-zinc-900 border border-zinc-800"
                  >
                    <ChevronLeft className="rotate-90" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>

            <div className="flex-1 flex items-center justify-center py-6">
              <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5 relative">
                {trailerLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <Loader2
                      className="animate-spin text-purple-600"
                      size={32}
                    />
                    <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                      Opening Portal...
                    </span>
                  </div>
                ) : selectedTrailer ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`${selectedTrailer}?autoplay=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-3 opacity-30">
                    <AlertTriangle size={48} />
                    <p>Trailer link corrupted or missing.</p>
                  </div>
                )}
              </div>
            </div>
            <p className="text-center text-zinc-700 text-[10px] font-bold uppercase tracking-[0.4em] py-4">
              RFLIX Cinematic Archive
            </p>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

// --- Sub-component: StatBox ---
const StatBox = ({ icon, label, value }) => (
  <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-xl p-5 rounded-2xl flex items-center gap-4 transition-all hover:bg-zinc-900/60 hover:border-purple-500/20 group">
    <div className="p-3 bg-black rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
        {label}
      </p>
      <p className="text-xl font-bold text-white tracking-tight">{value}</p>
    </div>
  </div>
);

export default CollectionPage;
