import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, clearAuthState } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, BookOpen } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/member/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthState());
    }
  }, [error, dispatch]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Logged in successfully!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-violet-600/20 rounded-full blur-3xl top-1/4 -left-36 animate-blob" />
        <div className="absolute w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl bottom-1/4 -right-36 animate-blob animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-8 w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 mb-4">
            <BookOpen className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-1">Sign in to your library account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-200/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Your password"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-200/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
              />
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all font-semibold disabled:opacity-50 shadow-glow-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
