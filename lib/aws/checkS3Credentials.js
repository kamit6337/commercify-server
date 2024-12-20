import { environment } from "../../utils/environment.js";
import { HeadBucketCommand } from "@aws-sdk/client-s3";
import s3Client from "./awsS3.js";

const checkS3Credentials = async () => {
  try {
    // Replace with your bucket name
    const bucketName = environment.AWS_S3_BUCKET;

    // Send the HeadBucketCommand to check access
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    return true; // Credentials and bucket are valid
  } catch (error) {
    console.error("AWS S3 Credential or Bucket Validation Failed:", error);
    return false; // Credentials or bucket are invalid
  }
};

export default checkS3Credentials;
