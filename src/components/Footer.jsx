import { FaGithub, FaEnvelope, FaWhatsapp, FaLinkedin, FaPlay } from "react-icons/fa";
import { SiBuymeacoffee } from "react-icons/si";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-blue-950/50 to-black ">
      <div className="w-full max-w-screen-2xl mx-auto px-4 py-8 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute -inset-1 bg-red-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <img 
                  src="https://i.ibb.co/Z2M7rLd/profile-pic-2.png" 
                  className="h-10 w-10 rounded-full relative z-10 border-2 border-zinc-800"
                  alt="RanjanFlix Logo" 
                />
              </div>
              <div className="flex items-center space-x-2">
                <FaPlay className="text-red-500 text-lg" />
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  RanjanFlix
                </span>
              </div>
            </div>
            <p className="text-zinc-400 text-center md:text-left text-sm max-w-xs">
              Your ultimate destination for movies and entertainment. Stream the latest content anytime, anywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-white font-semibold text-lg mb-2">Quick Links</h3>
            <div className="flex flex-col space-y-3 text-center md:text-left">
              <a href="/movies" className="text-zinc-400 hover:text-white transition-colors duration-300">
                Browse Movies
              </a>
              <a href="/trending" className="text-zinc-400 hover:text-white transition-colors duration-300">
                Trending Now
              </a>
              <a href="/new" className="text-zinc-400 hover:text-white transition-colors duration-300">
                New Releases
              </a>
              <a href="/support" className="text-zinc-400 hover:text-white transition-colors duration-300">
                Help & Support
              </a>
            </div>
          </div>

          {/* Connect Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-white font-semibold text-lg mb-2">Connect With Me</h3>
            <p className="text-zinc-400 text-sm text-center md:text-left">
              Have questions or want to collaborate? Let's connect!
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              <a
                href="https://buymeacoffee.com/ranjankashyap"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 bg-zinc-800 rounded-full hover:bg-amber-500 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                title="Buy Me a Coffee"
              >
                <SiBuymeacoffee size={18} className="text-amber-400 group-hover:text-white" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Support Me
                </div>
              </a>
              
              <a
                href="https://github.com/RanjanWorks"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 bg-zinc-800 rounded-full hover:bg-zinc-600 transition-all duration-300 transform hover:scale-110"
                title="GitHub"
              >
                <FaGithub size={18} className="text-zinc-400 group-hover:text-white" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  GitHub
                </div>
              </a>
              
              <a
                href="mailto:kashyapranjan9977@gmail.com"
                className="group relative p-3 bg-zinc-800 rounded-full hover:bg-red-500 transition-all duration-300 transform hover:scale-110"
                title="Email"
              >
                <FaEnvelope size={18} className="text-red-400 group-hover:text-white" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Email
                </div>
              </a>
              
              <a
                href="https://wa.me/+916266245085"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 bg-zinc-800 rounded-full hover:bg-green-500 transition-all duration-300 transform hover:scale-110 hover:-rotate-3"
                title="WhatsApp"
              >
                <FaWhatsapp size={18} className="text-green-400 group-hover:text-white" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  WhatsApp
                </div>
              </a>
              
              <a
                href="https://www.linkedin.com/in/ishere-ranjan/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 bg-zinc-800 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                title="LinkedIn"
              >
                <FaLinkedin size={18} className="text-blue-400 group-hover:text-white" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  LinkedIn
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-zinc-900 px-4 text-zinc-500 text-sm">RanjanFlix</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-zinc-500 text-sm text-center md:text-left">
            © {currentYear}{" "}
            <a 
              href="https://linktr.ee/ranjankashyap" 
              className="hover:text-white transition-colors duration-300 font-semibold"
            >
              RanjanFlix
            </a>
            . All Rights Reserved.
          </div>
          
          <div className="flex space-x-6 text-zinc-500 text-sm">
            <a href="/privacy" className="hover:text-white transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors duration-300">
              Terms of Service
            </a>
            <a href="/cookies" className="hover:text-white transition-colors duration-300">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;