const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const Review = require("../models/reviewModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// @desc    Get overall reading stats for the logged-in member
// @route   GET /api/analytics/my-stats
// @access  Authenticated
exports.getMyStats = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const allBorrows = await Borrow.find({ user: userId })
    .populate("book", "title author category coverImage")
    .sort({ issueDate: 1 });

  const returned = allBorrows.filter((b) => b.status === "returned");
  const active = allBorrows.filter((b) => b.status === "borrowed");

  // --- Books read per month (last 12 months) ---
  const now = new Date();
  const booksPerMonth = [];
  for (let i = 11; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = month.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    const count = returned.filter((b) => {
      const d = new Date(b.actualReturnDate || b.returnDate);
      return (
        d.getFullYear() === month.getFullYear() &&
        d.getMonth() === month.getMonth()
      );
    }).length;
    booksPerMonth.push({ month: monthLabel, count });
  }

  // --- Category distribution ---
  const categoryMap = {};
  allBorrows.forEach((b) => {
    if (b.book && b.book.category) {
      categoryMap[b.book.category] = (categoryMap[b.book.category] || 0) + 1;
    }
  });
  const categoryDistribution = Object.entries(categoryMap).map(
    ([name, value]) => ({ name, value })
  );

  // --- Favourite category ---
  const favouriteCategory =
    categoryDistribution.length > 0
      ? categoryDistribution.sort((a, b) => b.value - a.value)[0].name
      : null;

  // --- Total fines paid ---
  const totalFines = returned.reduce((sum, b) => sum + (b.fine || 0), 0);

  // --- On-time return rate ---
  const onTime = returned.filter(
    (b) =>
      b.actualReturnDate &&
      new Date(b.actualReturnDate) <= new Date(b.returnDate)
  ).length;
  const onTimeRate =
    returned.length > 0 ? Math.round((onTime / returned.length) * 100) : 100;

  // --- Reading streak (consecutive months with at least one return) ---
  let streak = 0;
  for (let i = booksPerMonth.length - 1; i >= 0; i--) {
    if (booksPerMonth[i].count > 0) {
      streak++;
    } else {
      break;
    }
  }

  // --- Recent activity (last 5 borrow records) ---
  const recentActivity = allBorrows.slice(-5).reverse().map((b) => ({
    bookTitle: b.book ? b.book.title : "Unknown",
    bookAuthor: b.book ? b.book.author : "",
    bookCover: b.book ? b.book.coverImage : "",
    category: b.book ? b.book.category : "",
    issueDate: b.issueDate,
    returnDate: b.returnDate,
    actualReturnDate: b.actualReturnDate,
    status: b.status,
    fine: b.fine,
  }));

  res.status(200).json({
    success: true,
    stats: {
      totalBorrowed: allBorrows.length,
      totalReturned: returned.length,
      currentlyBorrowed: active.length,
      totalFines,
      onTimeRate,
      favouriteCategory,
      readingStreak: streak,
      booksPerMonth,
      categoryDistribution,
      recentActivity,
    },
  });
});

// @desc    Get 12-month bar data for current user
// @route   GET /api/analytics/monthly
// @access  Authenticated
exports.getMonthlyData = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const monthlyData = await Borrow.aggregate([
    {
      $match: {
        user: userId,
        status: "returned",
        actualReturnDate: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$actualReturnDate" },
          month: { $month: "$actualReturnDate" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.status(200).json({ success: true, monthlyData });
});

// @desc    Get category breakdown for current user
// @route   GET /api/analytics/categories
// @access  Authenticated
exports.getCategoryBreakdown = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const borrows = await Borrow.find({ user: userId }).populate("book", "category");
  const categoryMap = {};
  borrows.forEach((b) => {
    if (b.book && b.book.category) {
      categoryMap[b.book.category] = (categoryMap[b.book.category] || 0) + 1;
    }
  });

  const categories = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  res.status(200).json({ success: true, categories });
});

// @desc    Get 365-day streak calendar (daily borrow counts for heatmap)
// @route   GET /api/analytics/streak-calendar
// @access  Authenticated
exports.getStreakCalendar = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const dailyCounts = await Borrow.aggregate([
    {
      $match: {
        user: userId,
        issueDate: { $gte: oneYearAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$issueDate" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Build a map: date string → count
  const calendarMap = {};
  dailyCounts.forEach((d) => {
    calendarMap[d._id] = d.count;
  });

  // Generate full 365-day grid
  const calendar = [];
  for (let i = 364; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    calendar.push({
      date: dateStr,
      count: calendarMap[dateStr] || 0,
    });
  }

  res.status(200).json({ success: true, calendar });
});

// @desc    Get top authors for current user
// @route   GET /api/analytics/top-authors
// @access  Authenticated
exports.getTopAuthors = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const borrows = await Borrow.find({ user: userId }).populate("book", "author");
  const authorMap = {};
  borrows.forEach((b) => {
    if (b.book && b.book.author) {
      authorMap[b.book.author] = (authorMap[b.book.author] || 0) + 1;
    }
  });

  const topAuthors = Object.entries(authorMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  res.status(200).json({ success: true, topAuthors });
});

// @desc    Get admin-level analytics summary (all users)
// @route   GET /api/analytics/admin-summary
// @access  Admin only
exports.getAdminSummary = catchAsyncErrors(async (req, res, next) => {
  const totalBooks = await Book.countDocuments();
  const availableBooks = await Book.countDocuments({ availability: true });
  const totalBorrows = await Borrow.countDocuments();
  const activeBorrows = await Borrow.countDocuments({ status: "borrowed" });
  const overdueCount = await Borrow.countDocuments({
    status: "borrowed",
    returnDate: { $lt: new Date() },
  });

  // Average rating across all books via aggregation
  const ratingAgg = await Review.aggregate([
    { $group: { _id: null, avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
  ]);

  const avgRating = ratingAgg.length > 0 ? Math.round(ratingAgg[0].avgRating * 10) / 10 : 0;
  const totalReviews = ratingAgg.length > 0 ? ratingAgg[0].totalReviews : 0;

  // Most borrowed books
  const topBorrowed = await Borrow.aggregate([
    { $group: { _id: "$book", borrowCount: { $sum: 1 } } },
    { $sort: { borrowCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "bookInfo",
      },
    },
    { $unwind: "$bookInfo" },
    {
      $project: {
        borrowCount: 1,
        title: "$bookInfo.title",
        author: "$bookInfo.author",
      },
    },
  ]);

  res.status(200).json({
    success: true,
    summary: {
      totalBooks,
      availableBooks,
      totalBorrows,
      activeBorrows,
      overdueCount,
      avgRating,
      totalReviews,
      topBorrowed,
    },
  });
});
