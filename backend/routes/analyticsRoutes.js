const express = require("express");
const router = express.Router();
const {
  getMyReadingStats,
  getMyMonthlyStats,
  getMyCategoryBreakdown,
  getMyReadingStreak,
  getMyTopAuthors,
  getAdminAnalytics,
} = require("../controllers/analyticsController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

router.get("/my-stats", isAuthenticated, getMyReadingStats);
router.get("/my-monthly", isAuthenticated, getMyMonthlyStats);
router.get("/my-categories", isAuthenticated, getMyCategoryBreakdown);
router.get("/my-streak", isAuthenticated, getMyReadingStreak);
router.get("/my-authors", isAuthenticated, getMyTopAuthors);
router.get("/admin", isAuthenticated, isAdmin, getAdminAnalytics);

module.exports = router;
