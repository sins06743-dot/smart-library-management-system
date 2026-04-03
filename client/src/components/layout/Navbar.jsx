import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, LogOut, Menu, X, BarChart2, Camera } from "lucide-react";
import QRScanner from "../books/QRScanner";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/catalog", label: "Catalog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-surface-100/80 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/30 blur-lg rounded-full group-hover:bg-violet-500/50 transition-all" />
              <BookOpen className="relative w-7 h-7 text-violet-400" />
            </div>
            <span className="font-heading font-bold text-lg text-white tracking-tight">
              Smart<span className="text-violet-400">Library</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive(link.to)
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" ? (
                  <Link
                    to="/admin/dashboard"
                    className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/member/dashboard"
                      className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/member/analytics"
                      className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                      title="Reading Analytics"
                    >
                      <BarChart2 className="w-4 h-4" />
                      <span className="hidden lg:inline">Analytics</span>
                    </Link>
                    <button
                      onClick={() => setShowQR(true)}
                      className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                      title="QR Scanner"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </>
                )}
                <div className="w-px h-5 bg-white/10" />
                <span className="text-sm text-gray-400 font-medium">{user?.name}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-all font-medium border border-red-500/20"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-300 hover:text-white font-medium px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all font-semibold shadow-glow-sm"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 pt-2 space-y-1 border-t border-white/5">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.to)
                        ? "text-white bg-white/5"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <>
                    <Link
                      to={user?.role === "admin" ? "/admin/dashboard" : "/member/dashboard"}
                      onClick={() => setMenuOpen(false)}
                      className="block py-2.5 px-3 rounded-lg text-sm text-violet-400 font-medium"
                    >
                      Dashboard
                    </Link>
                    {user?.role === "member" && (
                      <>
                        <Link
                          to="/member/analytics"
                          onClick={() => setMenuOpen(false)}
                          className="block py-2.5 px-3 rounded-lg text-sm text-cyan-400 font-medium"
                        >
                          📊 Analytics
                        </Link>
                        <button
                          onClick={() => { setMenuOpen(false); setShowQR(true); }}
                          className="block py-2.5 px-3 rounded-lg text-sm text-gray-400 font-medium w-full text-left"
                        >
                          📷 QR Scanner
                        </button>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block py-2.5 px-3 rounded-lg text-sm text-red-400 font-medium w-full text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 pt-2 px-3">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center py-2.5 text-sm text-gray-300 border border-white/10 rounded-xl font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center py-2.5 text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* QR Scanner modal */}
      {showQR && <QRScanner onClose={() => setShowQR(false)} />}
    </motion.nav>
  );
};

export default Navbar;
