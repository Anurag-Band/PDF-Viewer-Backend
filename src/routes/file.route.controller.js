require("dotenv").config({
  path: "../../.env",
});
const router = require("express").Router();
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const asyncHandler = require("express-async-handler");
const db = require("../models");
const { isUserLoggedIn } = require("../middlewares/userMiddlewares");
const User = db.user;
const File = db.file;
const jwt = require("jsonwebtoken");

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// AWS Config
aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: "us-east-1",
});

const S3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: S3,
    acl: "public-read",
    bucket: BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `${Date.now()}-${file?.originalname}`);
    },
  }),
});

// for uploading PDF to AWS S3
router.post(
  "/upload/pdf",
  isUserLoggedIn,
  upload.single("file"),
  asyncHandler(async (req, res, next) => {
    // Save user to database
    File.create({
      userEmailId: req.user.email,
      filePublicUrl: req.file.location,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    })
      .then((file) => {
        if (file) {
          console.log(file);
          res
            .status(200)
            .send({ message: "File Upladed Successfully !", file });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: err.message || "error while uploading file",
        });
      });

    // res.send("Successfully uploaded " + req?.file?.location + " location!");
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

// router.get(
//   "/pdf/all",
//   isUserLoggedIn,
//   asyncHandler(async (req, res, next) => {
//     const files = await File.findAll({
//       where: {
//         userEmailId: req.user.email,
//       },
//     });

//     const userFiles = files.map((f) => f.dataValues);

//     res.status(200).send(userFiles);
//   })
// );

module.exports = router;
