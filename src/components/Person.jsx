import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "./Carousel";
import MovieCategoryName from "./MovieCategoryName";
import { MdArrowBack, MdCalendarToday, MdLocationOn, MdPerson } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const Person = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [combined, setCombined] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  const apiKey = import.meta.env.VITE_API_KEY;

  const calculateAge = (birthDate, deathDate = null) => {
    const birthDateObj = new Date(birthDate);
    const endDate = deathDate ? new Date(deathDate) : new Date();
    let age = endDate.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = endDate.getMonth() - birthDateObj.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && endDate.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const [personRes, combinedRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`),
          fetch(
            `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}`
          ),
        ]);

        if (!personRes.ok || !combinedRes.ok) {
          throw new Error('Failed to fetch person data');
        }

        const personData = await personRes.json();
        const combinedData = await combinedRes.json();
        
        setPerson(personData);
        setCombined(combinedData.cast || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, apiKey]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
        <Loader color={"#ffffff"} loading={true} size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
        <div className="text-center p-8 bg-zinc-800 rounded-lg max-w-md mx-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={goBack}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors mx-auto"
          >
            <MdArrowBack />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
        <div className="text-center p-8 bg-zinc-800 rounded-lg">
          <div className="text-gray-400 text-6xl mb-4">❓</div>
          <h2 className="text-xl font-bold text-white mb-2">No Data Available</h2>
          <p className="text-gray-300 mb-4">Could not find information for this person.</p>
          <button
            onClick={goBack}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors mx-auto"
          >
            <MdArrowBack />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      {/* Header Section */}
      <div className="relative">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={goBack}
            className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/20 hover:border-white/40"
          >
            <MdArrowBack className="text-xl" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Person Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 mb-12">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm relative group">
              {person.profile_path && !imageError ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                  alt={person.name}
                  className="w-full h-auto rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl">
                  <MdPerson className="text-6xl text-zinc-600" />
                </div>
              )}
            </div>
          </div>

          {/* Person Details */}
          <div className="flex flex-col gap-6">
            {/* Name and Basic Info */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {person.name}
              </h1>
              
              {/* Personal Information Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Birth Information */}
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-3 text-blue-400 mb-2">
                    <MdCalendarToday className="text-lg" />
                    <span className="font-semibold">Born</span>
                  </div>
                  <p className="text-white text-sm">
                    {formatDate(person.birthday)}
                    {person.birthday && (
                      <span className="text-gray-400 ml-2">
                        ({calculateAge(person.birthday)} years old)
                      </span>
                    )}
                  </p>
                  {person.place_of_birth && (
                    <div className="flex items-center gap-2 mt-2 text-gray-300">
                      <MdLocationOn className="text-sm" />
                      <span className="text-sm">{person.place_of_birth}</span>
                    </div>
                  )}
                </div>

                {/* Death Information (if applicable) */}
                {person.deathday && (
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                    <div className="flex items-center gap-3 text-red-400 mb-2">
                      <MdCalendarToday className="text-lg" />
                      <span className="font-semibold">Died</span>
                    </div>
                    <p className="text-white text-sm">
                      {formatDate(person.deathday)}
                      <span className="text-gray-400 ml-2">
                        (Age {calculateAge(person.birthday, person.deathday)})
                      </span>
                    </p>
                  </div>
                )}

                {/* Known For */}
                {person.known_for_department && (
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                    <div className="flex items-center gap-3 text-green-400 mb-2">
                      <MdPerson className="text-lg" />
                      <span className="font-semibold">Known For</span>
                    </div>
                    <p className="text-white text-sm">{person.known_for_department}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Biography</h2>
              <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/30">
                {person.biography ? (
                  <div className="max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                    <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                      {person.biography}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-lg">
                    No biography available for {person.name}.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Known For Section */}
        {combined.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <MovieCategoryName title={`Known For (${combined.length})`} />
            </div>
            <Carousel movies={combined} />
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Person;