const dotenv = require("dotenv");

// Load environment variables from config.env
dotenv.config({ path: "./config/config.env" });

const app = require("./app");
const connectDB = require("./config/db");
const cloudinary = require("cloudinary").v2;
const notifyUsers = require("./services/notifyUsers");
const removeUnverifiedAccounts = require("./services/removeUnverifiedAccounts");
const processWaitlist = require("./services/waitlistProcessor");

// Configure Cloudinary for image uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 4000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Start cron jobs
notifyUsers();
removeUnverifiedAccounts();
processWaitlist();
console.log("Cron jobs started");

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
