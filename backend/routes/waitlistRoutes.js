const express = require("express");
const router = express.Router();
const {
  joinWaitlist,
  leaveWaitlist,
  getMyWaitlist,
  getBookWaitlist,
  getWaitlistPosition,
} = require("../controllers/waitlistController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

router.get("/my", isAuthenticated, getMyWaitlist);
router.post("/:bookId", isAuthenticated, joinWaitlist);
router.delete("/:bookId", isAuthenticated, leaveWaitlist);
router.get("/:bookId/position", isAuthenticated, getWaitlistPosition);
router.get("/:bookId", isAuthenticated, isAdmin, getBookWaitlist);

module.exports = router;
