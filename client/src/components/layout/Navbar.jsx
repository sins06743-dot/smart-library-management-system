import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { FiBook, FiLogOut, FiMenu, FiX, FiBarChart2 } from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <FiBook className="text-2xl" />
            <span>Smart Library</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Home</Link>
            <Link to="/catalog" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Catalog</Link>
            <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Contact</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" ? (
                  <Link to="/admin/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/member/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Dashboard
                    </Link>
                    <Link to="/member/analytics" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 font-medium">
                      <FiBarChart2 /> Analytics
                    </Link>
                  </>
                )}
                <span className="text-gray-500">|</span>
                <span className="text-gray-700 font-medium">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600 hover:text-indigo-600 font-medium">Home</Link>
            <Link to="/catalog" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600 hover:text-indigo-600 font-medium">Catalog</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600 hover:text-indigo-600 font-medium">About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600 hover:text-indigo-600 font-medium">Contact</Link>
            {isAuthenticated ? (
              <>
                <Link to={user?.role === "admin" ? "/admin/dashboard" : "/member/dashboard"} onClick={() => setMenuOpen(false)} className="block py-2 text-indigo-600 font-medium">Dashboard</Link>
                {user?.role === "member" && (
                  <Link to="/member/analytics" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 py-2 text-gray-600 font-medium"><FiBarChart2 /> Analytics</Link>
                )}
                <button onClick={handleLogout} className="text-red-600 font-medium py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-indigo-600 font-medium">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-indigo-600 font-medium">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
