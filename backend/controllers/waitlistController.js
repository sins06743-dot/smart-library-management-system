const Waitlist = require("../models/waitlistModel");
const Book = require("../models/bookModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// @desc    Join waitlist for a book
// @route   POST /api/waitlist/:bookId
// @access  Member
exports.joinWaitlist = catchAsyncErrors(async (req, res) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  if (book.availability) {
    return res.status(400).json({
      success: false,
      message: "Book is currently available. You can borrow it directly.",
    });
  }

  const existing = await Waitlist.findOne({
    book: bookId,
    user: req.user._id,
    status: { $in: ["waiting", "notified"] },
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: "You are already on the waitlist for this book",
    });
  }

  const position =
    (await Waitlist.countDocuments({
      book: bookId,
      status: { $in: ["waiting", "notified"] },
    })) + 1;

  const entry = await Waitlist.create({
    book: bookId,
    user: req.user._id,
    position,
  });

  await entry.populate("book", "title author coverImage");

  res.status(201).json({
    success: true,
    message: `You have joined the waitlist at position #${position}`,
    entry,
  });
});

// @desc    Leave waitlist
// @route   DELETE /api/waitlist/:bookId
// @access  Member
exports.leaveWaitlist = catchAsyncErrors(async (req, res) => {
  const { bookId } = req.params;

  const entry = await Waitlist.findOne({
    book: bookId,
    user: req.user._id,
    status: { $in: ["waiting", "notified"] },
  });

  if (!entry) {
    return res.status(404).json({ success: false, message: "Waitlist entry not found" });
  }

  const removedPosition = entry.position;
  entry.status = "cancelled";
  await entry.save();

  // Reorder positions for remaining waiters
  await Waitlist.updateMany(
    {
      book: bookId,
      status: "waiting",
      position: { $gt: removedPosition },
    },
    { $inc: { position: -1 } }
  );

  res.status(200).json({ success: true, message: "Removed from waitlist" });
});

// @desc    Get current user's waitlist
// @route   GET /api/waitlist/my
// @access  Member
exports.getMyWaitlist = catchAsyncErrors(async (req, res) => {
  const entries = await Waitlist.find({
    user: req.user._id,
    status: { $in: ["waiting", "notified"] },
  })
    .populate("book", "title author coverImage category availability")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: entries.length, entries });
});

// @desc    Get waitlist for a book (Admin)
// @route   GET /api/waitlist/:bookId
// @access  Admin
exports.getBookWaitlist = catchAsyncErrors(async (req, res) => {
  const entries = await Waitlist.find({
    book: req.params.bookId,
    status: { $in: ["waiting", "notified"] },
  })
    .populate("user", "name email")
    .sort({ position: 1 });

  res.status(200).json({ success: true, count: entries.length, entries });
});

// @desc    Get user's position for a specific book
// @route   GET /api/waitlist/:bookId/position
// @access  Member
exports.getWaitlistPosition = catchAsyncErrors(async (req, res) => {
  const entry = await Waitlist.findOne({
    book: req.params.bookId,
    user: req.user._id,
    status: { $in: ["waiting", "notified"] },
  });

  const totalWaiting = await Waitlist.countDocuments({
    book: req.params.bookId,
    status: { $in: ["waiting", "notified"] },
  });

  res.status(200).json({
    success: true,
    inWaitlist: !!entry,
    position: entry ? entry.position : null,
    status: entry ? entry.status : null,
    expiresAt: entry ? entry.expiresAt : null,
    totalWaiting,
  });
});
