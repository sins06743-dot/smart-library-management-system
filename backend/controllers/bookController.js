const cloudinary = require("cloudinary").v2;
const QRCode = require("qrcode");
const Book = require("../models/bookModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// @desc    Add a new book
// @route   POST /api/books
// @access  Admin only
exports.addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, category, ISBN, description } = req.body;

  if (!title || !author || !category || !ISBN) {
    return res.status(400).json({
      success: false,
      message: "Please provide title, author, category and ISBN",
    });
  }

  let coverImage = "";

  // Handle cover image upload to Cloudinary
  if (req.files && req.files.coverImage) {
    const file = req.files.coverImage;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "smart-library/books",
    });
    coverImage = result.secure_url;
  }

  const book = await Book.create({
    title,
    author,
    category,
    ISBN,
    description,
    coverImage,
  });

  // Generate QR code for the book
  try {
    const qrData = JSON.stringify({ bookId: book._id.toString(), title: book.title });
    const qrCode = await QRCode.toDataURL(qrData);
    book.qrCode = qrCode;
    await book.save();
  } catch (qrError) {
    console.error("QR generation failed:", qrError);
  }

  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});

// @desc    Get all books with search and pagination
// @route   GET /api/books
// @access  Public
exports.getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const { search, page = 1, limit = 10 } = req.query;

  // Build search query
  let query = {};
  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    };
  }

  const totalBooks = await Book.countDocuments(query);
  const books = await Book.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    totalBooks,
    currentPage: Number(page),
    totalPages: Math.ceil(totalBooks / limit),
    books,
  });
});

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  res.status(200).json({
    success: true,
    book,
  });
});

// @desc    Update book details
// @route   PUT /api/books/:id
// @access  Admin only
exports.updateBook = catchAsyncErrors(async (req, res, next) => {
  let book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  // Handle cover image update
  if (req.files && req.files.coverImage) {
    const file = req.files.coverImage;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "smart-library/books",
    });
    req.body.coverImage = result.secure_url;
  }

  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    book,
  });
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Admin only
exports.deleteBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  await book.deleteOne();

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});

// @desc    Regenerate QR code for a book
// @route   PUT /api/books/:id/regenerate-qr
// @access  Admin
exports.regenerateQR = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  const qrData = JSON.stringify({ bookId: book._id.toString(), title: book.title });
  book.qrCode = await QRCode.toDataURL(qrData);
  await book.save();
  res.status(200).json({ success: true, message: "QR code regenerated", book });
});

// @desc    Get book by scanning QR data
// @route   POST /api/books/scan
// @access  Authenticated
exports.getBookByQR = catchAsyncErrors(async (req, res, next) => {
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
  const book = await Book.findById(parsed.bookId);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  res.status(200).json({ success: true, book });
});
