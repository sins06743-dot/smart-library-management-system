const express = require("express");
const router = express.Router();
const {
  register,
  verifyOTP,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  resendOTP,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/me", isAuthenticated, getMe);

module.exports = router;
