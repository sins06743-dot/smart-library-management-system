const Review = require("../models/reviewModel");
const Book = require("../models/bookModel");
const Borrow = require("../models/borrowModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// @desc    Add a review for a book
// @route   POST /api/reviews/:bookId
// @access  Authenticated member (must have borrowed and returned the book)
exports.addReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;
  const { bookId } = req.params;

  if (!rating) {
    return res.status(400).json({
      success: false,
      message: "Please provide a rating",
    });
  }

  // Verify the book exists
  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  // Ensure the user has actually returned this book
  const borrowRecord = await Borrow.findOne({
    user: req.user._id,
    book: bookId,
    status: "returned",
  });

  if (!borrowRecord) {
    return res.status(403).json({
      success: false,
      message: "You can only review books you have borrowed and returned",
    });
  }

  // Check if user has already reviewed this book
  const existing = await Review.findOne({ book: bookId, user: req.user._id });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: "You have already reviewed this book",
    });
  }

  const review = await Review.create({
    book: bookId,
    user: req.user._id,
    rating: Number(rating),
    comment: comment || "",
  });

  // Update book's average rating and review count
  const allReviews = await Review.find({ book: bookId });
  const totalReviews = allReviews.length;
  const averageRating =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  await Book.findByIdAndUpdate(bookId, {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
  });

  const populatedReview = await review.populate("user", "name avatar");

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    review: populatedReview,
  });
});

// @desc    Get all reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
exports.getBookReviews = catchAsyncErrors(async (req, res, next) => {
  const reviews = await Review.find({ book: req.params.bookId })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

// @desc    Check if the current user can review a given book
// @route   GET /api/reviews/:bookId/can-review
// @access  Authenticated
exports.canReview = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;

  const borrowRecord = await Borrow.findOne({
    user: req.user._id,
    book: bookId,
    status: "returned",
  });

  const alreadyReviewed = await Review.findOne({
    book: bookId,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    canReview: !!borrowRecord && !alreadyReviewed,
    alreadyReviewed: !!alreadyReviewed,
  });
});
