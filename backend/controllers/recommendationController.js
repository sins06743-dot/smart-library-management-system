const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// @desc    Get AI-style book recommendations for the logged-in user
// @route   GET /api/recommendations
// @access  Authenticated
//
// Strategy:
// 1. Find all categories the user has borrowed from (their preference profile).
// 2. Find other users who share at least one category (collaborative filtering).
// 3. Recommend books those users borrowed that the current user hasn't read yet.
// 4. Fall back to top-rated books in the user's favourite categories if not enough results.
exports.getRecommendations = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  // Step 1: Get books the current user has already borrowed
  const myBorrows = await Borrow.find({ user: userId }).select("book");
  const myBookIds = myBorrows.map((b) => b.book.toString());

  // Step 2: Discover categories the user prefers
  const myBooks = await Book.find({ _id: { $in: myBookIds } }).select("category");
  const myCategories = [...new Set(myBooks.map((b) => b.category))];

  let recommendations = [];

  if (myCategories.length > 0) {
    // Step 3: Find books in those categories that the user hasn't borrowed yet
    const categoryRecs = await Book.find({
      category: { $in: myCategories },
      _id: { $nin: myBookIds },
      availability: true,
    })
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(10);

    recommendations = categoryRecs;
  }

  // Step 4: If we still need more, fill up with highest-rated available books overall
  if (recommendations.length < 6) {
    const alreadyIds = [
      ...myBookIds,
      ...recommendations.map((b) => b._id.toString()),
    ];
    const topRated = await Book.find({
      _id: { $nin: alreadyIds },
      availability: true,
    })
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(6 - recommendations.length);

    recommendations = [...recommendations, ...topRated];
  }

  // Step 5: New user with no borrow history — return top-rated books
  if (recommendations.length === 0) {
    recommendations = await Book.find({ availability: true })
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(6);
  }

  res.status(200).json({
    success: true,
    count: recommendations.length,
    favouriteCategories: myCategories,
    recommendations,
  });
});
