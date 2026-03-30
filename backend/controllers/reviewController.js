const Review = require("../models/reviewModel");
const Book = require("../models/bookModel");
const Borrow = require("../models/borrowModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// Helper: recalculate book rating stats
const updateBookRating = async (bookId) => {
  const result = await Review.aggregate([
    { $match: { book: bookId, isApproved: true } },
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews,
    });
  } else {
    await Book.findByIdAndUpdate(bookId, { averageRating: 0, totalReviews: 0 });
  }
};

// @desc    Add a review
// @route   POST /api/reviews/:bookId
// @access  Member (must have borrowed & returned)
exports.addReview = catchAsyncErrors(async (req, res) => {
  const { bookId } = req.params;
  const { rating, comment } = req.body;

  if (!rating) {
    return res.status(400).json({ success: false, message: "Rating is required" });
  }

  // Check book exists
  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  // Check if user has borrowed and returned this book
  const hasBorrowed = await Borrow.findOne({
    user: req.user._id,
    book: bookId,
    status: "returned",
  });

  if (!hasBorrowed) {
    return res.status(403).json({
      success: false,
      message: "You must borrow and return this book before reviewing it",
    });
  }

  // Check existing review
  const existingReview = await Review.findOne({ book: bookId, user: req.user._id });
  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: "You have already reviewed this book. Edit your existing review.",
    });
  }

  const review = await Review.create({
    book: bookId,
    user: req.user._id,
    rating: Number(rating),
    comment: comment || "",
  });

  await updateBookRating(book._id);

  await review.populate("user", "name avatar");

  res.status(201).json({ success: true, message: "Review added successfully", review });
});

// @desc    Get book reviews
// @route   GET /api/reviews/:bookId
// @access  Public
exports.getBookReviews = catchAsyncErrors(async (req, res) => {
  const { bookId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const total = await Review.countDocuments({ book: bookId, isApproved: true });
  const reviews = await Review.find({ book: bookId, isApproved: true })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    reviews,
  });
});

// @desc    Update own review
// @route   PUT /api/reviews/:reviewId
// @access  Member (own)
exports.updateReview = catchAsyncErrors(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }

  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  const { rating, comment } = req.body;
  if (rating) review.rating = Number(rating);
  if (comment !== undefined) review.comment = comment;
  await review.save();

  await updateBookRating(review.book);
  await review.populate("user", "name avatar");

  res.status(200).json({ success: true, message: "Review updated", review });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:reviewId
// @access  Member (own) or Admin
exports.deleteReview = catchAsyncErrors(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }

  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  const bookId = review.book;
  await Review.findByIdAndDelete(req.params.reviewId);
  await updateBookRating(bookId);

  res.status(200).json({ success: true, message: "Review deleted" });
});

// @desc    Toggle review approval (Admin)
// @route   PUT /api/reviews/:reviewId/approve
// @access  Admin
exports.toggleApproval = catchAsyncErrors(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }

  review.isApproved = !review.isApproved;
  await review.save();
  await updateBookRating(review.book);

  res.status(200).json({
    success: true,
    message: `Review ${review.isApproved ? "approved" : "rejected"}`,
    review,
  });
});
