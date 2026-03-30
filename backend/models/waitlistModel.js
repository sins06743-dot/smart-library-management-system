const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  position: { type: Number, required: true },
  status: {
    type: String,
    enum: ["waiting", "notified", "fulfilled", "expired", "cancelled"],
    default: "waiting",
  },
  notifiedAt: { type: Date },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

waitlistSchema.index({ book: 1, user: 1 }, { unique: true });
waitlistSchema.index({ book: 1, status: 1, position: 1 });

module.exports = mongoose.model("Waitlist", waitlistSchema);
