const Borrow = require("../models/borrowModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// @desc    Get reading analytics for the logged-in member
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
