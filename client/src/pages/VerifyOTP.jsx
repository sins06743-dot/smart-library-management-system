import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyOTP, resendOTP, clearAuthState } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const VerifyOTP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState("");
  const email = localStorage.getItem("verifyEmail") || "";

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem("verifyEmail");
      navigate("/member/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthState());
    }
  }, [error, dispatch]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    dispatch(verifyOTP({ email, otp }));
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found. Please register again.");
      return;
    }
    const result = await dispatch(resendOTP(email));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("OTP resent successfully!");
    }
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
            <ShieldCheck className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Verify Your Email</h1>
          <p className="text-gray-400 mt-2">
            Enter the 6-digit OTP sent to <br />
            <span className="font-medium text-violet-400">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest bg-surface-200/80 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all font-bold"
            />
            <p className="text-xs text-gray-500 mt-1.5">OTP is valid for 10 minutes</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all font-semibold disabled:opacity-50 shadow-glow-sm"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the OTP?{" "}
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-violet-400 font-medium hover:text-violet-300 disabled:opacity-50 transition-colors"
            >
              Resend OTP
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
