import AWS from "aws-sdk";

const uploadImage = async (file, imageKey) => {
  let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_Access_Key_Id,
    secretAccessKey: process.env.AWS_Secret_Key,
    region: process.env.AWS_REGION,
  });

  //Where you want to store your file

  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageKey,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  await s3bucket.upload(params, async function (err, data) {
    if (err) {
      console.log(err, "err 1"); ////////////////////////////////////
      return false;
    } else {
      console.log("here s3bucket"); ////////////////////////////////
      return true;
    }
  });

  return false;
};

export default uploadImage;
