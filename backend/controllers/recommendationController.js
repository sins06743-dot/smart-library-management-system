const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { getRecommendations } = require("../services/recommendationEngine");
const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");

// @desc    Get personalized recommendations
// @route   GET /api/recommendations
// @access  Private (member)
exports.getRecommendations = catchAsyncErrors(async (req, res) => {
  const recommendations = await getRecommendations(req.user._id);

  res.status(200).json({
    success: true,
    count: recommendations.length,
    recommendations,
  });
});

// @desc    Get most popular books
// @route   GET /api/recommendations/popular
// @access  Public
exports.getPopularBooks = catchAsyncErrors(async (req, res) => {
  const popularBooks = await Borrow.aggregate([
    { $group: { _id: "$book", borrowCount: { $sum: 1 } } },
    { $sort: { borrowCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "book",
      },
    },
    { $unwind: "$book" },
    {
      $project: {
        _id: "$book._id",
        title: "$book.title",
        author: "$book.author",
        category: "$book.category",
        coverImage: "$book.coverImage",
        availability: "$book.availability",
        averageRating: "$book.averageRating",
        totalReviews: "$book.totalReviews",
        borrowCount: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    count: popularBooks.length,
    books: popularBooks,
  });
});

// @desc    Get trending books (last 30 days)
// @route   GET /api/recommendations/trending
// @access  Public
exports.getTrendingBooks = catchAsyncErrors(async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const trendingBooks = await Borrow.aggregate([
    { $match: { issueDate: { $gte: thirtyDaysAgo } } },
    { $group: { _id: "$book", borrowCount: { $sum: 1 } } },
    { $sort: { borrowCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "book",
      },
    },
    { $unwind: "$book" },
    {
      $project: {
        _id: "$book._id",
        title: "$book.title",
        author: "$book.author",
        category: "$book.category",
        coverImage: "$book.coverImage",
        availability: "$book.availability",
        averageRating: "$book.averageRating",
        totalReviews: "$book.totalReviews",
        borrowCount: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    count: trendingBooks.length,
    books: trendingBooks,
  });
});
