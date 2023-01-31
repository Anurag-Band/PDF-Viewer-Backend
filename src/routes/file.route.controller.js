require("dotenv").config({
  path: "../../.env",
});
const router = require("express").Router();
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const asyncHandler = require("express-async-handler");
const db = require("../models");
const User = db.user;

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const S3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: S3,
    acl: "public-read",
    bucket: BUCKET_NAME,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname + "-" + Date.now());
    },
  }),
});

// for uploading PDF to AWS S3
router.post(
  "/upload/pdf",
  upload.single("file"),
  asyncHandler(async (req, res, next) => {
    console.log(req.file);
    res.send("Successfully uploaded " + req.file.location + " location!");
  })
);

// for listing all files
router.get("/list", async (req, res) => {
  let r = await S3.listObjectsV2({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
  }).promise();
  let x = r.Contents.map((item) => item.Key);
  res.send(x);
});

module.exports = router;
