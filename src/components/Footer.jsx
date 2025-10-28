import {
  FaGithub,
  FaEnvelope,
  FaLinkedin,
  FaHeart,
} from "react-icons/fa";
import { SiBuymeacoffee } from "react-icons/si";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left Section - Brand & Info */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-white font-semibold">RanjanFlix</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400 text-sm">Developer</span>
            </div>
            <p className="text-gray-400 text-sm text-center md:text-left">
              Built with <FaHeart className="inline text-red-400 mx-1" /> by Ranjan Kashyap
            </p>
            <p className="text-gray-500 text-xs">
              © {currentYear} All rights reserved
            </p>
          </div>

          {/* Center Section - Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="/movies"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Movies
            </a>
            <a
              href="/watchlist"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Watchlist
            </a>
            <a
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>

          {/* Right Section - Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/RanjanWorks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              title="GitHub"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/ishere-ranjan/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              title="LinkedIn"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href="mailto:kashyapranjan9977@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
              title="Email"
            >
              <FaEnvelope size={18} />
            </a>
            <a
              href="https://buymeacoffee.com/ranjankashyap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-amber-400 transition-colors"
              title="Buy Me a Coffee"
            >
              <SiBuymeacoffee size={18} />
            </a>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-800 mt-6 pt-4 text-center">
          <p className="text-gray-500 text-xs">
            Data provided by TMDB • Made for educational purposes
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;