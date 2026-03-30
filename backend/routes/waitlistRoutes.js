const express = require("express");
const router = express.Router();
const {
  joinWaitlist,
  leaveWaitlist,
  getMyPosition,
  getMyWaitlist,
} = require("../controllers/waitlistController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/my-waitlist", isAuthenticated, getMyWaitlist);
router.post("/:bookId", isAuthenticated, joinWaitlist);
router.delete("/:bookId", isAuthenticated, leaveWaitlist);
router.get("/:bookId/position", isAuthenticated, getMyPosition);

module.exports = router;
