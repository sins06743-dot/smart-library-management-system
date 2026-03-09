const mongoose = require("mongoose");

// Book schema definition
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter book title"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Please enter book author"],
  },
  category: {
    type: String,
    required: [true, "Please enter book category"],
  },
  ISBN: {
    type: String,
    required: [true, "Please enter ISBN"],
    unique: true,
  },
  availability: {
    type: Boolean,
    default: true, // true = available, false = borrowed
  },
  coverImage: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", bookSchema);
