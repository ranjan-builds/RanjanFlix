import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// Icons
import { Search as SearchIcon, Loader2, Film, Calendar, X, Command } from "lucide-react";

// Shadcn UI Components (Make sure these paths match your project structure)
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button"; // <--- THIS WAS MISSING

export default function MovieSearch({ size = 20 }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_API_KEY;

  // --- Search Logic with Debounce ---
  React.useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      const validResults = (data.results || []).filter((m) => m.poster_path).slice(0, 6);
      setSuggestions(validResults);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectMovie = (movie) => {
    setOpen(false);
    setQuery("");
    navigate(`/movie/${movie.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      selectMovie(suggestions[focusedIndex]);
    }
  };

  // Shortcut logic (⌘J or Ctrl+J)
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all group"
      >
        <SearchIcon size={size} className="text-zinc-500 group-hover:text-zinc-300" />
        <span className="hidden md:inline text-sm text-zinc-500">Search...</span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded bg-zinc-800 px-1.5 font-mono text-[10px] text-zinc-500 border border-zinc-700">
          ⌘J
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
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
              placeholder="Search movies..."
              className="flex-1 h-12 border-none bg-transparent focus-visible:ring-0 text-base"
            />

            {query && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setQuery("")}
                className="h-8 w-8 p-0 rounded-full hover:bg-zinc-800"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </Button>
            )}

            <Badge variant="outline" className="ml-2 text-zinc-600 border-zinc-800 hidden sm:block">
              ESC
            </Badge>
          </div>

          <ScrollArea className={suggestions.length > 0 ? "max-h-[380px]" : "h-0"}>
            <div className="p-2 space-y-1">
              {suggestions.map((movie, index) => (
                <button
                  key={movie.id}
                  onClick={() => selectMovie(movie)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left ${
                    index === focusedIndex ? "bg-white/5 ring-1 ring-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    className="w-10 aspect-[2/3] object-cover rounded-md shadow-lg"
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{movie.title}</h4>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-zinc-500">
                      <span>{movie.release_date?.split("-")[0]}</span>
                      <span className="flex items-center text-yellow-500/80">
                        ★ {movie.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {index === focusedIndex && (
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <span>Select</span>
                      <kbd className="bg-zinc-800 px-1 rounded border border-zinc-700">↵</kbd>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>

          {!loading && suggestions.length === 0 && query.length > 0 && (
            <div className="py-12 text-center text-zinc-500">
              <p>No results found for "{query}"</p>
            </div>
          )}

          <div className="px-4 py-2 bg-zinc-900/30 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-600">
            <p className="uppercase tracking-widest font-bold">TMDB DATA</p>
            <div className="flex gap-3">
              <span className="flex items-center gap-1">
                <Command className="w-3 h-3" /> J to open
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}