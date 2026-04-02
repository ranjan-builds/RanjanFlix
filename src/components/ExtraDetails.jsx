import React from "react";
import { 
  ExternalLink, 
  Wallet, 
  TrendingUp, 
  Activity, 
  Globe, 
  Flag, 
  Tag, 
  Download 
} from "lucide-react";
import { motion } from "framer-motion";

const ExtraDetails = ({ movie, Bg, textColor1, movieKeywords }) => {
  
  const handleRedirect = (server) => {
    const formattedTitle = movie.title.replace(/ /g, "+");
    let url = "";

    switch(server) {
      case 1: url = `https://bollyflix.frl/search/${formattedTitle}`; break;
      case 2: url = `https://www.filmyfly.durban/site-1.html?to-search=${formattedTitle}`; break;
      case 3: 
        const searchQuery = `${movie.title} site:filmyzilla.com.by`;
        url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        break;
      default: break;
    }
    window.open(url, "_blank");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // TMDB data is usually in USD; changed to US for global context
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ background: `linear-gradient(to bottom, transparent, ${Bg})`, color: textColor1 }}
      className="p-6 md:p-12 mt-12 rounded-3xl border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="border-b border-current/10 pb-8">
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-2">
            {movie.title === movie.original_title
              ? movie.title
              : `${movie.title} (${movie.original_title})`}
          </h2>
          <div className="flex items-center gap-4 opacity-60 font-medium">
            <span className="flex items-center gap-2"><Activity size={16} /> {movie.status}</span>
            <span>•</span>
            <span>{movie.release_date}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <InfoBlock 
            icon={<Wallet size={20} />} 
            label="Production Budget" 
            value={movie.budget ? formatCurrency(movie.budget) : "Undisclosed"} 
          />
          
          <InfoBlock 
            icon={<TrendingUp size={20} />} 
            label="Box Office Revenue" 
            value={movie.revenue ? formatCurrency(movie.revenue) : "In Progress"} 
          />

          <InfoBlock 
            icon={<Globe size={20} />} 
            label="Origin Country" 
            value={movie.origin_country?.[0] || "Global"} 
          />

          <InfoBlock 
            icon={<Flag size={20} />} 
            label="Production Houses" 
            value={movie.production_countries.map(c => c.name).join(", ")} 
          />
        </div>

        {/* Download Hub */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-50">
            <Download size={16} /> External Servers
          </div>
          <div className="flex flex-wrap gap-3">
            <ServerButton name="Bollyflix" onClick={() => handleRedirect(1)} />
            <ServerButton name="Filmyfly" onClick={() => handleRedirect(2)} />
            <ServerButton name="FilmyZilla" onClick={() => handleRedirect(3)} />
          </div>
        </div>

        {/* Keywords Cloud */}
        {movieKeywords.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-current/10">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-50">
              <Tag size={16} /> Story Keywords
            </div>
            <div className="flex flex-wrap gap-2">
              {movieKeywords.map((item) => (
                <span
                  key={item.id}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/5 transition-colors cursor-default"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Helper Components for Cleanliness ---

const InfoBlock = ({ icon, label, value }) => (
  <div className="space-y-2 group">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] opacity-40 group-hover:opacity-60 transition-opacity">
      {icon} {label}
    </div>
    <p className="text-xl font-bold leading-tight">{value}</p>
  </div>
);

const ServerButton = ({ name, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white text-inherit hover:text-black font-bold transition-all border border-white/5 shadow-lg active:scale-95"
  >
    {name}
    <ExternalLink size={16} />
  </button>
);

export default ExtraDetails;