import axios from "axios";
import s3Client from "./awsS3.js";
import { environment } from "../../utils/environment.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const uploadProfileImageToS3 = async (picture) => {
  // Fetch the user's profile picture
  const response = await axios.get(picture, { responseType: "arraybuffer" });
  const fileBuffer = Buffer.from(response.data, "binary");

  // Dynamically determine the content type based on the URL extension or other methods

  const contentType = response.headers["content-type"] || "image/png";
  const extension = contentType.split("/")[1];

  // Generate a unique filename
  const fileName = `profile/image-${Date.now()}.${extension}`;

  const command = {
    Bucket: environment.AWS_S3_BUCKET, // Your S3 bucket name
    Key: fileName, // The file name you want to save as in S3
    Body: fileBuffer, // The file buffer
    ContentType: contentType, // Set the appropriate content type
    ACL: "public-read", // To make the file publicly accessible
  };

  await s3Client.send(new PutObjectCommand(command));

  return `https://${environment.AWS_S3_BUCKET}.s3.${environment.AWS_S3_REGION}.amazonaws.com/${fileName}`;
};

export default uploadProfileImageToS3;
