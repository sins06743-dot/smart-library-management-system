const express = require("express");
const router = express.Router();
const {
  issueBook,
  returnBook,
  getAllRecords,
  getMyRecords,
  getOverdueRecords,
  issueByQR,
  returnByQR,
} = require("../controllers/borrowController");
const {
  isAuthenticated,
  isAdmin,
} = require("../middlewares/authMiddleware");

router.post("/issue", isAuthenticated, issueBook);
router.post("/issue-qr", isAuthenticated, issueByQR);
router.put("/return/:id", isAuthenticated, returnBook);
router.put("/return-qr", isAuthenticated, returnByQR);
router.get("/records", isAuthenticated, isAdmin, getAllRecords);
router.get("/my-records", isAuthenticated, getMyRecords);
router.get("/overdue", isAuthenticated, isAdmin, getOverdueRecords);

module.exports = router;
