const app = require("./app");
require("dotenv").config({
  path: "../.env",
});
const aws = require("aws-sdk");
const PORT = process.env.PORT || 5001;

// database
const db = require("./models/index");

db.sequelize
  .sync()
  .then(() => {
    console.log("DB Synced !");
  })
  .catch((err) => {
    console.log("~~~~ Failed to sync db: " + err.message);
  });

// AWS Config
aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_SECRET,
  region: "us-east-1",
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  process.exit(1);
});

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Stack: ${err.stack}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// listing on PORT
app.listen(PORT, () => {
  console.log(`Server is Running on PORT:${PORT}`);
});