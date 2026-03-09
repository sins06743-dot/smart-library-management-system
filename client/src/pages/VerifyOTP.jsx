import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyOTP, resendOTP, clearAuthState } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { FiShield } from "react-icons/fi";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-indigo-100 w-16 h-16 rounded-full mb-4">
            <FiShield className="text-indigo-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>
          <p className="text-gray-500 mt-2">
            Enter the 6-digit OTP sent to <br />
            <span className="font-medium text-indigo-600">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            />
            <p className="text-xs text-gray-400 mt-1">OTP is valid for 10 minutes</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the OTP?{" "}
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-indigo-600 font-medium hover:text-indigo-800 disabled:opacity-50"
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
