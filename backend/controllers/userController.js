const User = require("../models/userModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// @desc    Get all users
// @route   GET /api/users
// @access  Admin only
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin only
exports.getUserById = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Admin only
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.body;

  if (!role || !["admin", "member"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid role (admin or member)",
    });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    user,
  });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Admin only
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
