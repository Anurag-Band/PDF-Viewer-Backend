require("dotenv").config({
  path: "../../.env",
});
const aws = require("aws-sdk");
const fs = require("fs");
const multer = require("multer");

const bucketName = process.env.AWS_S3_BUCKET_NAME;

const S3 = new aws.S3();

const dir = "../public/inputPdfs";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: fileStorageEngine });

// UPLOAD FILE TO S3
function uploadFile(file, inputFilePath, user) {
  const fileStream = fs.createReadStream(inputFilePath);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: `${user.id}_${Date.now()}_${file?.originalname}`,
  };

  return S3.upload(uploadParams).promise();
}

module.exports = { upload, uploadFile };
