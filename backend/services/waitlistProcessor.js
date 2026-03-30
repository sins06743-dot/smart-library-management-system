const cron = require("node-cron");
const Waitlist = require("../models/waitlistModel");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const sendEmail = require("../utils/sendEmail");
const { bookAvailableTemplate } = require("../utils/emailTemplates");

const processWaitlist = () => {
  // Run every hour
  cron.schedule("0 * * * *", async () => {
    try {
      // Find expired notified entries
      const expired = await Waitlist.find({
        status: "notified",
        expiresAt: { $lt: new Date() },
      }).populate("book", "title").populate("user", "name email");

      for (const entry of expired) {
        entry.status = "expired";
        await entry.save();

        // Reorder remaining waiters
        await Waitlist.updateMany(
          {
            book: entry.book._id,
            status: "waiting",
            position: { $gt: entry.position },
          },
          { $inc: { position: -1 } }
        );

        // Notify next person in queue
        const nextEntry = await Waitlist.findOne({
          book: entry.book._id,
          status: "waiting",
        })
          .sort({ position: 1 })
          .populate("user", "name email")
          .populate("book", "title");

        if (nextEntry) {
          nextEntry.status = "notified";
          nextEntry.notifiedAt = new Date();
          nextEntry.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
          await nextEntry.save();

          try {
            await sendEmail({
              email: nextEntry.user.email,
              subject: `Book Available: ${nextEntry.book.title} - Smart Library`,
              html: bookAvailableTemplate(
                nextEntry.user.name,
                nextEntry.book.title,
                nextEntry.expiresAt
              ),
            });
          } catch (err) {
            console.error("Waitlist email failed:", err);
          }
        }
      }
    } catch (err) {
      console.error("Waitlist processor error:", err);
    }
  });
};

module.exports = processWaitlist;
