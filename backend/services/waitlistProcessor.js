const cron = require("node-cron");
const Waitlist = require("../models/waitlistModel");
const sendEmail = require("../utils/sendEmail");

// Hourly cron (0 * * * *): expires unclaimed notified slots and advances the queue
const startWaitlistProcessor = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      // Step 1: Find notified entries whose 24h claim window has expired
      const expired = await Waitlist.find({
        status: "notified",
        expiresAt: { $lt: new Date() },
      }).populate("book", "title");

      for (const entry of expired) {
        entry.status = "expired";
        await entry.save();

        // Step 2: Reorder — decrement positions for waiters behind the expired entry
        await Waitlist.updateMany(
          {
            book: entry.book._id,
            status: "waiting",
            position: { $gt: entry.position },
          },
          { $inc: { position: -1 } }
        );

        // Step 3: Advance the queue — notify the new first-in-line
        const next = await Waitlist.findOne({
          book: entry.book._id,
          status: "waiting",
          position: 1,
        })
          .populate("user", "name email")
          .populate("book", "title");

        if (next) {
          next.status = "notified";
          next.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
          await next.save();

          try {
            await sendEmail({
              email: next.user.email,
              subject: `"${next.book.title}" is now available for you — Smart Library`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #4f46e5;">📚 Your Turn to Claim!</h2>
                  <p>Hi <strong>${next.user.name}</strong>,</p>
                  <p>The previous person in the waitlist for <strong>"${next.book.title}"</strong> did not claim it in time.</p>
                  <p>You are now <strong>first in line</strong> — you have <strong>24 hours</strong> to log in and borrow it.</p>
                  <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">Smart Library Management System</p>
                </div>
              `,
            });
          } catch (emailErr) {
            console.error("Waitlist advance notification failed:", emailErr);
          }
        }
      }

      if (expired.length > 0) {
        console.log(`Waitlist processor: expired ${expired.length} unclaimed slot(s)`);
      }
    } catch (err) {
      console.error("Waitlist processor error:", err);
    }
  });

  console.log("Waitlist processor cron started (runs every hour)");
};

module.exports = startWaitlistProcessor;
