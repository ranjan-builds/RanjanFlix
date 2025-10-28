import React from "react";
import { NavLink } from "react-router-dom";
import { LiaAngleRightSolid } from "react-icons/lia";

const MovieCategoryName = ({ title, linkTo }) => {
  return (
    <div className="flex items-center justify-between mb-6 mt-4">
      {/* Title Section */}
      <div className="flex items-center">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
        <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
          {title}
        </h2>
      </div>

      {/* View All Button */}
      {linkTo && (
        <NavLink to={linkTo}>
          <button className="group flex items-center space-x-1 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm border border-gray-600/50 hover:border-blue-400/50 transition-all duration-300 ease-out hover:scale-105">
            <span className="text-sm font-medium text-gray-300 group-hover:text-blue-400 transition-colors duration-200">
              View all
            </span>
            <LiaAngleRightSolid 
              size={16} 
              className="text-blue-400 group-hover:translate-x-1 transition-transform duration-200" 
            />
          </button>
        </NavLink>
      )}
    </div>
  );
};

export default MovieCategoryName;