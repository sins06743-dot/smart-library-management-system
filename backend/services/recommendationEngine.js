const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");

/**
 * Get personalized book recommendations for a user
 * Hybrid: content-based (category/author) + collaborative filtering
 */
const getRecommendations = async (userId) => {
  // Get user's borrow history
  const userBorrows = await Borrow.find({ user: userId }).populate("book", "category author _id");

  if (userBorrows.length === 0) {
    return [];
  }

  const borrowedBookIds = userBorrows.map((b) => b.book._id.toString());

  // Extract preferred categories and authors
  const categoryCount = {};
  const authorCount = {};

  userBorrows.forEach((borrow) => {
    const book = borrow.book;
    if (book) {
      categoryCount[book.category] = (categoryCount[book.category] || 0) + 1;
      authorCount[book.author] = (authorCount[book.author] || 0) + 1;
    }
  });

  const totalBorrows = userBorrows.length;
  const preferredCategories = Object.keys(categoryCount);
  const preferredAuthors = Object.keys(authorCount);

  // Get all available books not borrowed by this user
  const candidateBooks = await Book.find({
    _id: { $nin: borrowedBookIds },
  });

  if (candidateBooks.length === 0) {
    return [];
  }

  // Get borrow counts for all books (for popularity scoring)
  const borrowCounts = await Borrow.aggregate([
    { $group: { _id: "$book", count: { $sum: 1 } } },
  ]);
  const borrowCountMap = {};
  borrowCounts.forEach((item) => {
    borrowCountMap[item._id.toString()] = item.count;
  });

  const maxBorrowCount = Math.max(1, ...Object.values(borrowCountMap));

  // Get recent borrow counts (last 30 days) for recency scoring
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentBorrows = await Borrow.aggregate([
    { $match: { issueDate: { $gte: thirtyDaysAgo } } },
    { $group: { _id: "$book", count: { $sum: 1 } } },
  ]);
  const recentBorrowMap = {};
  recentBorrows.forEach((item) => {
    recentBorrowMap[item._id.toString()] = item.count;
  });

  const maxRecentCount = Math.max(1, ...Object.values(recentBorrowMap));

  // Find similar users (collaborative filtering)
  const similarUserBorrows = await Borrow.find({
    book: { $in: borrowedBookIds },
    user: { $ne: userId },
  }).distinct("user");

  const collaborativeBookIds = new Set();
  if (similarUserBorrows.length > 0) {
    const collabBorrows = await Borrow.find({
      user: { $in: similarUserBorrows },
      book: { $nin: borrowedBookIds },
    }).distinct("book");
    collabBorrows.forEach((id) => collaborativeBookIds.add(id.toString()));
  }

  // Score each candidate book
  const scoredBooks = candidateBooks.map((book) => {
    const bookId = book._id.toString();

    // Category match score (0-1), weighted 40%
    const categoryWeight = categoryCount[book.category]
      ? (categoryCount[book.category] / totalBorrows) * 0.4
      : 0;

    // Popularity score (0-1), weighted 30%
    const popularityScore = ((borrowCountMap[bookId] || 0) / maxBorrowCount) * 0.3;

    // Recency score (0-1), weighted 15%
    const recencyScore = ((recentBorrowMap[bookId] || 0) / maxRecentCount) * 0.15;

    // Author match score (0-1), weighted 15%
    const authorWeight = authorCount[book.author]
      ? (authorCount[book.author] / totalBorrows) * 0.15
      : 0;

    // Collaborative bonus
    const collabBonus = collaborativeBookIds.has(bookId) ? 0.1 : 0;

    const totalScore = categoryWeight + popularityScore + recencyScore + authorWeight + collabBonus;

    // Determine reason
    let reason = "Popular in library";
    if (categoryWeight > 0 && categoryWeight >= authorWeight) {
      reason = `Based on your interest in ${book.category}`;
    } else if (authorWeight > 0) {
      reason = `More books by ${book.author}`;
    } else if (collaborativeBookIds.has(bookId)) {
      reason = "Readers like you also borrowed this";
    }

    return {
      ...book.toObject(),
      score: Math.min(totalScore, 1),
      matchPercentage: Math.round(Math.min(totalScore, 1) * 100),
      reason,
    };
  });

  // Sort by score and return top 10
  return scoredBooks.sort((a, b) => b.score - a.score).slice(0, 10);
};

module.exports = { getRecommendations };
