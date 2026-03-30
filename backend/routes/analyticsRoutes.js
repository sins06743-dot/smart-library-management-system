const express = require("express");
const router = express.Router();
const { getMyStats } = require("../controllers/analyticsController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/my-stats", isAuthenticated, getMyStats);

module.exports = router;
