const express = require("express");
const router = express.Router();
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  regenerateQR,
  getBookByQR,
} = require("../controllers/bookController");
const {
  isAuthenticated,
  isAdmin,
} = require("../middlewares/authMiddleware");

router.get("/", getAllBooks);
router.post("/scan", isAuthenticated, getBookByQR);
router.get("/:id", getBookById);
router.post("/", isAuthenticated, isAdmin, addBook);
router.put("/:id", isAuthenticated, isAdmin, updateBook);
router.delete("/:id", isAuthenticated, isAdmin, deleteBook);
router.put("/:id/regenerate-qr", isAuthenticated, isAdmin, regenerateQR);

module.exports = router;
