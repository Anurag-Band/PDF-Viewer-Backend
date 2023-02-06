const { exec } = require("child_process");
const fs = require("fs");

const outputDir = "../public/outputPdfs";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function compressPDF(inputFilePath, user) {
  const outputFilePath = `${outputDir}/output_${user.id}_${Date.now()}.pdf`;

  return new Promise((resolve, reject) => {
    exec(
      `gs  -q -dNOPAUSE -dBATCH -dSAFER  -sDEVICE=pdfwrite  -dCompatibilityLevel=1.3  -dPDFSETTINGS=/ebook  -dEmbedAllFonts=true  -dSubsetFonts=true  -dAutoRotatePages=/None  -dColorImageDownsampleType=/Bicubic  -dColorImageResolution=72  -dGrayImageDownsampleType=/Bicubic  -dGrayImageResolution=72  -dMonoImageDownsampleType=/Subsample  -dMonoImageResolution=72  -sOutputFile=${outputFilePath}  ${inputFilePath}`,
      (err, stdout, stderr) => {
        if (err) {
          console.log("Error occured in File Compression!", err);
          reject(err);
        }
        console.log("file compressed !!", outputFilePath);
        resolve(outputFilePath);
      }
    );
  });
}

module.exports = compressPDF;
