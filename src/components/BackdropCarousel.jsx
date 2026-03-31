"use client";
import React, { useState, useMemo } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";

const INITIAL_COUNT = 6;
const LOAD_STEP = 6;

export function BackdropCarousel({ backdrops }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const backdropList = backdrops?.backdrops || [];

  const visibleBackdrops = useMemo(
    () => backdropList.slice(0, visibleCount),
    [backdropList, visibleCount]
  );

  const hasMore = visibleCount < backdropList.length;

  if (!backdropList.length) return null;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_STEP, backdropList.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <div className="w-full">
      {/* Grid - NO GAPS - negative margins to remove any spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 -m-0.5">
        {visibleBackdrops.map((backdrop, index) => {
          const imageUrl = `https://image.tmdb.org/t/p/w780/${backdrop.file_path}`;

          return (
            <div
              key={backdrop.file_path || index}
              className="group relative overflow-hidden transition-all duration-500 m-0 p-0"
            >
              <img
                src={imageUrl}
                alt={`Backdrop ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="aspect-video w-full object-cover transition duration-500 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/780x439?text=No+Image";
                }}
              />

              {/* Overlay - Clean gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Show index on hover */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Buttons - Compact */}
      {backdropList.length > INITIAL_COUNT && (
        <div className="flex justify-center gap-3 mt-6">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              className="px-5 py-2 bg-white text-black font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm"
            >
              Load More ({visibleCount} / {backdropList.length})
            </button>
          ) : (
            <button
              onClick={handleShowLess}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:scale-105 text-sm"
            >
              Show Less
            </button>
          )}
        </div>
      )}

      {/* Footer - Minimal */}
      <p className="text-center text-xs text-gray-500 mt-4">
        {backdropList.length} backdrops
      </p>
    </div>
  );
}
