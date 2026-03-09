const express = require("express");
const router = express.Router();
const {
  issueBook,
  returnBook,
  getAllRecords,
  getMyRecords,
  getOverdueRecords,
} = require("../controllers/borrowController");
const {
  isAuthenticated,
  isAdmin,
} = require("../middlewares/authMiddleware");

router.post("/issue", isAuthenticated, issueBook);
router.put("/return/:id", isAuthenticated, returnBook);
router.get("/records", isAuthenticated, isAdmin, getAllRecords);
router.get("/my-records", isAuthenticated, getMyRecords);
router.get("/overdue", isAuthenticated, isAdmin, getOverdueRecords);

module.exports = router;
