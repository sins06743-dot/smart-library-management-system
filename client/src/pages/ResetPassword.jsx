import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword, clearAuthState } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { loading, error, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthState());
    }
    if (message) {
      toast.success(message);
      dispatch(clearAuthState());
      navigate("/login");
    }
  }, [error, message, dispatch, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    dispatch(resetPassword({ token, ...formData }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 mb-4">
            <Lock className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400 mt-2">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-200/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm new password"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-200/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all font-semibold disabled:opacity-50 shadow-glow-sm"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
