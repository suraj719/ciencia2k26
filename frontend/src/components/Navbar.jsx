import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    // Run once on mount to set initial state
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Sponsors", path: "/#sponsors" },
    { name: "Team", path: "/team" },
  ];

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (path.includes("#")) {
      const [route, hash] = path.split("#");
      const targetRoute = route || "/";
      if (location.pathname !== targetRoute) {
        window.location.href = path;
      } else {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 50);
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "backdrop-blur-xl bg-[#0f172a]/80 border-b border-white/10 shadow-lg shadow-black/20 py-3"
          : "bg-transparent py-5"
          }`}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/ciencia_logo.jpeg"
                  alt="CIENCIA"
                  className="h-8 w-8 object-contain rounded-xl shadow-lg border border-white/10 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-white/40 transition-all"></div>
              </div>
              <span className="font-heading text-xl font-bold text-white tracking-tighter group-hover:text-indigo-400 transition-colors hidden sm:block">
                CIENCIA <span className="text-[#ec4899]">2K26</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => {
                    if (link.path.includes("#")) {
                      e.preventDefault();
                      handleNavClick(link.path);
                    }
                  }}
                  className="text-slate-300 hover:text-white transition-colors duration-300 font-medium relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              ))}
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <div className="flex items-center gap-6">
                      <Link to="/admin" className="text-slate-300 hover:text-white transition-colors duration-300 font-medium relative group">Admin Dashboard</Link>
                      <Link to="/my-registrations" className="text-slate-300 hover:text-white transition-colors duration-300 font-medium relative group">My Bookings</Link>
                    </div>
                  ) : (
                    <Link to="/my-registrations" className="text-slate-300 hover:text-white transition-colors duration-300 font-medium relative group">My Bookings</Link>
                  )}
                  <button onClick={logout} className="px-6 py-2 rounded-full font-semibold transition-all duration-300 bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-300 hover:text-white transition-colors duration-300 font-medium relative group">Login</Link>
                  <Link to="/register" className="px-6 py-2 rounded-full font-semibold transition-all duration-300 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105">Sign Up</Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — rendered outside nav to prevent clipping */}
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 z-40 md:hidden transition-all duration-300 ${mobileMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-down panel */}
        <div
          className={`absolute top-0 left-0 right-0 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
            }`}
        >
          {/* Header row inside panel */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 group">
              <img
                src="/ciencia_logo.jpeg"
                alt="CIENCIA"
                className="h-10 w-10 object-contain rounded-lg"
              />
              <span className="font-heading text-lg font-bold text-white tracking-tighter">
                CIENCIA <span className="text-[#ec4899]">2K26</span>
              </span>
            </Link>
            <button
              className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col px-6 py-6 gap-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => {
                  if (link.path.includes("#")) {
                    e.preventDefault();
                  }
                  handleNavClick(link.path);
                }}
                className="text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium py-3 px-4 rounded-lg text-lg"
                style={{ transitionDelay: mobileMenuOpen ? `${i * 50}ms` : "0ms" }}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to="/my-registrations" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium py-3 px-4 rounded-lg text-lg">My Bookings</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium py-3 px-4 rounded-lg text-lg">Admin Dashboard</Link>
                  )}
                  <button onClick={logout} className="block w-full text-center px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-rose-500/30">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-300">Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/30">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
