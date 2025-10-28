import React from "react";
import { NavLink } from "react-router-dom";
import { GoHeart, GoGlobe  } from "react-icons/go";
import Search from "./Search";
import logo from "../assets/logoflix.svg";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-[60px]">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="Rflix"
            className="h-8 transition-transform group-hover:scale-110"
          />
          <span className="hidden sm:block font-semibold text-white tracking-wide">
            R<span className="text-blue-400">flix</span>
          </span>
        </NavLink>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Discover Icon */}
          <NavLink
            to="/discover"
            className="hidden sm:flex items-center justify-center text-zinc-300 hover:text-cyan-400 transition-colors"
          >
            <GoGlobe  size={20} />
          </NavLink>

          {/* Search Input */}
          <Search />

          {/* Watchlist Button */}
          <NavLink
            to="/watchlist"
            className="flex items-center justify-center text-white border border-zinc-600 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:border-transparent transition-all duration-300"
          >
            <GoHeart size={18} className="mr-1" />
            <span className="hidden sm:block">Watchlist</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
