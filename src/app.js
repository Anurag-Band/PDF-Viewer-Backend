const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "pdf-viewer-mysql-aws-s3.netlify.app",
      "https://production--pdf-viewer-mysql-aws-s3.netlify.app",
    ],
    credentials: true,
  })
);

// regular middleware
app.use(express.json());
app.use(
  express.urlencoded({ extended: true, parameterLimit: 100000, limit: "500mb" })
);

// cookies and file middleware
app.use(cookieParser());

//morgan middleware
app.use(morgan("tiny"));

// for adding headers to requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

// test route
app.get("/", (req, res) => {
  return res.status(200).send("hello for root");
});

// import all routes here
const userRoute = require("./routes/user.routes");
const fileRoute = require("./routes/file.routes");

//  router middleware
app.use("/api/v1", userRoute);
app.use("/api/v1", fileRoute);

// exporting app for index.js
module.exports = app;
