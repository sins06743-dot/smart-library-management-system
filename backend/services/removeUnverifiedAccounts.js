const cron = require("node-cron");
const User = require("../models/userModel");

// Cron job: runs every day at midnight (00:00)
// Deletes unverified accounts that are older than 24 hours
const removeUnverifiedAccounts = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running unverified accounts cleanup job...");

    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Delete unverified users created more than 24 hours ago
      const result = await User.deleteMany({
        verified: false,
        createdAt: { $lt: twentyFourHoursAgo },
      });

      console.log(`Removed ${result.deletedCount} unverified accounts`);
    } catch (error) {
      console.error("Error in unverified accounts cleanup job:", error);
    }
  });
};

module.exports = removeUnverifiedAccounts;
