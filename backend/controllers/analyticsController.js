const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const User = require("../models/userModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// @desc    Get user's overall reading stats
// @route   GET /api/analytics/my-stats
// @access  Member
exports.getMyReadingStats = catchAsyncErrors(async (req, res) => {
  const userId = req.user._id;

  const allBorrows = await Borrow.find({ user: userId });
  const returned = allBorrows.filter((b) => b.status === "returned");
  const active = allBorrows.filter((b) => b.status === "borrowed");

  const onTimeReturns = returned.filter(
    (b) => b.actualReturnDate && b.actualReturnDate <= b.returnDate
  ).length;
  const onTimePercent =
    returned.length > 0 ? Math.round((onTimeReturns / returned.length) * 100) : 100;

  const totalFines = returned.reduce((sum, b) => sum + (b.fine || 0), 0);

  const avgDuration =
    returned.length > 0
      ? Math.round(
          returned.reduce((sum, b) => {
            const days = b.actualReturnDate
              ? (new Date(b.actualReturnDate) - new Date(b.issueDate)) /
                (1000 * 60 * 60 * 24)
              : 0;
            return sum + days;
          }, 0) / returned.length
        )
      : 0;

  res.status(200).json({
    success: true,
    stats: {
      totalBorrowed: allBorrows.length,
      currentlyBorrowed: active.length,
      returned: returned.length,
      onTimePercent,
      totalFines,
      avgDuration,
    },
  });
});

// @desc    Get monthly borrow stats for last 12 months
// @route   GET /api/analytics/my-monthly
// @access  Member
exports.getMyMonthlyStats = catchAsyncErrors(async (req, res) => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyData = await Borrow.aggregate([
    {
      $match: {
        user: req.user._id,
        issueDate: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$issueDate" },
          month: { $month: "$issueDate" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const found = monthlyData.find((m) => m._id.year === year && m._id.month === month);
    months.push({
      month: d.toLocaleString("default", { month: "short", year: "numeric" }),
      count: found ? found.count : 0,
    });
  }

  res.status(200).json({ success: true, monthlyData: months });
});

// @desc    Get category breakdown
// @route   GET /api/analytics/my-categories
// @access  Member
exports.getMyCategoryBreakdown = catchAsyncErrors(async (req, res) => {
  const categoryData = await Borrow.aggregate([
    { $match: { user: req.user._id } },
    {
      $lookup: {
        from: "books",
        localField: "book",
        foreignField: "_id",
        as: "bookData",
      },
    },
    { $unwind: "$bookData" },
    {
      $group: {
        _id: "$bookData.category",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  res.status(200).json({
    success: true,
    categoryData: categoryData.map((item) => ({
      category: item._id,
      count: item.count,
    })),
  });
});

// @desc    Get reading streak/calendar data (last 365 days)
// @route   GET /api/analytics/my-streak
// @access  Member
exports.getMyReadingStreak = catchAsyncErrors(async (req, res) => {
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 364);
  oneYearAgo.setHours(0, 0, 0, 0);

  const borrows = await Borrow.find({
    user: req.user._id,
    issueDate: { $gte: oneYearAgo },
  });

  const dayMap = {};
  borrows.forEach((b) => {
    const dateStr = new Date(b.issueDate).toISOString().split("T")[0];
    dayMap[dateStr] = (dayMap[dateStr] || 0) + 1;
  });

  res.status(200).json({ success: true, streakData: dayMap });
});

// @desc    Get top authors
// @route   GET /api/analytics/my-authors
// @access  Member
exports.getMyTopAuthors = catchAsyncErrors(async (req, res) => {
  const authorData = await Borrow.aggregate([
    { $match: { user: req.user._id } },
    {
      $lookup: {
        from: "books",
        localField: "book",
        foreignField: "_id",
        as: "bookData",
      },
    },
    { $unwind: "$bookData" },
    {
      $group: {
        _id: "$bookData.author",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  res.status(200).json({
    success: true,
    authors: authorData.map((item) => ({ author: item._id, count: item.count })),
  });
});

// @desc    Get admin analytics
// @route   GET /api/analytics/admin
// @access  Admin
exports.getAdminAnalytics = catchAsyncErrors(async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalBooks,
    totalUsers,
    totalBorrows,
    activeBorrows,
    monthlyBorrows,
    weeklyBorrows,
    categoryStats,
    overdue,
  ] = await Promise.all([
    Book.countDocuments(),
    User.countDocuments({ role: "member" }),
    Borrow.countDocuments(),
    Borrow.countDocuments({ status: "borrowed" }),
    Borrow.countDocuments({ issueDate: { $gte: thirtyDaysAgo } }),
    Borrow.countDocuments({ issueDate: { $gte: sevenDaysAgo } }),
    Borrow.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookData",
        },
      },
      { $unwind: "$bookData" },
      { $group: { _id: "$bookData.category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Borrow.countDocuments({ status: "borrowed", returnDate: { $lt: new Date() } }),
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalBooks,
      totalUsers,
      totalBorrows,
      activeBorrows,
      monthlyBorrows,
      weeklyBorrows,
      overdue,
      categoryStats: categoryStats.map((c) => ({ category: c._id, count: c.count })),
    },
  });
});
