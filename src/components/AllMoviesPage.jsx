import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import Card from "./Card";
import MovieCategoryName from "./MovieCategoryName";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loader from "./Loader";

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { url } = useParams();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageUrl, setPageUrl] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  const apiKey = import.meta.env.VITE_API_KEY;

  function getFormattedDate() {
    const date = new Date(); 
    const year = date.getFullYear(); 
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`; 
  }

  const endpoints = [
  
    {
      key: "Movies Near You",
      url: `/discover/movie?api_key=${apiKey}&sort_by=release_date.desc&with_original_language=hi&region=IN&release_date.lte=${getFormattedDate()}`,
    },

    {
      key: "Tamil Action Movies",
      url: `/discover/movie?api_key=${apiKey}&sort_by=revenue.desc&with_original_language=te&with_genres=28}`,
    },
    {
      key: "Popular Hindi Movies",
      url: `/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&with_original_language=hi&region=IN`,
    },
    {
      key: "Sci-Fi Movies",
      url: `/discover/movie?api_key=${apiKey}&sort_by=revenue.desc&with_genres=878`,
    },
    {
      key: "Trending Movies Today",
      url: `/trending/movie/day?api_key=${apiKey}`,
    },
    {
      key: "Most Popular Movies",
      url: `/movie/popular?api_key=${apiKey}`,
    },
    {
      key: "Top Rated Movies Globally",
      url: `/movie/top_rated?api_key=${apiKey}`,
    },
    {
      key: "Upcoming Movie Releases",
      url: `/movie/upcoming?api_key=${apiKey}`,
    },
  ];
  // Dynamically fetch the URL for the selected endpoint
  const getLinkTo = () => {
    const endpoint = endpoints.find((e) => e.key === url);
    return endpoint
      ? endpoint.url
      : `/movies/${url.toLowerCase().replace(/\s+/g, "-")}`;
  };

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3${pageUrl}&page=${page}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      setError(err.message);
      toast(err.message,{type:"error"});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const link = getLinkTo();
    if (link) {
      setPageUrl(link);
    }
  }, [url, year]); // Include year in dependency to recalculate URLs when it changes

  useEffect(() => {
    if (pageUrl) {
      fetchMovies();
    }
  }, [pageUrl, page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      searchParams.set("page", newPage);
      setSearchParams(searchParams);
    }
  };

  return (
    <div className="p-4">
      {loading && <Loader color={"gray"} loading={true} size={20} />}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <MovieCategoryName title={url} />
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 text-white">
        {movies.length > 0
          ? movies.map((movie) => <Card key={movie.id} movie={movie} />)
          : !loading && <p>No movies found.</p>}
      </div>

      <div style={{ marginTop: "20px" }}>
        <Pagination>
          <PaginationPrevious
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
            style={{cursor:'pointer'}}
          >
            Previous
          </PaginationPrevious>
          <PaginationContent>
            {page} /{" "}
            <div
              onClick={() => handlePageChange(totalPages)}
              style={{ cursor: "pointer" }}
              title="Go to the last page"
            >
              {totalPages}
            </div>
          </PaginationContent>
          <PaginationNext
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || loading}
            style={{cursor:'pointer'}}
          >
            Next
          </PaginationNext>
        </Pagination>
      </div>
    </div>
  );
};

export default MoviesPage;
