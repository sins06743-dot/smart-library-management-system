const express = require("express");
const router = express.Router();
const {
  addReview,
  getBookReviews,
  updateReview,
  deleteReview,
  toggleApproval,
} = require("../controllers/reviewController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

router.post("/:bookId", isAuthenticated, addReview);
router.get("/:bookId", getBookReviews);
router.put("/:reviewId", isAuthenticated, updateReview);
router.delete("/:reviewId", isAuthenticated, deleteReview);
router.put("/:reviewId/approve", isAuthenticated, isAdmin, toggleApproval);

module.exports = router;
