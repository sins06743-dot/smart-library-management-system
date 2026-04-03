const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const mongoose = require("mongoose");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const calculateFine = require("../utils/fineCalculator");
const sendEmail = require("../utils/sendEmail");
const {
  borrowConfirmTemplate,
  returnConfirmTemplate,
} = require("../utils/emailTemplates");
const { notifyNextInWaitlist } = require("./waitlistController");

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

  // Notify the next person on the waitlist (if any)
  await notifyNextInWaitlist(borrow.book._id);

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

// @desc    Return a book by scanning its QR code (book ID)
// @route   PUT /api/borrow/return-by-qr
// @access  Authenticated (members: own books only, admins: any)
exports.returnByQR = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({
      success: false,
      message: "Please provide a book ID",
    });
  }

  // Validate bookId is a proper MongoDB ObjectId to prevent NoSQL injection
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid book ID format",
    });
  }

  // Build query — members can only return their own; admins bypass ownership
  const query = { book: new mongoose.Types.ObjectId(bookId), status: "borrowed" };
  if (req.user.role !== "admin") {
    query.user = req.user._id;
  }

  const borrow = await Borrow.findOne(query).populate("book user");

  if (!borrow) {
    return res.status(404).json({
      success: false,
      message:
        req.user.role === "admin"
          ? "No active borrow record found for this book"
          : "You do not have this book checked out",
    });
  }

  const actualReturnDate = new Date();
  const fine = calculateFine(borrow.returnDate, actualReturnDate);

  borrow.status = "returned";
  borrow.actualReturnDate = actualReturnDate;
  borrow.fine = fine;
  await borrow.save();

  await Book.findByIdAndUpdate(borrow.book._id, { availability: true });
  await notifyNextInWaitlist(borrow.book._id);

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
    message: "Book returned via QR successfully",
    fine,
    borrow,
  });
});
