const cron = require("node-cron");
const Borrow = require("../models/borrowModel");
const sendEmail = require("../utils/sendEmail");
const { overdueReminderTemplate } = require("../utils/emailTemplates");
const calculateFine = require("../utils/fineCalculator");

// Cron job: runs every day at 9:00 AM
// Finds all overdue borrow records and sends reminder emails
const notifyUsers = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("Running overdue notification job...");

    try {
      const today = new Date();

      // Find all borrowed books that are overdue
      const overdueRecords = await Borrow.find({
        status: "borrowed",
        returnDate: { $lte: today },
      })
        .populate("user", "name email")
        .populate("book", "title");

      console.log(`Found ${overdueRecords.length} overdue records`);

      // Send reminder email to each user
      for (const record of overdueRecords) {
        try {
          const fine = calculateFine(record.returnDate, today);

          await sendEmail({
            email: record.user.email,
            subject: "⚠️ Overdue Book Reminder - Smart Library",
            html: overdueReminderTemplate(
              record.user.name,
              record.book.title,
              record.returnDate,
              fine
            ),
          });

          console.log(`Reminder sent to ${record.user.email}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${record.user.email}:`, emailError);
        }
      }

      console.log("Overdue notification job completed");
    } catch (error) {
      console.error("Error in overdue notification job:", error);
    }
  });
};

module.exports = notifyUsers;
