const mongoose = require("mongoose");

// Borrow schema - tracks book borrowing and returns
const borrowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: [true, "Book is required"],
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
    required: [true, "Return date is required"],
  },
  actualReturnDate: {
    type: Date,
  },
  fine: {
    type: Number,
    default: 0, // Fine in INR (₹5/day for overdue)
  },
  status: {
    type: String,
    enum: ["borrowed", "returned"],
    default: "borrowed",
  },
});

module.exports = mongoose.model("Borrow", borrowSchema);
