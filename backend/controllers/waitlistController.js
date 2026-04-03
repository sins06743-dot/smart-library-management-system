const Waitlist = require("../models/waitlistModel");
const Book = require("../models/bookModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail");

// @desc    Join the waitlist for a book
// @route   POST /api/waitlist/:bookId
// @access  Authenticated member
exports.joinWaitlist = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  // Don't allow joining waitlist if book is already available
  if (book.availability) {
    return res.status(400).json({
      success: false,
      message: "This book is currently available — you can borrow it directly",
    });
  }

  // Check if user is already on the waitlist (active entries only)
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

  // Calculate next position among active waiters
  const lastEntry = await Waitlist.findOne({
    book: bookId,
    status: { $in: ["waiting", "notified"] },
  }).sort({ position: -1 });
  const position = lastEntry ? lastEntry.position + 1 : 1;

  const entry = await Waitlist.create({
    book: bookId,
    user: req.user._id,
    position,
    status: "waiting",
  });

  res.status(201).json({
    success: true,
    message: `You have joined the waitlist at position #${position}`,
    position,
    entry,
  });
});

// @desc    Leave the waitlist for a book
// @route   DELETE /api/waitlist/:bookId
// @access  Authenticated member
exports.leaveWaitlist = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;

  const entry = await Waitlist.findOne({
    book: bookId,
    user: req.user._id,
    status: { $in: ["waiting", "notified"] },
  });

  if (!entry) {
    return res.status(404).json({
      success: false,
      message: "You are not on the waitlist for this book",
    });
  }

  entry.status = "cancelled";
  await entry.save();

  // Reorder positions for remaining active users
  await Waitlist.updateMany(
    { book: bookId, position: { $gt: entry.position }, status: { $in: ["waiting", "notified"] } },
    { $inc: { position: -1 } }
  );

  res.status(200).json({
    success: true,
    message: "You have been removed from the waitlist",
  });
});

// @desc    Get current user's waitlist position for a book
// @route   GET /api/waitlist/:bookId/position
// @access  Authenticated
exports.getMyPosition = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;

  const entry = await Waitlist.findOne({
    book: bookId,
    user: req.user._id,
    status: { $in: ["waiting", "notified"] },
  });

  if (!entry) {
    return res.status(200).json({
      success: true,
      onWaitlist: false,
      position: null,
      status: null,
    });
  }

  const totalWaiting = await Waitlist.countDocuments({
    book: bookId,
    status: { $in: ["waiting", "notified"] },
  });

  res.status(200).json({
    success: true,
    onWaitlist: true,
    position: entry.position,
    status: entry.status,
    expiresAt: entry.expiresAt,
    totalWaiting,
  });
});

// @desc    Get current user's full waitlist (all books they're waiting for)
// @route   GET /api/waitlist/my-waitlist
// @access  Authenticated
exports.getMyWaitlist = catchAsyncErrors(async (req, res, next) => {
  const entries = await Waitlist.find({
    user: req.user._id,
    status: { $in: ["waiting", "notified"] },
  })
    .populate("book", "title author coverImage category ISBN availability")
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    count: entries.length,
    waitlist: entries,
  });
});

// @desc    Claim a notified waitlist slot (borrow the book)
// @route   POST /api/waitlist/:bookId/claim
// @access  Authenticated member
exports.claimWaitlistSlot = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;

  const entry = await Waitlist.findOne({
    book: bookId,
    user: req.user._id,
    status: "notified",
  });

  if (!entry) {
    return res.status(404).json({
      success: false,
      message: "No notified waitlist entry found for this book",
    });
  }

  // Check if the claim window has expired
  if (entry.expiresAt && new Date() > entry.expiresAt) {
    entry.status = "expired";
    await entry.save();
    return res.status(400).json({
      success: false,
      message: "Your claim window has expired",
    });
  }

  // Mark as fulfilled
  entry.status = "fulfilled";
  await entry.save();

  res.status(200).json({
    success: true,
    message: "Waitlist slot claimed — proceed to borrow the book",
  });
});

// Internal helper: notify the next person in the waitlist when a book is returned
// Called from borrowController after a successful return
exports.notifyNextInWaitlist = async (bookId) => {
  const next = await Waitlist.findOne({
    book: bookId,
    position: 1,
    status: "waiting",
  })
    .populate("user", "name email")
    .populate("book", "title");

  if (!next) return;

  // Set 24h claim window and mark as notified
  next.status = "notified";
  next.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await next.save();

  // Send notification email
  try {
    await sendEmail({
      email: next.user.email,
      subject: `Good news! "${next.book.title}" is now available — Smart Library`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">📚 Your Waitlisted Book is Available!</h2>
          <p>Hi <strong>${next.user.name}</strong>,</p>
          <p>The book <strong>"${next.book.title}"</strong> you were waiting for is now available to borrow.</p>
          <p>You are <strong>first in line</strong> — you have <strong>24 hours</strong> to claim it before the slot is passed to the next person.</p>
          <p>Log in to the Smart Library to borrow it now!</p>
          <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">Smart Library Management System</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Waitlist notification email failed:", err);
  }
};
