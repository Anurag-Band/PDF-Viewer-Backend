require("dotenv").config({
  path: "../../.env",
});
const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const db = require("../models");
const File = db.file;
const { isUserLoggedIn } = require("../middlewares/userMiddlewares");
const { upload, uploadFile } = require("../utils/fileUploadHelper");
const compressPDF = require("../utils/fileCompressHelper");
const fs = require("fs");
const util = require("util");
const isFilePathNameValid = require("../utils/isFilePathNameValid");
const unlinkFile = util.promisify(fs.unlink);

// for uploading PDF to AWS S3
router.post(
  "/upload/pdf",
  isUserLoggedIn,
  upload.single("file"),
  asyncHandler(async (req, res, next) => {
    const inputFile = req.file;
    let inputFilePath = req.file.path;
    const user = req.user;
    const MAX_UPLOAD_LIMIT = 2 * 1000 * 1000; // Preferred:- 6MB // Reduced to 2MB for Performance Improvement...

    if (inputFile.size > MAX_UPLOAD_LIMIT) {
      // Checking file pathname for any unsupported special charecter
      const result = isFilePathNameValid(inputFilePath);

      if (result === false) {
        return res.status(401).send({
          message:
            "Invalid File Name - Is should not contain any Special Character!",
        });
      } else {
        try {
          inputFilePath = await compressPDF(inputFilePath, user);
        } catch (error) {
          if (error) {
            return res.status(401).send({
              message: "Error occured in File Compression - Invalid File!",
            });
          }
        }
      }
    }

    // uploading to AWS S3
    const result = await uploadFile(req.file, inputFilePath, user);

    // Deleting from local if uploaded in S3 bucket
    await unlinkFile(inputFilePath.toString());

    // Save user to database
    File.create({
      userEmailId: req.user.email,
      filePublicUrl: result.Location,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    })
      .then((file) => {
        if (file) {
          res
            .status(200)
            .send({ message: "File Upladed Successfully !", file });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "error while uploading file to database",
        });
      });

    // res.send("Successfully uploaded " + req?.file?.location + " location!");
  })
);

router.get(
  "/pdf/all",
  isUserLoggedIn,
  asyncHandler(async (req, res, next) => {
    const files = await File.findAll({
      where: {
        userEmailId: req.user.email,
      },
    });

    const userFiles = files.map((f) => f.dataValues);

    res.status(200).send(userFiles);
  })
);

router.get(
  "/pdf/:pdfId",
  isUserLoggedIn,
  asyncHandler(async (req, res, next) => {
    const file = await File.findOne({
      where: {
        id: req.params.pdfId,
      },
    });

    const userFile = file?.dataValues;

    if (!userFile) {
      return res.status(404).send("pdf not found !");
    }
    res.status(200).send(userFile);
  })
);

module.exports = router;
