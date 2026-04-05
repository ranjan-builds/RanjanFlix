import * as React from "react";
import { useNavigate } from "react-router-dom";
// Icons
import {
  Search as SearchIcon,
  Loader2,
  Film,
  X,
  Command,
  CornerDownLeft,
} from "lucide-react";

// Shadcn UI Components
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function MovieSearch({ size = 20 }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_API_KEY;

  // --- Keyboard Shortcut (⌘K or Ctrl+K) ---
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // --- Search Logic with AbortController ---
  const performSearch = React.useCallback(
    async (searchQuery, signal) => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
            searchQuery,
          )}`,
          { signal },
        );
        const data = await response.json();
        // Only show movies that have posters
        const validResults = (data.results || [])
          .filter((m) => m.poster_path)
          .slice(0, 6);
        setSuggestions(validResults);
        setFocusedIndex(-1); // Reset focus on new results
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Search fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    },
    [apiKey],
  );

  React.useEffect(() => {
    const controller = new AbortController();

    if (!query) {
      setSuggestions([]);
      setLoading(false);
    } else {
      const timeoutId = setTimeout(() => {
        performSearch(query, controller.signal);
      }, 300);
      return () => {
        clearTimeout(timeoutId);
        controller.abort();
      };
    }
  }, [query, performSearch]);

  const selectMovie = (movie) => {
    if (!movie) return;
    setOpen(false);
    setQuery("");
    navigate(`/movie/${movie.id}`);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (focusedIndex >= 0) {
        selectMovie(suggestions[focusedIndex]);
      } else if (suggestions.length > 0) {
        selectMovie(suggestions[0]); // Default to first result
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all group"
        aria-label="Search Movies"
      >
        <SearchIcon
          size={size}
          className="text-zinc-500 group-hover:text-zinc-300 transition-colors"
        />
        <span className="hidden md:inline text-sm text-zinc-500">
          Search movies...
        </span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded bg-zinc-800 px-1.5 font-mono text-[10px] text-zinc-500 border border-zinc-700">
          <Command size={10} />K
        </kbd>
      </button>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setQuery(""); // Clear on close
        }}
      >
        <DialogContent className="p-0 border-zinc-800 bg-zinc-950/95 backdrop-blur-xl max-w-2xl overflow-hidden shadow-2xl [&>button]:hidden">
          <DialogTitle className="sr-only">Search Movies</DialogTitle>

          <div className="flex items-center px-4 py-2 border-b border-zinc-800">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
            ) : (
              <SearchIcon className="w-5 h-5 text-zinc-400" />
            )}

            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type to search movies..."
              className="flex-1 h-14 border-none bg-transparent focus-visible:ring-0 text-lg placeholder:text-zinc-600"
            />

            <div className="flex items-center gap-2">
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery("")}
                  className="h-8 w-8 p-0 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <Badge
                variant="outline"
                className="text-zinc-600 border-zinc-800 hidden sm:block font-mono"
              >
                ESC
              </Badge>
            </div>
          </div>

          <ScrollArea
            className={`${suggestions.length > 0 ? "max-h-[400px]" : "h-0"} transition-all`}
          >
            <div className="p-2 space-y-1">
              {suggestions.map((movie, index) => (
                <button
                  key={movie.id}
                  onClick={() => selectMovie(movie)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group ${
                    index === focusedIndex
                      ? "bg-purple-500/10 ring-1 ring-purple-500/20"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="relative w-12 aspect-[2/3] flex-shrink-0 overflow-hidden rounded-md shadow-md bg-zinc-900">
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-medium text-sm truncate ${index === focusedIndex ? "text-purple-100" : "text-zinc-200"}`}
                    >
                      {movie.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Film size={10} />
                        {movie.release_date?.split("-")[0] || "N/A"}
                      </span>
                      <span className="flex items-center text-yellow-500/80 font-medium">
                        ★ {movie.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {index === focusedIndex && (
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-purple-400 font-medium animate-in fade-in slide-in-from-right-2">
                      <span>Select</span>
                      <CornerDownLeft size={12} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* Empty State */}
          {!loading && suggestions.length === 0 && query.trim().length > 0 && (
            <div className="py-20 text-center animate-in fade-in zoom-in-95">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 mb-4">
                <SearchIcon className="w-6 h-6 text-zinc-700" />
              </div>
              <p className="text-zinc-500 text-sm">
                No movies found for{" "}
                <span className="text-zinc-300">"{query}"</span>
              </p>
            </div>
          )}

          {/* Footer UI */}
          <div className="px-4 py-3 bg-zinc-900/30 border-t border-zinc-900/50 flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 font-mono text-[9px]">
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 font-mono text-[9px]">
                  ENTER
                </kbd>
                Select
              </span>
            </div>
            <span className="flex items-center gap-1">
              Data by <span className="text-zinc-300">TMDB</span>
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
