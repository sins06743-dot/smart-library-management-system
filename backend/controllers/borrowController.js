const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const Waitlist = require("../models/waitlistModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const calculateFine = require("../utils/fineCalculator");
const sendEmail = require("../utils/sendEmail");
const {
  borrowConfirmTemplate,
  returnConfirmTemplate,
  bookAvailableTemplate,
} = require("../utils/emailTemplates");

// @desc    Issue a book to a member
// @route   POST /api/borrow/issue
// @access  Authenticated member
exports.issueBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({
      success: false,
      message: "Please provide book ID",
    });
  }

  // Find the book
  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  // Check if book is available
  if (!book.availability) {
    return res.status(400).json({
      success: false,
      message: "This book is currently not available",
    });
  }

  // Check if user already has this book borrowed
  const existingBorrow = await Borrow.findOne({
    user: req.user._id,
    book: bookId,
    status: "borrowed",
  });

  if (existingBorrow) {
    return res.status(400).json({
      success: false,
      message: "You already have this book borrowed",
    });
  }

  const issueDate = new Date();
  // Return date is 14 days from now
  const returnDate = new Date(issueDate.getTime() + 14 * 24 * 60 * 60 * 1000);

  // Create borrow record
  const borrow = await Borrow.create({
    user: req.user._id,
    book: bookId,
    issueDate,
    returnDate,
  });

  // Update book availability
  await Book.findByIdAndUpdate(bookId, { availability: false });

  // Send confirmation email
  try {
    await sendEmail({
      email: req.user.email,
      subject: "Book Issued Successfully - Smart Library",
      html: borrowConfirmTemplate(req.user.name, book.title, issueDate, returnDate),
    });
  } catch (error) {
    console.error("Email sending failed:", error);
  }

  res.status(201).json({
    success: true,
    message: "Book issued successfully",
    borrow,
  });
});

// @desc    Return a book
// @route   PUT /api/borrow/return/:id
// @access  Authenticated member/admin
exports.returnBook = catchAsyncErrors(async (req, res, next) => {
  const borrow = await Borrow.findById(req.params.id).populate("book user");

  if (!borrow) {
    return res.status(404).json({
      success: false,
      message: "Borrow record not found",
    });
  }

  // Check if already returned
  if (borrow.status === "returned") {
    return res.status(400).json({
      success: false,
      message: "Book has already been returned",
    });
  }

  const actualReturnDate = new Date();

  // Calculate fine
  const fine = calculateFine(borrow.returnDate, actualReturnDate);

  // Update borrow record
  borrow.status = "returned";
  borrow.actualReturnDate = actualReturnDate;
  borrow.fine = fine;
  await borrow.save();

  // Update book availability to true
  await Book.findByIdAndUpdate(borrow.book._id, { availability: true });

  // Check waitlist and notify next person
  try {
    const nextInLine = await Waitlist.findOne({
      book: borrow.book._id,
      status: "waiting",
    })
      .sort({ position: 1 })
      .populate("user", "name email")
      .populate("book", "title");

    if (nextInLine) {
      nextInLine.status = "notified";
      nextInLine.notifiedAt = new Date();
      nextInLine.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await nextInLine.save();

      await sendEmail({
        email: nextInLine.user.email,
        subject: `Book Available: ${nextInLine.book.title} - Smart Library`,
        html: bookAvailableTemplate(
          nextInLine.user.name,
          nextInLine.book.title,
          nextInLine.expiresAt
        ),
      });
    }
  } catch (waitlistError) {
    console.error("Waitlist notification failed:", waitlistError);
  }

  // Send return confirmation email
  try {
    await sendEmail({
      email: borrow.user.email,
      subject: "Book Returned Successfully - Smart Library",
      html: returnConfirmTemplate(borrow.user.name, borrow.book.title, fine),
    });
  } catch (error) {
    console.error("Email sending failed:", error);
  }

  res.status(200).json({
    success: true,
    message: "Book returned successfully",
    fine,
    borrow,
  });
});

// @desc    Get all borrow records (Admin)
// @route   GET /api/borrow/records
// @access  Admin only
exports.getAllRecords = catchAsyncErrors(async (req, res, next) => {
  const records = await Borrow.find()
    .populate("user", "name email")
    .populate("book", "title author ISBN")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: records.length,
    records,
  });
});

// @desc    Get current user's borrow records
// @route   GET /api/borrow/my-records
// @access  Authenticated member
exports.getMyRecords = catchAsyncErrors(async (req, res, next) => {
  const records = await Borrow.find({ user: req.user._id })
    .populate("book", "title author ISBN coverImage category")
    .sort({ issueDate: -1 });

  res.status(200).json({
    success: true,
    count: records.length,
    records,
  });
});

// @desc    Get all overdue records (Admin)
// @route   GET /api/borrow/overdue
// @access  Admin only
exports.getOverdueRecords = catchAsyncErrors(async (req, res, next) => {
  const overdueRecords = await Borrow.find({
    status: "borrowed",
    returnDate: { $lt: new Date() },
  })
    .populate("user", "name email")
    .populate("book", "title author ISBN")
    .sort({ returnDate: 1 });

  res.status(200).json({
    success: true,
    count: overdueRecords.length,
    records: overdueRecords,
  });
});

// @desc    Issue book via QR scan
// @route   POST /api/borrow/issue-qr
// @access  Member
exports.issueByQR = catchAsyncErrors(async (req, res, next) => {
  const { qrData } = req.body;
  if (!qrData) {
    return res.status(400).json({ success: false, message: "QR data is required" });
  }
  let parsed;
  try {
    parsed = JSON.parse(qrData);
  } catch {
    return res.status(400).json({ success: false, message: "Invalid QR data" });
  }
  req.body.bookId = parsed.bookId;
  return exports.issueBook(req, res, next);
});

// @desc    Return book via QR scan
// @route   PUT /api/borrow/return-qr
// @access  Authenticated
exports.returnByQR = catchAsyncErrors(async (req, res, next) => {
  const { qrData } = req.body;
  if (!qrData) {
    return res.status(400).json({ success: false, message: "QR data is required" });
  }
  let parsed;
  try {
    parsed = JSON.parse(qrData);
  } catch {
    return res.status(400).json({ success: false, message: "Invalid QR data" });
  }

  // Find the active borrow record for this book
  // Admin can return any book; members can only return their own
  const borrowQuery = { book: parsed.bookId, status: "borrowed" };
  if (req.user.role !== "admin") {
    borrowQuery.user = req.user._id;
  }
  const borrow = await Borrow.findOne(borrowQuery);

  if (!borrow) {
    return res.status(404).json({ success: false, message: "No active borrow record found for this book" });
  }

  req.params.id = borrow._id.toString();
  return exports.returnBook(req, res, next);
});
