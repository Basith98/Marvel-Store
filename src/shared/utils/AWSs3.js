const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// import dotenv from 'dotenv'

// dotenv.config()
console.log("import dotenv from 'dotenv'");
const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_ACCESS_KEY_ID;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

exports.uploadFile = (fileBuffer, fileName, mimetype) => {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype,
  };

  return s3Client.send(new PutObjectCommand(uploadParams));
};

exports.deleteFile = (fileName) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3Client.send(new DeleteObjectCommand(deleteParams));
};

exports.getObjectSignedUrl = (key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params);
  const seconds = 60;
  // const url = getSignedUrl(s3Client, command, { expiresIn: seconds });
  const url = " ";

  return url;
};
