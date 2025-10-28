import {
  FaGithub,
  FaEnvelope,
  FaWhatsapp,
  FaLinkedin,
  FaPlay,
} from "react-icons/fa";
import { SiBuymeacoffee } from "react-icons/si";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-t from-black via-blue-950/30 to-black border-t border-zinc-800">
      {/* Animated background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 text-center flex flex-col items-center space-y-10">
        {/* Brand Section */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <img
                src="https://i.ibb.co/Z2M7rLd/profile-pic-2.png"
                className="h-12 w-12 rounded-full relative z-10 border-2 border-zinc-700 shadow-md"
                alt="RanjanFlix Logo"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaPlay className="text-cyan-400 text-lg" />
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-wide">
                RanjanFlix
              </span>
            </div>
          </div>
          <p className="text-zinc-400 text-sm max-w-md">
            Explore stories that inspire, entertain, and move you. Your digital
            cinema companion — anytime, anywhere.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-5 pt-4">
          {[
            {
              icon: <SiBuymeacoffee size={18} />,
              href: "https://buymeacoffee.com/ranjankashyap",
              color: "text-amber-400 hover:bg-amber-500",
              label: "Support Me",
            },
            {
              icon: <FaGithub size={18} />,
              href: "https://github.com/RanjanWorks",
              color: "text-zinc-400 hover:bg-zinc-600",
              label: "GitHub",
            },
            {
              icon: <FaEnvelope size={18} />,
              href: "mailto:kashyapranjan9977@gmail.com",
              color: "text-red-400 hover:bg-red-500",
              label: "Email",
            },
            {
              icon: <FaWhatsapp size={18} />,
              href: "https://wa.me/+916266245085",
              color: "text-green-400 hover:bg-green-500",
              label: "WhatsApp",
            },
            {
              icon: <FaLinkedin size={18} />,
              href: "https://www.linkedin.com/in/ishere-ranjan/",
              color: "text-blue-400 hover:bg-blue-600",
              label: "LinkedIn",
            },
          ].map(({ icon, href, color, label }, index) => (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              className={`group relative p-3 bg-zinc-900/70 rounded-full transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_15px_var(--tw-shadow-color)] ${color}`}
              style={{ "--tw-shadow-color": "rgba(56,189,248,0.4)" }}
            >
              <span className={`transition-colors duration-300 ${color}`}>
                {icon}
              </span>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {label}
              </div>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full border-t border-zinc-800 mt-10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full text-zinc-500 text-sm space-y-4 md:space-y-0">
          <div>
            © {currentYear}{" "}
            <a
              href="https://linktr.ee/ranjankashyap"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-white transition-colors duration-300"
            >
              RanjanFlix
            </a>
            . All Rights Reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="/privacy"
              className="hover:text-white transition-colors duration-300"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="hover:text-white transition-colors duration-300"
            >
              Terms
            </a>
            <a
              href="/cookies"
              className="hover:text-white transition-colors duration-300"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
