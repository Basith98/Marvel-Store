const crypto = require("crypto");
const { request } = require("http");
const sharp = require("sharp");
const { uploadFile } = require("../utils/AWSs3");
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

exports.imageSetUp = async (body, noOfImages) => {
  let response = {};

  let savedImageDetails = [];

  if (noOfImages > 1) {
    let imageDetails = await multipleImage(body);
    response.imageDetails = imageDetails;
  } else {
    let file = body.files;
    const caption = body.body.caption;
    let imageName = generateFileName();
    console.log("filesdddd", file);
    // let fileBuffer = await sharp(file.buffer)
    //   .resize({
    //     height: 1920,
    //     width: 1080,
    //   })
    //   .toBuffer();
    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080 })
      .toBuffer();

    console.log("filesss", fileBuffer);
    console.log("imageName", imageName);
    const Imagedata = await uploadFile(fileBuffer, imageName, file.mimetype);
    response.Imagedata = Imagedata;
    response.imageName = imageName;
  }
  return response;
};

multipleImage = async (body) => {
  console.log("multipleImage", body.file);
  let file = body.files;
  let savedImageDetails = [];
  for (let i = 0; i < file.length; i++) {
    let currentImageDetails = {};
    let imageName = generateFileName();
    let fileBuffer = await sharp(file[i].buffer)
      .resize({ height: 1080, width: 864 })
      .toBuffer();
    const Imagedata = await uploadFile(fileBuffer, imageName, file[i].mimetype);
    console.log("imageName", imageName);

    currentImageDetails.fieldName = file[i].fieldname;
    currentImageDetails.imageName = imageName;
    savedImageDetails.push(currentImageDetails);
  }
  return savedImageDetails;
};
