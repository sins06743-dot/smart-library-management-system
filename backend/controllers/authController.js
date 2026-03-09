const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/userModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");
const sendVerificationCode = require("../utils/sendVerificationCode");
const { resetPasswordTemplate } = require("../utils/emailTemplates");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email and password",
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User with this email already exists",
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Send OTP for email verification
  await sendVerificationCode(user);

  res.status(201).json({
    success: true,
    message: "Registration successful. Please verify your email with the OTP sent.",
    userId: user._id,
  });
});

// @desc    Verify OTP and activate account
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and OTP",
    });
  }

  // Find user with OTP fields
  const user = await User.findOne({ email }).select("+otp +otpExpiry");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Check if OTP matches
  if (user.otp !== Number(otp)) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  // Check if OTP has expired
  if (user.otpExpiry < Date.now()) {
    return res.status(400).json({
      success: false,
      message: "OTP has expired. Please request a new one.",
    });
  }

  // Mark user as verified and clear OTP fields
  user.verified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  // Send JWT token
  sendToken(user, 200, res, "Email verified successfully. Welcome to Smart Library!");
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  // Find user and include password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Check if password matches
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Check if user has verified their email
  if (!user.verified) {
    return res.status(401).json({
      success: false,
      message: "Please verify your email before logging in",
    });
  }

  sendToken(user, 200, res, "Logged in successfully");
});

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// @desc    Forgot password - send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found with this email",
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and save token to user
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await user.save();

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Smart Library - Password Reset Request",
      html: resetPasswordTemplate(user.name, resetUrl),
    });

    res.status(200).json({
      success: true,
      message: `Password reset link sent to ${user.email}`,
    });
  } catch (error) {
    // Clear reset token if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return res.status(500).json({
      success: false,
      message: "Email could not be sent. Please try again.",
    });
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  // Hash the token from URL
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Find user with valid token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Password reset token is invalid or has expired",
    });
  }

  // Update password
  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  sendToken(user, 200, res, "Password reset successfully");
});

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      success: false,
      message: "This account is already verified",
    });
  }

  await sendVerificationCode(user);

  res.status(200).json({
    success: true,
    message: "OTP resent successfully",
  });
});
