require("dotenv").config({
  path: "../../.env",
});
const router = require("express").Router();
const { isUserLoggedIn } = require("../middlewares/userMiddlewares");
const { upload } = require("../utils/fileUploadHelper");
const {
  uploadPdfs,
  getAllPdfs,
  getPdfById,
} = require("../controllers/file.controller");

// for uploading PDF to AWS S3
router.post("/upload/pdf", isUserLoggedIn, upload.single("file"), uploadPdfs);

router.get("/pdf/all", isUserLoggedIn, getAllPdfs);

router.get("/pdf/:pdfId", isUserLoggedIn, getPdfById);

module.exports = router;