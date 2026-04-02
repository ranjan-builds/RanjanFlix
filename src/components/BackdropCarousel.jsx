"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle 
} from "@/components/ui/dialog";

const INITIAL_COUNT = 6;
const LOAD_STEP = 6;

export function BackdropCarousel({ backdrops }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Handle various TMDB data formats
  const backdropList = useMemo(() => {
    if (Array.isArray(backdrops)) return backdrops;
    return backdrops?.backdrops || [];
  }, [backdrops]);

  const visibleBackdrops = useMemo(
    () => backdropList.slice(0, visibleCount),
    [backdropList, visibleCount]
  );

  const hasMore = visibleCount < backdropList.length;

  // --- Handlers ---
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_STEP, backdropList.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
    window.scrollTo({ top: window.scrollY - 300, behavior: "smooth" });
  };

  const navigateLightbox = (direction) => {
    if (direction === "next") {
      setSelectedIndex((prev) => (prev + 1) % backdropList.length);
    } else {
      setSelectedIndex((prev) => (prev - 1 + backdropList.length) % backdropList.length);
    }
  };

  if (!backdropList.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
        <ImageIcon className="w-10 h-10 text-zinc-700 mb-2" />
        <p className="text-zinc-500 text-sm font-medium">Gallery currently unavailable</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10">
      {/* 1. Main Gallery Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {visibleBackdrops.map((backdrop, index) => (
            <motion.div
              layout
              key={backdrop.file_path || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="group relative aspect-video overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w780${backdrop.file_path}`}
                alt="Movie Frame"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                loading="lazy"
              />

              {/* Hover State Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className="p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
                >
                  <Maximize2 className="w-6 h-6 text-white" />
                </motion.div>
              </div>

              {/* Index Badge */}
              <div className="absolute top-4 left-4">
                 <div className="px-2 py-1 rounded bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Frame {index + 1}</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 2. Cinematic Lightbox (Modal) */}
      <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        {/* [&>button]:hidden removes the redundant Shadcn Close Icon */}
        <DialogContent className="max-w-[100vw] w-full h-[100vh] p-0 border-none bg-black/95 backdrop-blur-3xl flex items-center justify-center overflow-hidden [&>button]:hidden">
          <DialogTitle className="sr-only">Cinematic Preview</DialogTitle>
          
          {/* Custom Navigation & Controls Container */}
          <div className="absolute inset-0 pointer-events-none z-50">
            {/* Close Button */}
            <div className="absolute top-8 right-8 pointer-events-auto">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-12 w-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md"
                onClick={() => setSelectedIndex(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Prev/Next Buttons */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between">
              <Button 
                variant="ghost" size="icon" 
                className="pointer-events-auto rounded-full h-16 w-16 bg-black/40 hover:bg-black/60 text-white border border-white/5 backdrop-blur-xl transition-all active:scale-90"
                onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
              >
                <ChevronLeft className="w-10 h-10" />
              </Button>
              <Button 
                variant="ghost" size="icon" 
                className="pointer-events-auto rounded-full h-16 w-16 bg-black/40 hover:bg-black/60 text-white border border-white/5 backdrop-blur-xl transition-all active:scale-90"
                onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
              >
                <ChevronRight className="w-10 h-10" />
              </Button>
            </div>

            {/* Counter Badge */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto">
              <div className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center gap-4">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Cinematic Frame</span>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-sm font-mono font-bold text-white leading-none">
                  {selectedIndex + 1} <span className="mx-1 opacity-20">/</span> {backdropList.length}
                </span>
              </div>
            </div>
          </div>

          {/* High-Resolution Image Stage */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                // Fetching 'original' for the lightbox
                src={`https://image.tmdb.org/t/p/original${backdropList[selectedIndex]?.file_path}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-[0_0_80px_rgba(0,0,0,0.8)]"
              />
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Load More / Pagination */}
      {backdropList.length > INITIAL_COUNT && (
        <div className="flex flex-col items-center gap-6 pt-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          
          <div className="flex gap-4">
            {hasMore ? (
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="rounded-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white px-10 h-14 transition-all group"
              >
                <ChevronDown className="w-5 h-5 mr-2 group-hover:translate-y-1 transition-transform" />
                Explore More Frames
              </Button>
            ) : (
              <Button
                onClick={handleShowLess}
                variant="ghost"
                className="rounded-full text-zinc-500 hover:text-white hover:bg-zinc-900 px-10 h-14 transition-all"
              >
                <ChevronUp className="w-5 h-5 mr-2" />
                Collapse Gallery
              </Button>
            )}
          </div>
          
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-700">
            {backdropList.length} High-Definition Visuals
          </p>
        </div>
      )}
    </div>
  );
}