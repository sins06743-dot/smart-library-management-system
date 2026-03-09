// Fine calculation utility
// Fine rate: ₹5 per day for overdue books

/**
 * Calculate fine for a returned book
 * @param {Date} returnDate - The due date for returning the book
 * @param {Date} actualReturnDate - The actual date the book was returned
 * @returns {number} - Fine amount in INR
 */
const calculateFine = (returnDate, actualReturnDate) => {
  const FINE_PER_DAY = 5; // ₹5 per overdue day

  // Convert to dates if not already
  const due = new Date(returnDate);
  const returned = new Date(actualReturnDate);

  // If returned on time or early, no fine
  if (returned <= due) {
    return 0;
  }

  // Calculate overdue days
  const msPerDay = 24 * 60 * 60 * 1000;
  const overdueDays = Math.ceil((returned - due) / msPerDay);

  return overdueDays * FINE_PER_DAY;
};

module.exports = calculateFine;
