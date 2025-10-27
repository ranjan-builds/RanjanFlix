import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GoSearch } from "react-icons/go";

export default function Search({size}) {
  const [open, setOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const apiKey = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate(); // Navigate hook

  // Fetch movies with the fetch API
  const fetchMovies = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        toast("Something went wrong", { type: "error" });
        return;
      }

      const data = await response.json();
      // Filter out movies without images
      const moviesWithImages = (data.results || []).filter(
        (movie) => movie.poster_path
      );
      setSuggestions(moviesWithImages);
    } catch (error) {
      toast("Failed to fetch", {
        type: "error",
        description: error.message,
      });
      console.error("Error fetching movies:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    fetchMovies(newQuery);
  };

  // Handle keyboard navigation and selection
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      const selectedMovie = suggestions[focusedIndex];
      if (selectedMovie) {
        console.log("Selected movie:", selectedMovie.title);
        navigate(`/movie/${selectedMovie.id}`); // Navigate to the selected movie
        setOpen(false); // Close dialog on selection
      }
    }
  };

  // Keyboard shortcut to toggle dialog
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Dialog with Trigger Inside */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="cursor-pointer"
            onClick={() => setOpen(true)}
            
          >
           <GoSearch size={size}/>
          </div>
        </DialogTrigger>

        {/* Autocomplete Dialog */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Movie Search</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Type a movie name..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full mt-2 mb-2"
          />

          {suggestions.length === 0 ? (
            <p className="text-center text-gray-500">No results found.</p>
          ) : (
            <div className="mt-2 max-h-64 overflow-y-auto">
              {suggestions.map((movie, index) => {
                const posterUrl = `https://image.tmdb.org/t/p/w92${movie.poster_path}`;
                const releaseYear = movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "N/A";

                const isFocused = index === focusedIndex;

                return (
                  <NavLink
                    to={`/movie/${movie.id}`}
                    key={movie.id}
                    className={`p-1 mt-1 flex items-center rounded-md ${
                      isFocused ? "bg-zinc-800" : "hover:bg-zinc-800"
                    }`}
                    onClick={() => {
                      console.log("Selected movie:", movie.title);
                      setOpen(false); // Close dialog on selection
                    }}
                  >
                    <img
                      src={posterUrl}
                      alt={movie.title}
                      className="w-12 h-18 object-cover rounded-md mr-2"
                    />
                    <div>
                      <p className="text-sm">{movie.title}</p>
                      <p className="text-xs text-gray-500">{releaseYear}</p>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
