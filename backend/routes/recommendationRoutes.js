const express = require("express");
const router = express.Router();
const {
  getRecommendations,
  getPopularBooks,
  getTrendingBooks,
} = require("../controllers/recommendationController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/", isAuthenticated, getRecommendations);
router.get("/popular", getPopularBooks);
router.get("/trending", getTrendingBooks);

module.exports = router;
