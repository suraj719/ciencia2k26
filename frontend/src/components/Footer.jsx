import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="relative bg-[#0f172a] py-16 overflow-hidden"
      data-testid="footer"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-3xl font-bold mb-4">
              <span className="gradient-text">CIENCIA</span>
              <br />
              <span className="text-white">2K26</span>
            </h3>
            <p className="text-slate-400 mb-6">
              Where Innovation Meets Celebration. Join us for the most
              spectacular college festival of the year.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/ciencia2k26/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass-effect rounded-lg hover:bg-rose-600/30 transition-colors"
                data-testid="social-instagram"
              >
                <Instagram size={20} className="text-slate-300" />
              </a>
              <a
                href="https://in.linkedin.com/in/cvr-ciencia-8265152b7"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass-effect rounded-lg hover:bg-indigo-600/30 transition-colors"
                data-testid="social-linkedin"
              >
                <Linkedin size={20} className="text-slate-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl font-bold text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <a
                  href="/#sponsors"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Sponsors
                </a>
              </li>
              <li>
                <Link
                  to="/team"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Events */}
          <div>
            <h4 className="font-heading text-xl font-bold text-white mb-6">
              Popular Events
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/event/hackathon"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Hackathon
                </Link>
              </li>
              <li>
                <Link
                  to="/event/shark-tank"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Shark Tank
                </Link>
              </li>
              <li>
                <Link
                  to="/event/tug-of-war"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Tug of War
                </Link>
              </li>
              <li>
                <Link
                  to="/event/box-cricket"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Box Cricket
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xl font-bold text-white mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail
                  size={20}
                  className="text-indigo-400 mt-1 flex-shrink-0"
                />
                <a
                  href="mailto:info@ciencia2k26.in"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  info@ciencia2k26.in
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-cyan-400 mt-1 flex-shrink-0" />
                <a
                  href="tel:+911234567890"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  +91 123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Made with Love Banner */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 flex justify-center">
          <p className="text-slate-500 font-mono text-sm flex items-center gap-2">
            Made with <span className="text-rose-500 animate-pulse">❤</span> by{" "}
            <a
              href="https://suraj.works/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Suraj
            </a>
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl -z-10"></div>
    </footer>
  );
};

export default Footer;
